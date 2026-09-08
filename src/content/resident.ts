/**
 * Copy for the Resident landing page. Every figure here is quoted from the
 * desk's operating configuration; keep this file as the single source so the
 * section components stay layout-only.
 */

export const TOKEN = "$RES";
export const CHAIN = "Robinhood Chain";
export const QUOTE = "USDG";

export const NAV_LINKS = [
  { label: "Premise", href: "#premise" },
  { label: "Reference", href: "#reference" },
  { label: "Fillability", href: "#fillability" },
  { label: "Inventory", href: "#inventory" },
  { label: "Execution", href: "#execution" },
  { label: "LP Desk", href: "#lp-desk" },
  { label: "Payouts", href: "#payouts" },
  { label: "Custody", href: "#custody" },
  { label: "Parameters", href: "#parameters" },
] as const;

export const HERO_HEADLINE =
  "Systematic liquidity provision against reference-price dislocations in tokenized equities.";

export const HERO_STANDFIRST =
  "Resident is an autonomous market-making desk on Robinhood Chain. It prices every venue against the primary market, holds inventory where dislocations happen, sells into verified dislocations under strict profit rules, and pays 15% of realized profit to holders every 15 minutes once at least $300 is owed — redeploying the other 85% as working capital that funds new positions and absorbs pool losses.";

export const HERO_NOTE =
  "This page states the method, including the parts usually left vague. Every number below is read from the same configuration the running desk uses.";

export const PILLARS = [
  {
    icon: "reference" as const,
    eyebrow: "Priced against the primary",
    body: "Every venue is marked to the issuer's consolidated quote, refreshed every 15 seconds. Deviation is measured, not eyeballed.",
  },
  {
    icon: "probe" as const,
    eyebrow: "Fillability-tested",
    body: "Displayed price is not evidence. A dislocation counts only after a quoted liquidation clears the venue's own execution engine.",
  },
  {
    icon: "payout" as const,
    eyebrow: "15% to holders",
    body: "15% of realized profit is owed to holders and carries forward. It never resets, and it pays every 15 minutes.",
  },
] as const;

/** The capital cycle, rendered as the how-it-works diagram. */
export const CYCLE = [
  { step: "Fee flow", note: "Creator fees accrue in USDG; swept every 5 min" },
  { step: "Vault", note: "One on-chain fund address holds every balance" },
  {
    step: "Deployment",
    note: "Capacity-weighted round robin across the eligible set",
  },
  {
    step: "Standing inventory",
    note: "Acquired only at or below reference + 2%",
  },
  {
    step: "Dislocation",
    note: "δ ≥ +25% and the fillability probe returns yield",
  },
  { step: "Tranche exit", note: "≤20% of max size per order, 2 min cooldown" },
  {
    step: "Realized profit",
    note: "Proceeds less average cost basis of the size sold",
  },
] as const;

export const METHOD = [
  {
    n: "01",
    id: "premise",
    title: "The market microstructure premise",
    body: [
      "Tokenized equities on Robinhood Chain trade across a fragmented set of venues: Uniswap v3 pools at four fee tiers and Uniswap v4 pools at standard keys, quoted in USDG, in ETH, or in other stock tokens. Fragmentation plus thin depth produces a recurring phenomenon — a single aggressive order in a shallow pool moves its marginal price far from the value of the underlying share. That is a dislocation. With no resident market maker, it persists for minutes to days.",
      "A dislocated pool is not an anomaly to be lamented; it is an inventory-constrained profit opportunity. Whoever already holds the asset when the dislocation appears is the counterparty of record.",
    ],
    pull: "Be the standing inventory in every instrument where dislocations occur, and be the fastest disciplined seller when they do.",
  },
  {
    n: "02",
    id: "reference",
    title: "Reference pricing",
    body: [
      "For each instrument i the desk maintains a reference price P̂ᵢ(t) from the issuer's consolidated primary-market quote — bid/ask midpoint, multiplied by the token's corporate-action multiplier — refreshed every 15 seconds, with Chainlink tokenized-equity feeds as the fallback and a live Chainlink ETH/USD conversion for ETH-quoted venues.",
      "Outside the primary session (09:30–16:00 New York, weekdays) the reference is stale by construction. The desk widens every actionable threshold by a session premium θ rather than pretending it is live. Deviations in the parking band — below −95% or above +5,000% — are structural artifacts of pools initialized at boundary prices, and are discarded before they consume analysis.",
    ],
    formula: {
      expr: "δp(t)  =  ( Pp(t) − P̂i(t) )  /  P̂i(t)",
      caption: "Instantaneous deviation of pool p holding instrument i",
    },
  },
  {
    n: "03",
    id: "fillability",
    title: "Fillability: the anti-mirage test",
    body: [
      "Many pools advertise spectacular deviations against which no trade can execute. The desk admits a dislocation only after a fillability probe: a quoted liquidation of a fixed notional q₀ at reference, through the pool's own execution engine (Uniswap's QuoterV2 or the v4 Quoter), fees and impact included.",
      "The economic logic is exact. A genuine pump deposits the aggressor's own quote asset into the pool, so a genuine pump is always fillable; a mirage quotes nothing. Probe results are cached per pool and invalidated on a ±2% deviation movement, so the fleet of static artifacts is paid for once.",
    ],
    formula: {
      expr: "qualifies  ⟺  δp ≥ δ*   and   Φp = V_out( q₀ / P̂i ) ≥ φmin",
      caption: "A pool is a real dislocation only when both hold",
    },
  },
  {
    n: "04",
    id: "survey",
    title: "The liquidity survey and the eligible set",
    body: [
      "Daily, every instrument is classified by its impact function — the premium over reference paid by simulated aggressions of increasing notional through its best venue.",
      "Instruments where I(10⁴) ≤ 0.25% are deep: dislocations there are arbitraged away before inventory can monetize them, so they are excluded from the program entirely. Instruments where I(10³) exceeds 0.5%, or where a $1k order cannot fill at all, are the eligible set — markets where a four-figure order visibly moves price, which is precisely where five-figure dislocations are born.",
      "Tokenized ETFs are excluded categorically, as are operator-blocked symbols; the operator may pin instruments into the set on discretionary information. Classification is re-estimated every 24 hours, because thinness is a state, not a property.",
    ],
    formula: {
      expr: "Ii(Q)  =  P_eff(Q) / P̂i  −  1 ,    Q ∈ { 10², 10³, 10⁴ } USD",
      caption:
        "Impact function, evaluated through each instrument's best venue",
    },
  },
  {
    n: "05",
    id: "inventory",
    title: "Inventory construction",
    body: [
      "Capital enters as protocol fee flow. $RES launches on Pons v2 quoted in USDG; the vault is the launch's creator-fee recipient, so the creator share of every trade on the bonding curve — and, after graduation, on the locked Uniswap v4 pool — accrues in USDG to the Pons fee escrow. The keeper sweeps and claims it into the vault every five minutes.",
      "Deployment is a capacity-weighted round robin. Given deployable budget C (cash less profit already owed to holders) and a minimum viable clip c_min, a pass rotates through the eligible set with a persistent cursor, so every instrument receives inventory before any receives twice.",
      "Each purchase routes through the best of all venues for that instrument and executes only at P_eff ≤ P̂ · (1 + α). The desk never pays a premium to acquire what it intends to sell at one. Entries run on a fixed cadence — T+5m, T+15m, then every 30 minutes — so fee flow converts to standing inventory within the hour it arrives.",
    ],
    formula: {
      expr: "n = ⌊ C / c_min ⌋  purchases of  C / n  each,  capped at κ per instrument",
      caption: "One deployment pass",
    },
  },
  {
    n: "06",
    id: "execution",
    title: "Execution against a dislocation",
    body: [
      "When a held instrument prints a real dislocation, the desk sizes the maximum liquidation whose effective price — after pool fee and self-impact, as quoted by the venue itself — clears the floor. B̄ is the position's average cost basis: the desk sells strength, it does not realize losses into noise.",
      "Each order additionally requires an absolute profit increment π ≥ π_min over max(reference value, basis), carries a slippage-bounded minimum output of 1% so a moved market reverts rather than fills badly, and settles against the vault's wallet delta. The quote predicts; the balance decides.",
    ],
    formula: {
      expr: "S*  =  max { S ≤ inventory :  P_eff(S)  ≥  max( P̂ · (1+ε),  B̄ ) }",
      caption: "Maximum liquidation size clearing the profit floor",
    },
    sub: {
      title: "Tranche schedule",
      body: "Exits are distributed, not slammed: at most a fraction τ of S* per order, one order per instrument per cooldown window Δt. A persistent dislocation is harvested across hours, each tranche re-sized against the pool's remaining depth, so extraction decelerates as the pool drains and the market is left visibly bid. A fading dislocation simply stops qualifying, and the remaining inventory is kept for the next event.",
    },
  },
] as const;

export const LP_BANDS = [
  {
    mode: "below",
    label: "USDG-only",
    summary:
      "Placed entirely below the pool price, so it fills only as the premium unwinds and never buys above spot. Earns the pool fee on every fill in either direction.",
    range: "[ P̂ · (1 + δ_ref) ,  P_pool · (1 − δ_spot) ]",
    lifecycle: [
      "Pool falls through the band → position is all stock; closed, and the shares join inventory at cost for the exit desk to sell into the next spike.",
      "Pool runs 10% above the band → position is idle USDG; closed and re-placed under the new spot.",
    ],
  },
  {
    mode: "two-sided",
    label: "Centred ±5%",
    summary:
      "Centred on the pool price, funded half in USDG and half in stock drawn from the desk's own inventory, so it earns the pool fee on flow in both directions.",
    range: "[ P_pool · 0.95 ,  P_pool · 1.05 ]",
    lifecycle: [
      "Closed and re-centred once the pool has sat outside it for 5 minutes.",
      "On close the stock rejoins inventory at the cost basis it left with; what the band net-sold is realized against that basis, what it net-bought joins inventory at what the band paid.",
    ],
  },
  {
    mode: "above",
    label: "Ask ladder",
    summary:
      "Stock the desk already holds, placed alone from a little over the pool price up to a ceiling. Every tick up sells a slice higher and earns the pool fee on the fill; a falling price fills nothing and buys nothing.",
    range: "[ P_pool · (1 + margin) ,  ceiling ]",
    lifecycle: [
      "No max-loss guard — the desk owned the stock already — and it does not chase the price down unless told to.",
      "Once the pool has sold through the top the USDG returns as cash, the stock's result against its cost is booked on the fund's own line, and a new ladder is placed from the new price.",
    ],
  },
] as const;

export const LP_EXPOSURE =
  "Exposure is capped per pool, not per position. Stock from earlier bands still in inventory plus a new band's deposit never exceeds $750 for AMC, so the desk can never buy the premium down a band at a time. Fees are collected every 15 minutes into the vault as realized profit, entering the same payout pot as sales.";

export const SIGNALS = [
  {
    title: "Smart LPs",
    body: "Every liquidity add and remove on the hot pools is attributed to the wallet behind it and valued at the pool price of that moment; every swap credits in-range positions with their share of the fee. A wallet's seven-day score is what it withdrew minus what it deposited, plus open positions at current price, plus fees credited. Only positions opened and closed inside the window count as wins or losses, so a wallet that merely sits in a pool is followed but not judged.",
    detail:
      "A wallet is marked smart when it is a consistent winner over the window, not a lucky one. Contracts are tagged as bots and the desk's own wallet as desk, so the tracker never scores itself.",
    read: "A pool the smart money is sitting in is worth a look; a pool it just left is a warning.",
  },
  {
    title: "Opportunity alerts",
    body: "Pools where a $6k band looks like the most profitable place to be right now. A pool qualifies when it is hook-free with a real LP fee, has traded at least the configured hour of volume, holds liquidity within ±5% of the price under the cap, still trades above 60% of its 24h peak, is at least 20 minutes old, and the smart-LP tracker shows liquidity providers winning in it.",
    detail:
      "A pool that stops qualifying fades on the board rather than vanishing, and stays for 24 hours, so a spike that has passed is still readable.",
    read: "The desk never opens a band from an alert on its own. Every one is a decision for the operator.",
  },
  {
    title: "Brew",
    body: "The creator-token launchpad on BNB Smart Chain, where every launch is a PancakeSwap v3 pool at a 1% fee with its launch liquidity locked in a single position from the opening price upward. For every pool the scanner takes the liquidity within ±5% of the price from on-chain active liquidity and works out the share a $6k band would take, then what it would have earned over 5 minutes, an hour, 6 hours and 24 hours.",
    detail:
      "The desk holds nothing on BSC and places no band there; the Brew board is read-only. The share and fee estimates are what a band would have faced, not what the desk earned.",
    read: "A launch whose fee estimate holds up across windows, on liquidity that is not about to unlock, is a candidate for the first band placed there.",
    formula: "share  =  6,000 / ( 6,000 + L₅% )",
  },
] as const;

export const PAYOUT_STEPS = [
  {
    label: "Realized",
    body: "Every liquidation realizes proceeds minus the average cost basis of the size sold. Lifetime realized profit Π(t) accumulates monotonically.",
  },
  {
    label: "Retained",
    body: "85% of each increase in realized profit is retained as working capital. It funds new positions, absorbs losses on the pools, and is never paid out — holders have no claim on it.",
  },
  {
    label: "Owed",
    body: "The balance owed to holders is 15% of lifetime realized profit less what has already been paid. It carries forward and never resets.",
  },
  {
    label: "Paid",
    body: "Every 15 minutes the desk pays min(O, cash) in USDG, pro-rata over an eligibility-filtered holder snapshot, once at least $300 is owed.",
  },
] as const;

export const SNAPSHOT_NOTE =
  "The snapshot is reconstructed from the token's complete Transfer history maintained locally, never an indexer, and spot-verified against chain state before any value moves. AMM reserves, protocol machinery and desk addresses are excluded from the eligible supply; sub-dust allocations remain in the pot.";

export const INVARIANTS = [
  {
    invariant: "All balances live at one address",
    mechanism:
      "Inventory, cash and fee inflow settle at the fund; the agent's wallet carries only gas",
  },
  {
    invariant: "The agent trades only sanctioned venues",
    mechanism: "exec() reverts on any target outside the allowlist",
  },
  {
    invariant: "Approvals cannot leak",
    mechanism: "Token approvals are spender-gated to the same allowlist",
  },
  {
    invariant: "Distribution is rate-limited",
    mechanism: "Per-asset rolling 24h cap, contract-enforced",
  },
  {
    invariant: "The agent is replaceable in one transaction",
    mechanism: "Rotation is a single transaction; custody is unaffected",
  },
  {
    invariant: "The owner can withdraw",
    mechanism:
      "The vault owner (the deployer wallet) may withdraw any asset at any time with no timelock; the keeper cannot",
    flagged: true,
  },
] as const;

export const PARAMETERS = [
  {
    sym: "δ*",
    meaning: "Minimum actionable deviation",
    value: "+25%, unbounded above",
  },
  { sym: "θ", meaning: "Closed-session threshold widening", value: "+10%" },
  {
    sym: "δ_h",
    meaning: "Exit threshold for instruments the desk holds",
    value: "+8%, if depth clears the floor",
  },
  {
    sym: "d_min",
    meaning: "Sellable depth for a dislocation to count as real",
    value: "$100 above the floor",
  },
  {
    sym: "q₀ , φ_min",
    meaning: "Fillability probe notional / minimum yield",
    value: "$50 / $25",
  },
  { sym: "ε", meaning: "Execution edge over reference", value: "5%" },
  { sym: "π_min", meaning: "Minimum profit per order", value: "$2" },
  {
    sym: "τ , Δt",
    meaning: "Tranche fraction / cooldown",
    value: "20% / 2 min",
  },
  {
    sym: "c_min , κ",
    meaning: "Minimum clip / per-instrument cap",
    value: "$100 / $250",
  },
  { sym: "α", meaning: "Maximum acquisition premium", value: "2%" },
  {
    sym: "δ_ref , δ_spot",
    meaning: "LP band margins over reference / under spot",
    value: "1% / 1%",
  },
] as const;

export const CADENCES = [
  { label: "Venue sweep", value: "every 15 seconds, full set ≈ 5 min" },
  { label: "Distribution cycle", value: "every 15 minutes" },
  { label: "Liquidity survey", value: "every 24 hours" },
  { label: "Venue rediscovery", value: "every 6 hours" },
] as const;

export const PARAMETERS_NOTE =
  "Parameters are operating policy, not physical constants. The desk publishes them so its behaviour is predictable to the market it serves.";

export const FAQS = [
  {
    question: "What counts as a dislocation?",
    answer:
      "A pool whose marginal price sits at least 25% above the reference price of the underlying share, and which passes the fillability probe — a quoted $50 liquidation through the venue's own engine returning at least $25. Both conditions, every time. Displayed price alone is never sufficient.",
  },
  {
    question: "Why exclude the deepest instruments?",
    answer:
      "Because someone else gets there first. Where a $10,000 aggression moves price by 0.25% or less, dislocations are arbitraged away before standing inventory can monetize them. The desk is only paid for being resident in markets thin enough that a four-figure order visibly moves price.",
  },
  {
    question: "What stops the desk selling into a mirage?",
    answer:
      "The fillability probe, and settlement against the vault's wallet delta rather than the quote. A genuine pump deposits the aggressor's own quote asset into the pool, so it is always fillable; a mirage quotes nothing and never qualifies. Orders also carry a 1% slippage-bounded minimum output, so a market that moved under the order reverts rather than fills badly.",
  },
  {
    question: "When do holders get paid?",
    answer:
      "Every 15 minutes, in USDG, once at least $300 is owed. The amount owed is 15% of lifetime realized profit less everything already distributed — a ledger identity that carries forward and never resets. Payment is pro-rata across an eligibility-filtered holder snapshot.",
  },
  {
    question: "What happens when a position loses money?",
    answer:
      "It is not sold. Every exit must clear both the reference floor and the position's own average cost basis, so losses are not realized into noise; inventory is simply held for the next event. Where the LP desk does take a loss on a pool, the retained 85% absorbs it rather than the holder pot: past accrual to holders is never clawed back, but further accrual stops until the desk has earned the loss back.",
  },
  {
    question: "Can the operator withdraw the fund?",
    answer:
      "Yes. The vault owner — the deployer wallet — may withdraw any asset at any time, with no timelock. The keeper cannot. This is the one custody property that is not constrained by the contract, and it is stated here rather than left to be discovered on the explorer.",
  },
] as const;

export const DOCS_BLURB =
  "The full method, the contract addresses, and the live configuration the running desk reads its parameters from.";

export const TAGLINE = "The resident market maker for tokenized equities";
