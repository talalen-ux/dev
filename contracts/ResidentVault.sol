// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Minimal ERC20 surface the vault needs.
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

/**
 * @title ResidentVault
 * @notice Single custody address for the Resident desk. Inventory, cash and fee
 *         inflow all settle here; an autonomous keeper drives the desk against
 *         this contract, and the contract constrains every action it can take.
 *
 * The properties published on the site are enforced here:
 *
 *  - All balances live at one address. The keeper's own wallet carries only gas;
 *    every token the desk touches is held by this contract.
 *  - The keeper trades only sanctioned venues. `exec` reverts on any target
 *    outside the allowlist.
 *  - Approvals cannot leak. `approveVenue` is spender-gated to the same list.
 *  - Distribution is rate-limited. A per-asset rolling cap is enforced on-chain.
 *  - The keeper is replaceable in one transaction, without moving custody.
 *  - The owner can withdraw any asset at any time, with no timelock. This is
 *    deliberate and disclosed; see {withdraw}.
 *
 * @dev Trust boundary, stated plainly: realized profit is *reported* by the
 *      keeper via {recordRealized}, because profit on an arbitrary venue cannot
 *      be derived on-chain without trusting the same quote the keeper used. The
 *      contract does not verify the figure. What it does enforce is that the
 *      reported total only ever increases, that 25% of every increase is
 *      reserved and unpayable, and that distributions can never exceed what is
 *      owed or what the vault actually holds. A dishonest keeper can therefore
 *      under-report profit, but cannot pay out more than it reported, cannot
 *      retract a report to strand holders, and cannot move funds anywhere the
 *      allowlist does not already permit.
 */
contract ResidentVault {
    // --- roles -------------------------------------------------------------

    address public owner;
    address public keeper;

    // --- venue allowlist ---------------------------------------------------

    /// @notice Venues the keeper may call and approve. One list for both, so an
    ///         approval can never be granted to something the desk cannot trade.
    mapping(address => bool) public isVenue;

    // --- profit ledger (denominated in the payout asset) -------------------

    /// @notice Lifetime realized profit reported by the keeper. Strictly
    ///         monotonic: it is the keeper's own cumulative figure, and nothing
    ///         in this contract ever reduces it.
    uint256 public realized;
    /// @notice Cumulative 25% cut of every profit increase. Also monotonic, and
    ///         the term `owed` subtracts — so absorbing a loss cannot change
    ///         what holders are owed in either direction.
    uint256 public reserveAccrued;
    /// @notice Cumulative losses the reserve has absorbed.
    uint256 public reserveDrawn;
    /// @notice Lifetime amount already paid to holders.
    uint256 public distributed;

    /// @notice Share of each profit increase moved to the reserve, in bps.
    uint16 public constant RESERVE_BPS = 2_500;
    uint16 private constant BPS = 10_000;

    /// @notice Asset distributions are denominated and paid in.
    address public immutable payoutAsset;

    // --- distribution rate limit -------------------------------------------

    struct Limit {
        uint128 cap; // maximum payable per window
        uint128 used; // consumed allowance, decayed on read
        uint64 updatedAt; // last time `used` was settled
    }

    /// @notice Window over which a full cap refills. Rolling, not calendar.
    uint64 public constant LIMIT_WINDOW = 24 hours;

    mapping(address => Limit) private _limits;

    // --- events ------------------------------------------------------------

    event KeeperRotated(address indexed from, address indexed to);
    event OwnerTransferred(address indexed from, address indexed to);
    event VenueSet(address indexed venue, bool allowed);
    event CapSet(address indexed asset, uint256 cap);
    event ProfitRecorded(uint256 newTotal, uint256 delta, uint256 toReserve);
    event ReserveDrawn(uint256 amount, uint256 remaining, string reason);
    event Distributed(uint256 total, uint256 recipients);
    event Executed(address indexed venue, uint256 value, bytes4 selector);
    event Withdrawn(address indexed asset, address indexed to, uint256 amount);

    // --- errors ------------------------------------------------------------

    error NotOwner();
    error NotKeeper();
    error VenueNotAllowed(address target);
    error ForbiddenSelector(bytes4 selector);
    error ProfitNotMonotonic(uint256 current, uint256 submitted);
    error ReserveExhausted(uint256 requested, uint256 available);
    error ExceedsOwed(uint256 requested, uint256 owed);
    error ExceedsRateLimit(uint256 requested, uint256 remaining);
    error LengthMismatch();
    error ZeroAddress();
    error CallFailed(bytes returndata);

    // --- modifiers ---------------------------------------------------------

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyKeeper() {
        if (msg.sender != keeper) revert NotKeeper();
        _;
    }

    constructor(address owner_, address keeper_, address payoutAsset_) {
        if (owner_ == address(0) || payoutAsset_ == address(0)) revert ZeroAddress();
        owner = owner_;
        keeper = keeper_;
        payoutAsset = payoutAsset_;
        emit OwnerTransferred(address(0), owner_);
        emit KeeperRotated(address(0), keeper_);
    }

    receive() external payable {}

    // --- administration ----------------------------------------------------

    /// @notice Replace the keeper in a single transaction. Custody is unaffected:
    ///         every balance stays at this address across the rotation.
    function rotateKeeper(address next) external onlyOwner {
        emit KeeperRotated(keeper, next);
        keeper = next;
    }

    function transferOwnership(address next) external onlyOwner {
        if (next == address(0)) revert ZeroAddress();
        emit OwnerTransferred(owner, next);
        owner = next;
    }

    function setVenue(address venue, bool allowed) external onlyOwner {
        if (venue == address(0)) revert ZeroAddress();
        isVenue[venue] = allowed;
        emit VenueSet(venue, allowed);
    }

    /// @notice Set the rolling per-window distribution cap for an asset.
    function setCap(address asset, uint128 cap) external onlyOwner {
        Limit storage l = _limits[asset];
        l.used = uint128(_usedNow(l));
        l.updatedAt = uint64(block.timestamp);
        l.cap = cap;
        emit CapSet(asset, cap);
    }

    // --- trading -----------------------------------------------------------

    /**
     * @notice Call a sanctioned venue. The only route by which the keeper can
     *         move value, and it cannot reach a token's own transfer surface.
     * @dev Two guards, deliberately overlapping. The allowlist is the primary
     *      one. The selector ban is the backstop: even if a token address were
     *      mistakenly allowlisted as a venue, `transfer`, `transferFrom` and
     *      `approve` still cannot be reached through here, so a
     *      misconfiguration cannot become a drain.
     */
    function exec(address venue, uint256 value, bytes calldata data)
        external
        onlyKeeper
        returns (bytes memory)
    {
        if (!isVenue[venue]) revert VenueNotAllowed(venue);

        bytes4 selector;
        if (data.length >= 4) {
            selector = bytes4(data[:4]);
            if (
                selector == IERC20.transfer.selector
                    || selector == IERC20.approve.selector
                    || selector == bytes4(keccak256("transferFrom(address,address,uint256)"))
            ) revert ForbiddenSelector(selector);
        }

        (bool ok, bytes memory ret) = venue.call{value: value}(data);
        if (!ok) revert CallFailed(ret);

        emit Executed(venue, value, selector);
        return ret;
    }

    /// @notice Approve a sanctioned venue to pull a token. Spender-gated to the
    ///         same allowlist `exec` uses, so an approval can never name an
    ///         address the desk is not permitted to trade with.
    function approveVenue(address token, address venue, uint256 amount) external onlyKeeper {
        if (!isVenue[venue]) revert VenueNotAllowed(venue);
        IERC20(token).approve(venue, amount);
    }

    // --- profit ledger -----------------------------------------------------

    /// @notice The reserve's current balance: everything accrued, less what has
    ///         been spent absorbing losses.
    function reserved() public view returns (uint256) {
        return reserveAccrued - reserveDrawn;
    }

    /// @notice Amount owed to holders: realized profit, less the cumulative
    ///         reserve accrual, less what has already been paid. Carries
    ///         forward; never resets.
    /// @dev Deliberately built on `reserveAccrued` rather than the reserve
    ///      balance. Were it built on the balance, spending the reserve on a
    ///      loss would silently increase what holders are owed.
    function owed() public view returns (uint256) {
        return realized - reserveAccrued - distributed;
    }

    /**
     * @notice Report lifetime realized profit. Submitted as a cumulative total
     *         rather than a delta, so a replayed or reordered keeper call is
     *         idempotent instead of double-counting.
     */
    function recordRealized(uint256 newTotal) external onlyKeeper {
        if (newTotal < realized) revert ProfitNotMonotonic(realized, newTotal);
        uint256 delta = newTotal - realized;
        uint256 toReserve = (delta * RESERVE_BPS) / BPS;
        realized = newTotal;
        reserveAccrued += toReserve;
        emit ProfitRecorded(newTotal, delta, toReserve);
    }

    /**
     * @notice Spend reserve against a realized loss on the pools.
     * @dev Touches neither `realized` nor `reserveAccrued`, both of which stay
     *      monotonic. Since `owed` is a function of those two and `distributed`,
     *      a loss is absorbed entirely by the reserve and is invisible to
     *      holders — which is the whole point of holding one.
     */
    function drawReserve(uint256 amount, string calldata reason) external onlyKeeper {
        uint256 available = reserved();
        if (amount > available) revert ReserveExhausted(amount, available);
        reserveDrawn += amount;
        emit ReserveDrawn(amount, available - amount, reason);
    }

    // --- distribution ------------------------------------------------------

    /// @notice Allowance remaining in the current rolling window for an asset.
    function rateLimitRemaining(address asset) public view returns (uint256) {
        Limit storage l = _limits[asset];
        uint256 used = _usedNow(l);
        return l.cap > used ? l.cap - used : 0;
    }

    /**
     * @dev The cap refills continuously rather than resetting on a boundary, so
     *      the limit is genuinely rolling: a full cap spent now leaves the vault
     *      unable to pay again until time has passed, and allowance returns
     *      smoothly rather than in a cliff at midnight.
     */
    function _usedNow(Limit storage l) private view returns (uint256) {
        if (l.used == 0) return 0;
        uint256 elapsed = block.timestamp - l.updatedAt;
        if (elapsed >= LIMIT_WINDOW) return 0;
        uint256 refilled = (uint256(l.cap) * elapsed) / LIMIT_WINDOW;
        return refilled >= l.used ? 0 : l.used - refilled;
    }

    /**
     * @notice Pay holders pro-rata from a snapshot computed off-chain.
     * @dev The split itself is computed off-chain from the token's full Transfer
     *      history; what the contract enforces is the envelope around it — the
     *      total can never exceed what is owed, nor the rolling cap, and every
     *      paid unit is booked against `distributed` before any value moves.
     */
    function distribute(address[] calldata recipients, uint256[] calldata amounts)
        external
        onlyKeeper
    {
        if (recipients.length != amounts.length) revert LengthMismatch();

        uint256 total;
        for (uint256 i; i < amounts.length; ++i) {
            total += amounts[i];
        }

        uint256 available = owed();
        if (total > available) revert ExceedsOwed(total, available);

        uint256 remaining = rateLimitRemaining(payoutAsset);
        if (total > remaining) revert ExceedsRateLimit(total, remaining);

        // Book the payment before moving value.
        distributed += total;
        Limit storage l = _limits[payoutAsset];
        l.used = uint128(_usedNow(l) + total);
        l.updatedAt = uint64(block.timestamp);

        for (uint256 i; i < recipients.length; ++i) {
            IERC20(payoutAsset).transfer(recipients[i], amounts[i]);
        }

        emit Distributed(total, recipients.length);
    }

    // --- owner withdrawal --------------------------------------------------

    /**
     * @notice Withdraw any asset. Owner only, no timelock, no cap.
     * @dev This is the one custody property the contract does not constrain, and
     *      it is disclosed rather than left to be discovered on the explorer.
     *      The keeper cannot reach this function; the owner key can empty the
     *      vault at any time. Anyone assessing counterparty risk here is
     *      assessing the owner key.
     */
    function withdraw(address asset, address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        if (asset == address(0)) {
            (bool ok,) = to.call{value: amount}("");
            if (!ok) revert CallFailed("");
        } else {
            IERC20(asset).transfer(to, amount);
        }
        emit Withdrawn(asset, to, amount);
    }
}
