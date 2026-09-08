/**
 * Landing page copy. Deliberately short — the full method lives at /method and
 * this page links to it. Plain words, real numbers, no hedging.
 *
 * On the 85/15 split: the 85% is working capital, not a holder claim held back.
 * It gets deployed, it takes the losses, and the owner key can withdraw it. Copy
 * that lets a reader think of it as "their other 85%" would be a lie, so the
 * page says whose it is every time it names the number.
 */

export const TOKEN = "$RES";

export const HERO = {
  headline: "Every $RES trade funds a position. You get 15% in cash.",
  sub: "Resident is a bot that provides liquidity in the thinnest, busiest pools on Robinhood Chain. Fees from $RES trading pay for the positions. 15% of everything it books goes to holders in USDG every 15 minutes.",
};

export const HERO_STATS = [
  { value: "15%", label: "of everything booked, to holders" },
  { value: "15 min", label: "between payouts" },
  { value: "0", label: "staking, lockups, claims" },
];

export const STEPS = [
  {
    n: "01",
    title: "$RES fees fund the desk",
    body: "Every buy and sell of $RES pays a fee. It goes to the vault the bot trades out of — not to a team wallet, not to a treasury that sits there.",
  },
  {
    n: "02",
    title: "It provides liquidity where it pays",
    body: "Pools thin enough that a $10k order moves the price, and busy enough that traders keep paying fees into them all day. The capital sits in a tight range around the price, so it earns where the trading actually happens instead of spread across a range nothing touches.",
  },
  {
    n: "03",
    title: "It moves with the price",
    body: "A tight range only earns while the price is inside it, so the desk re-centers as things move. A position that ends up underwater gets held and re-centered, not dumped.",
  },
];

export const PAYOUT = {
  headline: "Hold $RES. Get paid.",
  body: "Everything the desk books — $RES trading fees and what the positions earn — splits two ways. 15% is owed to holders and pushed to your wallet every 15 minutes, pro-rata to what you hold. The other 85% goes straight back out into new positions.",
  points: [
    { label: "No staking", body: "Just hold the token in your wallet." },
    { label: "No claiming", body: "It pushes to you. Nothing to sign." },
    {
      label: "Nothing expires",
      body: "Owed profit carries forward until it's paid. It never resets.",
    },
    {
      label: "Paid in USDG",
      body: "Once at least $300 is owed across all holders.",
    },
  ],
};

/** Short, and it does not dodge the ugly ones. */
export const FAQS = [
  {
    q: "Why only 15%?",
    a: "Because the other 85% is what earns the fees in the first place. A desk that pays out everything stops growing and the payouts shrink with it. Be clear about what that 85% is, though: it's the desk's working capital, not your money held back. It takes the losses, and you have no claim on it.",
  },
  {
    q: "What if nothing trades?",
    a: "Then there are no fees and no payout. This pays out of money it actually made — it can't pay you out of thin air, and it doesn't pretend to.",
  },
  {
    q: "What if it loses money?",
    a: "The working capital takes the hit first. What's already been booked as owed to you can't be clawed back — but a loss stops new profit from accruing until the desk has made it back, so payouts go quiet for a while. Less capital also means smaller fees afterwards.",
  },
  {
    q: "Can the team rug?",
    a: "Yes. The owner wallet can withdraw everything from the vault at any time, with no timelock and no vote. The bot itself can't — it can only trade approved venues and pay holders — but the owner key can empty it. That's the real risk here, and no amount of code stops it. Anyone telling you otherwise is lying.",
  },
  {
    q: "Is this audited?",
    a: "Not yet. The contracts are tested but not audited, and nothing has been deployed to mainnet.",
  },
];

export const FOOTER_NOTE =
  "Tokenized equities are volatile and thin. You can lose money holding $RES. Nothing here is financial advice.";

export const TAGLINE = "The resident market maker for tokenized equities";
