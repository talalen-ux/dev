/**
 * Copy for the PinLink landing page, transcribed from the Figma file
 * (yBLU5kTeT7WHKFRLVbd7Ov, page "🟢 Website", frame "Desktop / dark mode" 4361:19).
 * Kept in one place so the section components stay layout-only.
 */

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Benefits", href: "#benefits" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "FAQs", href: "#faqs" },
  { label: "DoC", href: "#docs" },
] as const;

export const HERO_HEADLINE =
  "The First RWA-Tokenized DePIN marketplace driving down costs for AI Developers and creating new revenue for asset owners.";

export const VALUE_PROPS = [
  {
    icon: "powered-by-ai",
    eyebrow: "Powered by AI",
    body: "PinAI Suite optimizes resource management for high performance computing and cloud storage.",
  },
  {
    icon: "rwa-fractionalization",
    eyebrow: "RWA-Fractionalization",
    body: "Fractionalized ownership of DePIN assets creates more flexible revenue streams for DePIN asset owners",
  },
  {
    icon: "depin-tokenization",
    eyebrow: "DePIN-Tokenization",
    body: "The RWA-tokenized DePIN model drives down costs for AI developers.",
  },
] as const;

export const FEATURES = [
  {
    title: "RWA-Tokenized DePIN Marketplace",
    body: [
      "At the heart of PinLink’s innovation lies our DePIN RWA-Tokenization model. The RWA-Tokenized model reduces costs for AI developers, creates more flexible monetization options for DePIN asset owners, and offers opportunities for individuals who do not own DePIN assets to earn a passive income stream.",
    ],
  },
  {
    title: "Fractionalized RWA ERC-1155 Representing DePIn Asset Ownership",
    body: [
      "By selling fractions of their RWA ERC-1155, DePIN asset owners can unlock the capital needed to purchase new assets from which they can generate additional rental income, thus creating an asset accumulation flywheel.",
      "By purchasing fractions of RWA ERC-1155, individuals who do not own DePIN assets gain access to a share of the revenue from these assets.",
    ],
  },
  {
    title: "Service User Rebate Model",
    body: [
      "Sales of RWA ERC-1155 generate upfront capital payments, which are then invested in generative, yield-bearing activities. These activities create new revenue sources for the PinLink ecosystem that are used to offer rebates to AI developers, lowering their cost burden.",
    ],
  },
] as const;

export const BENEFITS_HEADLINE =
  "Bringing RWA-tokenization dynamics to the DePIN sector achieves several key benefits";

export const BENEFITS = [
  {
    icon: "increased-income",
    title: ["Increased income", "for asset owners"],
    body: "Increased revenue potential and more flexible monetization options via new dual income stream from asset rental and RWA ERC-1155 sales.",
  },
  {
    icon: "attracting-capital",
    title: ["Attracting", "more capital"],
    body: "By purchasing fractional shares, non DePIN-owners can secure passive income without purchasing an entire DePIN asset, enhancing the ecosystem's decentralization and capital flow.",
  },
  {
    icon: "lower-costs",
    title: ["Lower costs", "for AI developers"],
    body: "Discounted pricing on enterprise-grade compute power due to the capital efficiencies created by PinLink’s unique RWA-tokenized DePIN marketplace mechanics.",
  },
  {
    icon: "more-income-sources",
    title: ["More income", "sources"],
    body: "Because PinLink earns protocol fees on both rental payments and ERC-1155 purchases on the protocol, it has a wider range of income sources compared with current DePIN models.",
  },
] as const;

export const ROADMAP = [
  {
    phase: "Phase 1",
    window: "{{OPENED SEPT 2024}}",
    title: "Only Protocol-Owned DePIN Assets Accepted",
    body: "Initially, only protocol-owned DePIN assets will be accepted on the PinLink marketplace. This serves two purposes. Firstly, it allows PinLink to prove out and optimize the unique RWA-tokenized DePIN marketplace model so that 3rd party DePIN asset owners can use it with confidence. Secondly, it ensures that the process of ensuring all assets are enterprise-grade and scalable easier during the onboarding of initial clients.",
  },
  {
    phase: "Phase 2",
    window: "{{EARLY 2025}}",
    title: "Opening Up PinLink To Third Party DePIN Asset Owners",
    body: "Once the model has been proven out and PinLink has a detailed understanding of Service User technical requirements, Stage 2 will involve allowing third party DePIN asset owners to connect their devices to the PinLink network. 3rd party DePIN asset owners will need to pass PinLink’s in-depth asset vetting process to ensure that the asset is enterprise grade and meets the specific present need of the PinLink client base.",
  },
] as const;

type TokenomicsRow = {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
};

export const TOKENOMICS_ROWS: readonly TokenomicsRow[] = [
  { label: "Ticker", value: "$krv [purchase]", accent: true },
  { label: "Supply", value: "100,000,000" },
  { label: "Network", value: "Ethereum" },
  { label: "Token Standard", value: "ERC-20*" },
  { label: "--", value: "--", muted: true },
  { label: "Uniswap LP", value: "80%" },
  { label: "Staking Emissions", value: "10%" },
  { label: "CEX Reserve", value: "10%" },
] as const;

export const TOKENOMICS_LINKS = [
  {
    heading: "Track",
    links: ["dexscreener chart", "etherscan", "coingecko", "coinmarketcap"],
  },
  { heading: "Audits", links: ["Hacken", "Hashlock"] },
] as const;

export const FAQS = [
  { question: "What is PinLink?", answer: null },
  { question: "How does PinLink work?", answer: null },
  {
    question:
      "How does PinLink's innovative Service User Rebate Model remain sustainable?",
    answer:
      "PinLink’s Service User Rebate Model remains sustainable by investing upfront capital from ERC-1155 sales into low-risk, yield-bearing activities. This generates additional revenue, which is used to provide rebates and drive down costs for AI developers.",
  },
  {
    question:
      "How does PinLink ensure the provision of Enterprise-Grade Quality DePIN assets to AI developers?",
    answer: null,
  },
  {
    question: "What types of DePIN assets does PinLink support?",
    answer: null,
  },
  { question: "What is the utility of the $KRV token?", answer: null },
] as const;

export const DOCS_BLURB =
  "Learn more about PinLink’s unique RWA-Tokenized DePIN model & how it reduces cost & increases performance for AI developers";

export const TAGLINE = "Your Gateway to Tokenized Compute Power";
