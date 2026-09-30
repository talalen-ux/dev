/**
 * The whitepaper, as the site's own page.
 *
 * /docs explains the mechanism in ordinary words and /holders explains the
 * consequence. This is the formal statement: the algebra the desk decides on,
 * every operating constant, and an unsoftened account of what has been proven
 * against what merely exists. It is the document to hand someone who wants to
 * check the reasoning rather than be told the conclusion.
 *
 * Three rules held throughout.
 *
 * No performance figure appears anywhere on this page. The first live boards
 * printed rates that are not credible, that is stated in RISK_MODEL rather
 * than omitted, and quoting a return before the measurement is trusted would
 * be the one claim this document cannot make.
 *
 * Every number is bound to the constant that enforces it by
 * test/whitepaper.test.mjs, including the constants inside the formula
 * strings. A row here that stops matching is not a test to update.
 *
 * The status section distinguishes proven from built from absent, and never
 * lets the second pass as the first.
 */

/** A prose block. Formulas sit inline, in the order the argument needs them. */
export type Block =
  | { readonly kind: "p"; readonly text: string }
  | { readonly kind: "h"; readonly text: string }
  | { readonly kind: "formula"; readonly expr: string; readonly caption?: string };

export const HERO_HEADLINE =
  "Trading fees, priced as capital rather than paid out.";

export const HERO_STANDFIRST =
  "Resident deploys the trading fees its own token generates as concentrated liquidity in other pools on Robinhood Chain. A position opens only when the fees it is expected to earn exceed the expected cost of the price moving. This page states the model, the parameters and the status.";

export const HERO_NOTE =
  "No performance figures appear here. Nothing has been deployed and no transaction has been sent.";

export const NAV_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Cycle", href: "#cycle" },
  { label: "Pricing", href: "#pricing" },
  { label: "Construction", href: "#construction" },
  { label: "Procedure", href: "#procedure" },
  { label: "Custody", href: "#custody" },
  { label: "Distributions", href: "#distributions" },
  { label: "Parameters", href: "#parameters" },
  { label: "Risk", href: "#risk" },
  { label: "Status", href: "#status" },
] as const;

// --- 1. the problem --------------------------------------------------------

export const PROBLEM_TITLE = "Three standard uses, all of which spend it";

export const PROBLEM: readonly Block[] = [
  {
    kind: "p",
    text: "Trading fees are the one reliable revenue a token has, and the three standard uses all spend it.",
  },
  {
    kind: "p",
    text: "Paying fees to a treasury wallet turns revenue into a balance that does nothing. Distributing them converts revenue into a payout that leaves nothing behind. Buying back and burning converts it into a price effect that lasts only while the buying continues. All three treat the fee stream as an output.",
  },
  {
    kind: "p",
    text: "Treating it as an input asks a different question: what is the best use of a dollar of fee revenue, measured against what that dollar would earn elsewhere? On a chain with liquid pools, one answer is to provide liquidity in them — to hold an inventory position that earns a share of every trade in somebody else's market.",
  },
  {
    kind: "p",
    text: "That is not free money, and the reason is specific. A concentrated liquidity position loses against simply holding its two assets whenever the price moves, because the pool sells the asset that is rising and buys the one that is falling. The loss grows with volatility and with how tightly the range is drawn. Fee income has to exceed it.",
  },
  {
    kind: "p",
    text: "Whether it does has an answer per pool, per interval, and the answer can be computed rather than assumed. Resident computes it and acts on it.",
  },
];

// --- 2. the cycle ----------------------------------------------------------

export const CYCLE_TITLE = "From a trade to a payout";

export const CYCLE_CAPTION =
  "The cycle · seven steps, one loop back";

export const CYCLE_CLOSING =
  "The loop is the design. A trade on the token pays a fee; the fee reaches the vault rather than a wallet; the desk prices every pool it can see and deploys into the best one it can justify; that position earns from other people's trades; what it earns is booked, split, and the retained share funds the next position. Only the holders' share leaves.";

/** The diagram's boxes, in flow order. Rendered by CycleDiagram. */
export const CYCLE_STEPS = [
  {
    id: "trade",
    name: "A trade on $RES",
    lines: ["Every buy or sell pays a", "trading fee. That fee is", "the only inflow."],
  },
  {
    id: "route",
    name: "Fees route to the vault",
    lines: ["Set once, at the launch", "venue. Not a treasury", "wallet, not a burn."],
  },
  {
    id: "price",
    name: "The desk prices pools",
    lines: ["Fee income against the", "cost of the price moving,", "per pool, every minute."],
  },
  {
    id: "open",
    name: "A position opens",
    lines: ["Buy the stock side, then", "mint a range around spot,", "sized to the pool depth."],
  },
  {
    id: "earn",
    name: "It earns, then is swept",
    lines: ["Other traders pay into it.", "Fees are collected when", "they beat the gas."],
  },
  {
    id: "book",
    name: "Profit is booked",
    lines: ["Realized on chain as a", "monotonic total. The split", "happens here."],
  },
  {
    id: "pay",
    name: "Holders are paid",
    lines: ["When every holder clears", "the five-dollar floor, not", "on a clock."],
  },
] as const;

// --- 3. pricing a position -------------------------------------------------

export const PRICING_TITLE = "Fee income against the cost of the price moving";

export const NET_RATE_FORMULA = "net rate = fee rate − bleed rate";

export const FEE_RATE_FORMULA =
  "fee income = volume × (feePips / 1,000,000) × share × captureEfficiency\nfee rate   = fee income / deployed";

export const SHARE_FORMULA = "share = L_band / (L_band + L_pool)";

export const DIVERGENCE_FORMULA =
  "d(p') = ( position value at p' − hold value at p' ) / capital";

export const BLEED_FORMULA = "bleed rate = −½ · [ d(p · e^σ) + d(p · e^−σ) ]";

export const PRICING: readonly Block[] = [
  {
    kind: "p",
    text: "Every decision reduces to one number: the rate a position nets per interval, as a fraction of the capital in it.",
  },
  { kind: "formula", expr: NET_RATE_FORMULA },
  { kind: "h", text: "Fee income" },
  {
    kind: "p",
    text: "Fee income is the pool's fee applied to the flow the position actually captures.",
  },
  { kind: "formula", expr: FEE_RATE_FORMULA },
  {
    kind: "p",
    text: "Share is where fee-ranked dashboards go wrong. Taken naively it is capital divided by capital plus pool liquidity, which makes range width free — and it is not. The same capital spread over ±20% has a quarter the liquidity density of ±5%, so it earns proportionally less of the flow crossing any given price. Resident compares Uniswap L values rather than dollar amounts.",
  },
  {
    kind: "formula",
    expr: SHARE_FORMULA,
    caption: "competing liquidity is measured inside the reference window of spot",
  },
  {
    kind: "p",
    text: "Widening a range for safety therefore costs income. That is the real trade, and the naive formula hides it. Capture efficiency is a further haircut, because even the L-based figure is an upper bound: it credits the position with every trade in its range, including ones that cross only part of it.",
  },
  { kind: "h", text: "The cost of the price moving" },
  {
    kind: "p",
    text: "Bleed is divergence loss — what a position gives up against simply holding the two assets it was opened with. The pool sells whichever asset is rising and buys whichever is falling, so any move leaves the position behind the hold. For a position over a range, at some later price p':",
  },
  { kind: "formula", expr: DIVERGENCE_FORMULA },
  {
    kind: "p",
    text: "Hold value is what the two tokens the position was opened with would be worth if they had simply been held. Resident evaluates the difference with the exact position algebra at a one-sigma move in each direction and averages the two.",
  },
  {
    kind: "formula",
    expr: BLEED_FORMULA,
    caption: "evaluated one standard deviation of price movement in each direction",
  },
  {
    kind: "p",
    text: "Both directions are needed because divergence loss is symmetric in log price, not in price. Using the exact algebra rather than the usual quadratic approximation matters at the widths and volatilities this runs at, where the approximation drifts.",
  },
  { kind: "h", text: "The floor" },
  {
    kind: "p",
    text: "A position opens only when its net rate clears a floor, and that floor is the opportunity cost of the capital — what the same money would earn lent somewhere the vault can actually reach. It is currently zero, because no lending venue is configured. A hurdle taken from a yield the desk has no path to is not an opportunity cost; it is a number.",
  },
  {
    kind: "p",
    text: "It is worth being unromantic about how little this term does. At a 7% annual yield the hurdle is 0.00133 bps per interval, while the bleed term on a live board runs past 0.07 bps. The hurdle is a correction at the margin. Bleed is what rejects pools.",
  },
];

// --- 4. building a position ------------------------------------------------

export const CONSTRUCTION_TITLE = "Width from volatility, size from depth";

export const WIDTH_FORMULA = "halfWidth = clamp( 1.25 · σ · √240 , 0.01 , 0.60 )";

export const AMOUNTS_FORMULA =
  "at liquidity L, in range:   amount0 = L · (1/√P − 1/√b)\n                            amount1 = L · (√P − √a)";

export const CONSTRUCTION: readonly Block[] = [
  { kind: "h", text: "Width comes from volatility" },
  {
    kind: "p",
    text: "A range's half-width is set so the price is expected to stay inside it for a working horizon, not chosen by taste.",
  },
  {
    kind: "formula",
    expr: WIDTH_FORMULA,
    caption: "240 intervals is four hours; the result is then snapped to the pool's tick spacing",
  },
  {
    kind: "p",
    text: "A quiet pool gets a tight range and a high share of its flow; a violent one gets a wide range and a small share of it. The snapping matters: a range is stored in ticks, and an unsnapped one is not a range the pool will accept.",
  },
  {
    kind: "p",
    text: "Two gates sit in front of this. Volatility of zero is rejected, not accepted — a pool with no measured volatility has no measured bleed, so it would price as pure fee income and top the board. That is the most dangerous possible failure mode, because it makes the least-known pools look like the best ones. And a pool must have been shown to range: the price has to keep returning inside the ranging band over its recent history. Fee rate alone ranks a token mid-collapse at the top of the board, since volume is enormous on the way down, and liquidity is only worth providing where the price comes back.",
  },
  { kind: "h", text: "Size comes from the pool, then from the vault" },
  {
    kind: "p",
    text: "A target size is derived from the pool's own scale — market capitalization where it is known, a base figure where it is not. What actually gets deployed is the smaller of that target and what the vault can spare: idle capital less a standing reserve, and never less than the opening floor.",
  },
  {
    kind: "p",
    text: "The trade that funds the entry is bounded separately, against depth rather than against the vault: at most a fixed share of the liquidity on the side the trade pushes into. Size derived from the vault says what the desk can afford; size derived from depth says what the pool can absorb. The trade takes the lesser.",
  },
  { kind: "h", text: "An entry is two moves" },
  {
    kind: "p",
    text: "This is the part that is easy to get wrong, and this codebase got it wrong first. A concentrated range straddling the current price is funded with both tokens. A fresh treasury holds only the quote asset. Uniswap's sizing takes the smaller of the two sides, so the liquidity such a treasury can mint into any range centred on spot is exactly zero. Nothing reverts on chain, because nothing is ever sent — the executor declines the mint, and every open the desk decides on fails the same silent way.",
  },
  {
    kind: "p",
    text: "So an entry is: buy the stock side, then mint. The split is computed in the pool's own raw units, from the identity that both amounts are linear in liquidity.",
  },
  {
    kind: "formula",
    expr: AMOUNTS_FORMULA,
    caption: "the range bounds and the current price, in the pool's own units",
  },
  {
    kind: "p",
    text: "The ratio between them is therefore fixed by the range and the price alone. Price one reference unit of liquidity entirely in quote, divide the capital by that unit cost, and both amounts follow — no search, no iteration, and the same primitives the mint itself is sized with. A split derived from different arithmetic than the mint is a split that leaves a remainder nobody can account for.",
  },
  {
    kind: "p",
    text: "Two things the split deliberately does not do. It does not assume half: swapping 50% and providing the rest is correct only for a range symmetric in √P around spot, which a range in tick space is not, and on the wide ranges high volatility calls for the leftover is material. And it does not model the swap's own price impact — buying the stock moves the price it is bought at, which changes the split that was just computed. Instead the executor re-reads the pool after the swap and re-sizes against what it finds. A measurement after the fact beats an estimate before it, and the swap's own slippage bound is what protects the trade meanwhile.",
  },
];

// --- 5. the decision procedure ---------------------------------------------

export const PROCEDURE_TITLE = "One ordered list, applied every interval";

export const PROCEDURE_INTRO =
  "Every interval the keeper reads the chain, prices every pool on the board, and applies one ordered list of rules. The output is a list of intents — things to do — plus, for everything it chose not to do, the reason. The order is not cosmetic: each rule can claim a position so that nothing below it revisits the same one in the same tick.";

export const PROCEDURE_GUARD =
  "The tick refuses to begin at all if a previous intent is still unreconciled. An in-flight call whose outcome is unknown means deciding anything on top of it risks doing it twice, so the tick stops and says so.";

export const PROCEDURE_RULES = [
  {
    n: "0",
    name: "Manual orders",
    body: "First, and they claim their position so nothing below reconsiders it. An operator closing a position has a reason the rules cannot see; the rules getting a second opinion in the same tick is how a manual close becomes a manual close followed by an automatic re-open.",
  },
  {
    n: "1",
    name: "Retire",
    body: "Close positions whose net rate has gone negative and stayed there. A position not observed this tick is skipped rather than judged on stale data.",
  },
  {
    n: "2",
    name: "Sweep",
    body: "Collect accrued fees where the amount clears the gas cost of collecting it, by a margin. A sweep worth less than its own gas is a loss.",
  },
  {
    n: "3",
    name: "Re-centre",
    body: "Move the range of a position the price has drifted out of. One atomic call, on a pool the desk has already priced.",
  },
  {
    n: "4",
    name: "Rotate",
    body: "Move capital out of a pool that has stopped working and into a better one on the board. Deliberately after re-centring: a drifted position on a good pool is fixed by moving its range, and rotating it would pay a full round trip to solve a problem the cheaper rule already solves. What rotation catches is the position that is not drifted and is simply in the wrong pool — and nothing else catches it. Every position can be above its floor, no retire rule trips, and the money is still in the pool that was best when it was deployed rather than the one that is best now. That is a leak that never shows up as a loss.",
  },
  {
    n: "5",
    name: "Ladder loose inventory",
    body: "Fees arrive in whatever token the pool charges them in, so the vault accumulates stock. Resting it above the price is judged against holding it, not against cash — the tokens are in the vault either way. The question is never whether this is a good pool to buy into but whether resting these above the price beats leaving them alone, which is a different test and gives a different answer. Most visibly on a runner, where a ladder sells the whole position into the first leg, and the model says so rather than reporting a large fee number.",
  },
  {
    n: "5b",
    name: "Convert what the ladder never cleared",
    body: "Sell aged inventory back to quote. Without this the treasury quietly becomes a portfolio of the tokens it has been making markets in: carrying full price risk, earning nothing, unavailable for the next position. It is aged rather than immediate because the ladder gets first refusal — fees arrive in a token exactly when that token is trading, and selling into the flow you just earned from pays the spread twice. Inventory that cannot be dated is not sold, because selling on an unknown age is selling on no reason.",
  },
  {
    n: "6",
    name: "Deploy idle capital",
    body: "Open into the best-ranked pool, sized as described above.",
  },
  {
    n: "6a",
    name: "Probe",
    body: "Only when the deploy rule deployed nothing, and only into a pool that clears every other gate: open one minimum position into a pool whose capture has been assumed rather than measured. Bounded on purpose — a fixed number of probes, each at the opening floor, so the most the desk can lose finding out is knowable in advance.",
  },
  {
    n: "6b",
    name: "Claim the launch's own fees",
    body: "After deploying and before bridging, because a claim is an inflow rather than an allocation: what it produces is capital the next tick deploys. Held to the same gas floor a sweep is.",
  },
  {
    n: "7",
    name: "Cross chains",
    body: "Move quote capital to another venue when the board says the opportunity is there. Built, never exercised.",
  },
] as const;

export const PROCEDURE_CLOSING =
  "Finally, and unconditionally: book realized profit and absorbed loss into the vault's accounting. That is what makes the holders' share real, so it is never contingent on anything the desk would rather do with the money.";

// --- 6. custody ------------------------------------------------------------

export const CUSTODY_TITLE = "Two keys, and what the contract refuses";

export const CUSTODY_INTRO: readonly Block[] = [
  {
    kind: "p",
    text: "The capital sits in one contract, ResidentVault, and two keys can touch it.",
  },
  {
    kind: "p",
    text: "The owner is a cold key. It rotates the keeper, sets the venue allowlist, sets the per-asset rolling caps, sets the bridge allowlist and bridge caps, and is the only key that can withdraw.",
  },
  {
    kind: "p",
    text: "The keeper is a hot key that runs on a server. It can do exactly four kinds of thing: call a sanctioned venue, approve a sanctioned venue to pull a token, update the profit ledger, and pay a distribution. It cannot withdraw. It cannot add a venue. It cannot change a cap. Compromising it is bad; it is not a drain.",
  },
];

export const CUSTODY_GUARANTEES = [
  {
    what: "Two overlapping guards on every trade",
    body: "The keeper's only route to moving value is a call to a venue on the owner's allowlist. On top of that, the ERC-20 transfer, approve and transferFrom selectors are banned through that route outright. The allowlist is the primary guard; the selector ban is the backstop, so that even if a token's own address were mistakenly allowlisted as a venue, a misconfiguration still cannot become a drain. Approvals go through a separate function that is spender-gated to the same allowlist.",
  },
  {
    what: "The profit ledger is replay-safe",
    body: "Realized profit is reported as a cumulative lifetime total, not a delta, and the contract refuses any total below the one it holds. A keeper call that gets replayed, reordered or resent is therefore idempotent rather than double-counted.",
  },
  {
    what: "Losses fall on working capital, not on holders",
    body: "Absorbing a loss touches neither the realized total nor the holder accrual, both of which stay monotonic. A loss lands entirely on the deployed share and is invisible to the holder ledger. Be precise about what that does and does not protect: holders cannot lose what has already accrued to them, but they can certainly see future accrual stop, because a desk that is losing money records no new profit to take a share of. A loss larger than the working capital is refused rather than silently clamped.",
  },
  {
    what: "Distributions are bounded twice",
    body: "The recipient split is computed off chain from the token's full transfer history; what the contract enforces is the envelope around it. A payout can never exceed what is owed, nor the rolling cap for that asset, and every paid unit is booked against the distributed total before any value moves. The cap refills continuously rather than resetting on a boundary, so a full cap spent now leaves the vault unable to pay again until time has genuinely passed.",
  },
  {
    what: "Bridging is separate from trading",
    body: "Cross-chain moves have their own allowlist and their own caps, so a crossing is a distinct event in the log rather than one more venue call.",
  },
  {
    what: "Position NFTs are accepted only from the expected collection",
    body: "Anything else sent to the vault is rejected on receipt.",
  },
] as const;

export const CUSTODY_KEY_NOTE =
  "The keeper key is generated and placed by the operator. It has never been written into the repository, and nothing in the build produces one.";

// --- 7. distributions ------------------------------------------------------

export const DISTRIBUTION_TITLE = "A share of realized profit, on a cadence the payout sets";

export const DISTRIBUTION_WHAT: readonly Block[] = [
  {
    kind: "p",
    text: "Holders receive a fixed share of realized profit. Not of volume, not of fees charged, not of assets under management, and not of unrealized position value. A position only contributes when it has been closed or its fees swept and the result booked to the vault's ledger; at that moment the holders' share of the increase accrues to them and the rest stays as working capital that funds the next position.",
  },
  {
    kind: "p",
    text: "The accrual is a ledger entry, not a transfer. Once it has accrued it cannot be spent on anything else, and nothing the desk does later can take it back.",
  },
];

export const DISTRIBUTION_CADENCE: readonly Block[] = [
  {
    kind: "p",
    text: "The honest answer to when is: the payout size, not a clock. That is a deliberate choice, and the reasons are worth stating because a fixed schedule is the obvious design and it does not work.",
  },
  {
    kind: "p",
    text: "Gas. The vault pays holders in a loop, so cost scales with the number of recipients rather than with the amount. At the measured cost of a transfer, paying five thousand holders every fifteen minutes is over a block limit, and on the order of tens of thousands of dollars a day. A fifteen-minute cadence is a promise about frequency that only a gas subsidy can keep, and a subsidy is somebody else's decision to withdraw.",
  },
  {
    kind: "p",
    text: "Fairness. Capping the recipient list and sorting by balance sounds prudent and is the worse failure. Balances barely move between cycles, so the same names clear the cap every time and everyone below it is never paid. Not paid later — never.",
  },
  {
    kind: "p",
    text: "Both problems have the same root: pro-rata of a small amount across many holders produces per-holder amounts smaller than the cost of sending them. Three hundred dollars across five thousand holders is six cents each, and six cents costs more than six cents to move.",
  },
  {
    kind: "p",
    text: "So a distribution runs when two conditions hold: there is enough owed for every eligible holder to clear a floor worth paying, and gas is a small enough share of what is being paid. Fewer, larger, complete distributions instead of frequent partial ones that quietly pay the same few people. The interval widens with the holder count rather than the gas bill doing so, and nothing is forfeited by waiting: an entitlement below the floor stays in the ledger and makes the next distribution larger.",
  },
];

export const DISTRIBUTION_HOLDERS: readonly Block[] = [
  {
    kind: "p",
    text: "The recipient list is rebuilt by replaying the token's own Transfer logs into balances, rather than trusting an indexer. Mints and burns are movements to and from the zero address and are applied like any other movement — a token's whole supply arrives as a mint, so skipping them would leave every balance short by exactly what was minted.",
  },
  {
    kind: "p",
    text: "This is slower than an indexer and it is the only version that cannot be stale or wrong in a way nobody notices. The vault enforces the envelope, but it cannot know who the holders are. Every mistake in building that list is a payment to the wrong address or a holder silently missed, which is why it is derived from the chain's own record, replayed.",
  },
];

// --- 8. parameters ---------------------------------------------------------

export const PARAMETERS_TITLE = "Every operating constant";

export const PARAMETERS_INTRO =
  "One interval is one minute throughout — the whole desk uses a single unit so that no rule reads in minutes while another reads in hours. Dollar figures are units of the pool's quote asset. A build check fails if any figure below drifts from the value in code.";

export const PARAMETER_GROUPS = [
  {
    group: "Range and pricing",
    rows: [
      { meaning: "Sigma multiple a range is built to contain", value: "1.25" },
      { meaning: "Horizon a range's width is sized for", value: "240 intervals" },
      { meaning: "Narrowest half-width", value: "1%" },
      { meaning: "Widest half-width", value: "60%" },
      { meaning: "Window competing liquidity is measured in", value: "±5%" },
      { meaning: "Intervals per year, for annualizing", value: "525,600" },
      { meaning: "Net rate an entry must beat", value: "0" },
    ],
  },
  {
    group: "Gates before a pool is eligible",
    rows: [
      { meaning: "Refuse a pool not shown to range", value: "on" },
      { meaning: "Band containment is measured against", value: "±35%" },
      { meaning: "Samples before capture counts as measured", value: "12" },
      { meaning: "Capture assumed for a pool with no history", value: "50%" },
      { meaning: "Ceiling on a measured capture estimate", value: "1.25" },
      { meaning: "A sample counts half as much after", value: "24 hours" },
    ],
  },
  {
    group: "Sizing",
    rows: [
      { meaning: "Target position size at the reference cap", value: "$10,000" },
      { meaning: "Market cap that base capital is quoted at", value: "$10,000,000" },
      { meaning: "Floor on a sized position", value: "$250" },
      { meaning: "Held back from deployment at all times", value: "$250" },
      { meaning: "Below this, do not open at all", value: "$250" },
      { meaning: "Probes into unmeasured pools", value: "3" },
      { meaning: "Before a probe's capture reading is used", value: "120 intervals" },
    ],
  },
  {
    group: "Maintaining an open position",
    rows: [
      { meaning: "Fees below this are not worth collecting", value: "$100" },
      { meaning: "Collect at least this often regardless", value: "15 intervals" },
      { meaning: "A sweep must be worth this much gas", value: "3x" },
      { meaning: "Net rate below which a position is failing", value: "0" },
      { meaning: "Failing readings before closing", value: "10" },
      { meaning: "Earnings horizon a re-centre is judged over", value: "720 intervals" },
      { meaning: "Re-centring must be worth", value: "2x its cost" },
      { meaning: "Youngest position that may be re-centred", value: "30 intervals" },
      { meaning: "Earnings horizon a rotation is judged over", value: "720 intervals" },
      { meaning: "Rotating must be worth", value: "3x its cost" },
      { meaning: "Youngest position that may be rotated", value: "60 intervals" },
      { meaning: "Below this, a round trip is not worth paying", value: "$1,000" },
    ],
  },
  {
    group: "Inventory",
    rows: [
      { meaning: "Resting on a ladder before inventory is sold", value: "120 intervals" },
      { meaning: "Most of the depth a sale may take", value: "20%" },
      { meaning: "Bound on the executed price", value: "1%" },
      { meaning: "Below this, leave the inventory alone", value: "$25" },
    ],
  },
  {
    group: "Crossing chains",
    rows: [
      { meaning: "A cross-chain edge is assumed to last", value: "720 intervals" },
      { meaning: "A cross-chain move must be worth", value: "1.5x its cost" },
      { meaning: "Smallest amount worth moving between chains", value: "$2,500" },
    ],
  },
  {
    group: "Assumed costs",
    rows: [
      { meaning: "Gas assumed per collection", value: "$2" },
      { meaning: "Gas assumed per range move", value: "$6" },
      { meaning: "Price cost of a range move", value: "0.1%" },
    ],
  },
  {
    group: "The vault and distributions",
    rows: [
      { meaning: "Holders' share of realized profit", value: "15%" },
      { meaning: "Rolling window the payout cap refills over", value: "24 hours" },
      { meaning: "Smallest payment worth making, per holder", value: "$5" },
      { meaning: "Most of a payout that may go to gas", value: "2%" },
      { meaning: "Gas assumed per recipient", value: "35,000" },
      { meaning: "Gas assumed before any transfer", value: "50,000" },
      { meaning: "Recipients in one call", value: "500" },
    ],
  },
] as const;

export const PARAMETERS_NOTE =
  "These are operating settings, not constants of nature. They are published so that behaviour is predictable, and so that changing one is visible as a change.";

// --- 9. risk ---------------------------------------------------------------

export const RISK_TITLE = "What can go wrong, including what is not mitigated";

export const RISK_MODEL: readonly Block[] = [
  { kind: "h", text: "The model can be wrong" },
  {
    kind: "p",
    text: "The whole system rests on one comparison, and every input to it is an estimate.",
  },
  {
    kind: "p",
    text: "Volatility is measured from recent price history, so it is backward-looking by construction. A pool that has been quiet and is about to stop being quiet prices as cheap. Capture efficiency is the haircut on the naive fee formula, and for a pool with no history it defaults to an assumption rather than a measurement — which is exactly why probes exist and why they are capped. In-band liquidity is read from the pool, and if it reads low the computed share reads high and the fee rate with it.",
  },
  {
    kind: "p",
    text: "The errors are not symmetric. Over-estimating fee income opens positions; under-estimating it merely declines them. The failure mode that costs money is the optimistic one.",
  },
  {
    kind: "p",
    text: "An open item, stated plainly. The first live boards printed net rates that are not credible — fee figures implying volumes far beyond what the chain actually does. Volume is being over-counted, a fee tier is being misread, or in-band liquidity is reading near zero. This is unresolved, and it must be resolved before any capital is deployed. No performance figure from the current build should be treated as meaningful.",
  },
];

export const RISK_OPERATIONAL: readonly Block[] = [
  { kind: "h", text: "Operational" },
  {
    kind: "p",
    text: "The desk's view of the chain is reconstructed rather than given. The RPC serves no archival state and caps log queries by result count, so the board is assembled from chunked queries and a persisted cache. A gap in that reconstruction is a wrong board, and a wrong board is a confidently wrong decision. Ticks still halt intermittently on rate limits; that is pacing rather than design, but it is not fixed.",
  },
  {
    kind: "p",
    text: "Holder enumeration has the same exposure in a sharper form. The recipient list is a replay of the token's whole transfer history, and a missed log range is a missed holder — a silent one.",
  },
  {
    kind: "p",
    text: "The keeper is a single hot key on a single server. The vault's design bounds what a compromise can do: no withdrawal, no new venue, no cap change, no token transfer surface. It does nothing about a keeper that is working correctly and trading badly.",
  },
  { kind: "h", text: "Dependencies outside our control" },
  {
    kind: "p",
    text: "Fee routing depends on a launch venue honouring its fee-recipient setting. Launch venues generally retain the ability to reassign that recipient, sometimes exempt from their own timelocks. Nothing in this design prevents that; what it does is keep the vault independent of any particular venue, so the venue can be changed.",
  },
  {
    kind: "p",
    text: "The chain is new. RPC availability, the depth of the stock pools, and the reliability of the tokenized instruments themselves are all third-party.",
  },
];

export const RISK_UNMITIGATED_TITLE = "What has no mitigation";

export const RISK_UNMITIGATED_INTRO =
  "Four things, listed because pretending otherwise would be the more dangerous document.";

export const RISK_UNMITIGATED = [
  {
    risk: "Divergence loss itself",
    body: "It is not hedged. It is priced, and positions are declined when it exceeds expected fees, but a position that is open is exposed to it. The only levers are range width and not opening.",
  },
  {
    risk: "Gaps",
    body: "A tokenized equity can gap when the underlying market reopens while the pool has been trading through the close. A gap straight through a concentrated range is the worst case for this kind of position, and there is no defence beyond having drawn the range wider — which costs income every interval it is not needed.",
  },
  {
    risk: "No audit",
    body: "The vault contract has a test suite that runs against a local EVM. It has not been audited by anyone.",
  },
  {
    risk: "Holder accrual can stop",
    body: "A loss cannot claw back what has already accrued to holders, because the ledger is monotonic. But a desk that is losing money records no new profit, so there is nothing to take a share of. The floor protects what has been earned, not what might be.",
  },
] as const;

// --- 10. status ------------------------------------------------------------

export const STATUS_TITLE = "Proven, built, and absent";

export const STATUS_INTRO =
  "The distinction that matters is between what has been shown to work, what exists but has never done anything, and what does not exist. Conflating the three is how a protocol gets described as finished.";

export const STATUS_PROVEN = [
  "The vault contract, against a local EVM. The venue allowlist, the selector ban, ledger monotonicity, loss absorption against working capital, the rolling rate limit and the distribution envelope are all exercised by tests.",
  "Chain constants, verified against the live RPC rather than copied from documentation — chain id, and code present at each of the singleton addresses the executor targets.",
  "The read path, live. The keeper connects to the chain, discovers pools, reconstructs volume and liquidity through chunked log queries, prices every pool, ranks them and emits intents. It has done this continuously against the real chain.",
  "Holder enumeration, by replaying the token's transfer history into balances.",
  "The build check that fails if a number documented anywhere drifts from the value in code.",
] as const;

export const STATUS_BUILT_NOTE =
  "Everything below is written, type-checked and covered by tests against fixtures. None of it has ever touched the chain.";

export const STATUS_BUILT = [
  "Every path that sends a transaction. No transaction has ever been sent by any part of this system. Opening, re-centring, sweeping, retiring, swapping, laddering and converting have all run only in dry run.",
  "The vault itself is not deployed. There is no deployed address, so there is no custody yet.",
  "Claiming a launch's own fees from an escrow.",
  "Distribution. The plan is computed and bounded; no payment has been made.",
  "Crossing chains. The rule can decide to bridge. Nothing is allowlisted to execute it.",
] as const;

export const STATUS_ABSENT = [
  "The Solana executor. The pricing model for bin-based liquidity exists and is comparable against the Uniswap side by construction — that is what makes a cross-venue decision possible at all. The execution half does not exist, and the width approximation that lets the two be compared is the weakest link in the model.",
  "A lending venue, which is why the opportunity-cost floor is zero rather than a real number.",
  "An audit.",
] as const;

export const STATUS_NEXT_TITLE = "What has to happen before capital moves";

export const STATUS_NEXT = [
  "Resolve the implausible rate figures on the live board. Until the numbers are trustworthy, every decision built on them is arbitrary.",
  "Deploy the vault and record its address.",
  "Allowlist the three venues the executor needs: the permit contract, the position manager, and the router.",
  "Point the token's fee recipient at the vault.",
  "Run dry against the live chain for a full session, and read every refusal the desk prints.",
  "Fund with an amount that would be acceptable to lose, and turn one position on.",
] as const;

export const STATUS_CLOSING =
  "Nothing about this design requires a large first position. The point of the ordered rules and the printed refusals is that the system is legible while it is small, which is the only time to find out that it is wrong.";
