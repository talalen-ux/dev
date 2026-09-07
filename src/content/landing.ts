/**
 * Landing page copy. Deliberately short — the full method lives at /method and
 * this page links to it. Plain words, real numbers, no hedging.
 */

export const TOKEN = "$RES";

export const HERO = {
  headline: "We sell into pumps. You get 75%.",
  sub: "Resident is a bot that market-makes tokenized stocks on Robinhood Chain. It holds the bags in the thinnest pools, sells when someone pumps them, and splits the profit with $RES holders every 15 minutes.",
};

export const HERO_STATS = [
  { value: "75%", label: "of profit to holders" },
  { value: "15 min", label: "between payouts" },
  { value: "0", label: "staking, lockups, claims" },
];

export const STEPS = [
  {
    n: "01",
    title: "It holds the bags",
    body: "Fees from $RES buy stock tokens in the thinnest pools on the chain. Never above fair price — it won't overpay for something it plans to sell high.",
  },
  {
    n: "02",
    title: "Someone pumps",
    body: "A market buy hits a pool with no liquidity and the price goes stupid — +25%, +80%, whatever. In thin markets this happens constantly, and it sticks around for minutes or days because nobody else is there.",
  },
  {
    n: "03",
    title: "It sells into them",
    body: "Only above fair price, and only above what it paid. It never dumps at a loss, and it sells in slices so it doesn't nuke the pool on the way out.",
  },
];

export const PAYOUT = {
  headline: "Hold $RES. Get paid.",
  body: "Every time the bot books a profit, 75% of it is owed to holders and 25% goes to a reserve that eats the losses. Payouts run every 15 minutes, pro-rata to what you hold, straight to your wallet.",
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

/** Short, and it does not dodge the ugly one. */
export const FAQS = [
  {
    q: "What if nothing pumps?",
    a: "Then there's no profit and no payout. This pays out of money it actually made — it can't pay you out of thin air, and it doesn't pretend to.",
  },
  {
    q: "What if it loses money?",
    a: "The 25% reserve absorbs it before your share is touched. And the bot never sells below what it paid, so a bad position gets held, not dumped.",
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
