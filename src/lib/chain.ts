/**
 * Robinhood Chain constants.
 *
 * PROVENANCE AND VERIFICATION STATUS — read before deploying anything.
 *
 * The addresses below were transcribed from official sources and each was
 * fetched twice from two different URLs, character-for-character identical both
 * times. That establishes the transcription is faithful. It does NOT establish
 * that the address holds the contract it is labelled with, because this
 * environment's egress policy blocks the Robinhood Chain RPC and its block
 * explorer, so nothing here has been checked against the chain itself.
 *
 * Run `npm run verify:chain` from a machine with RPC access before any of this
 * touches money. It checks the chain id, confirms every address has bytecode,
 * and reads USDG's symbol and decimals back.
 *
 * Sources:
 *   Uniswap v3/v4   github.com/Uniswap/contracts/blob/main/deployments/4663.md
 *   Pons            github.com/ponsdotdev/ponsfamily README
 *   Chain id / RPC  web search of docs.robinhood.com/chain (the docs site
 *                   itself is egress-blocked, so this one is second-hand and
 *                   the weakest link in the list — confirm it first)
 */

export const MAINNET = {
  name: "Robinhood Chain",
  chainId: 4663,
  rpcUrl: "https://rpc.mainnet.chain.robinhood.com",
  explorer: "https://robinhoodchain.blockscout.com",
  gasToken: "ETH",
} as const;

export const TESTNET = {
  name: "Robinhood Chain Testnet",
  chainId: 46630,
  rpcUrl: "https://rpc.testnet.chain.robinhood.com",
  explorer: "https://robinhoodchain.blockscout.com",
  gasToken: "ETH",
} as const;

/** Uniswap deployments on chain 4663, from the official Uniswap contracts repo. */
export const UNISWAP = {
  v3Factory: "0x1f7d7550b1b028f7571e69a784071f0205fd2efa",
  v3Quoter: "0x33e885ed0ec9bf04ecfb19341582aadcb4c8a9e7", // QuoterV2
  v3Router: "0xcaf681a66d020601342297493863e78c959e5cb2", // SwapRouter02
  v3PositionManager: "0x73991a25c818bf1f1128deaab1492d45638de0d3",
  v3TickLens: "0x7dfd4f31be6814d2906bde155c3e1b146eac1468",
  multicall: "0x282a3c4d320cc7f0d5eaf56b8029e4b88338f0a3",
  v4PoolManager: "0x8366a39cc670b4001a1121b8f6a443a643e40951",
  v4Quoter: "0x8dc178efb8111bb0973dd9d722ebeff267c98f94",
  v4PositionManager: "0x58daec3116aae6d93017baaea7749052e8a04fa7",
  v4StateView: "0xf3334192d15450cdd385c8b70e03f9a6bd9e673b",
  universalRouter: "0x8876789976decbfcbbbe364623c63652db8c0904",
  permit2: "0x000000000022d473030f116ddee9f6b43ac78ba3",
} as const;

/**
 * Pons launchpad.
 *
 * There is no static fee-escrow address to configure: the V2 system keeps a
 * claim-based `IPonsV2FeeEscrow` ledger rather than one escrow contract, and
 * every launch mints into its own bonding curve. The vault is set as the
 * launch's creator-fee recipient and the keeper claims against the ledger, so
 * what the desk needs is the factory plus the $RES launch address.
 */
export const PONS = {
  v2Factory: "0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e",
  v1Factory: "0xA5aAb3F0c6EeadF30Ef1D3Eb997108E976351feB",
} as const;

/** Widened from the `as const` defaults, so an env override can replace one. */
export type UniswapAddresses = { -readonly [K in keyof typeof UNISWAP]: string };
export type PonsAddresses = { -readonly [K in keyof typeof PONS]: string };

export type ChainConfig = {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorer: string;
  usdg: string;
  vault: string;
  resToken: string | null;
  uniswap: UniswapAddresses;
  pons: PonsAddresses;
};

/**
 * Values with no published source found, which therefore have no default and
 * must be supplied. Guessing either would be inventing an address that will
 * hold money.
 */
const REQUIRED: Array<[string, string]> = [
  [
    "RESIDENT_USDG",
    "USDG token on Robinhood Chain — not found in any source I could reach",
  ],
  ["RESIDENT_VAULT", "your deployed ResidentVault"],
];

export function missingKeys(env: NodeJS.ProcessEnv = process.env): string[] {
  return REQUIRED.filter(([key]) => !env[key]).map(([key]) => key);
}

export const isConfigured = (env: NodeJS.ProcessEnv = process.env) =>
  missingKeys(env).length === 0;

/** Resolve the chain config, or throw naming what is missing and why. */
export function requireChain(
  env: NodeJS.ProcessEnv = process.env,
): ChainConfig {
  const missing = REQUIRED.filter(([key]) => !env[key]);
  if (missing.length) {
    throw new Error(
      "Robinhood Chain is not fully configured:\n" +
        missing.map(([key, why]) => `  ${key} — ${why}`).join("\n") +
        "\nSee INTEGRATIONS.md.",
    );
  }

  const testnet = env.RESIDENT_NETWORK === "testnet";
  const net = testnet ? TESTNET : MAINNET;

  return {
    name: env.RESIDENT_CHAIN_NAME ?? net.name,
    chainId: Number(env.RESIDENT_CHAIN_ID ?? net.chainId),
    rpcUrl: env.RESIDENT_RPC_URL ?? net.rpcUrl,
    explorer: env.RESIDENT_EXPLORER ?? net.explorer,
    usdg: env.RESIDENT_USDG!,
    vault: env.RESIDENT_VAULT!,
    resToken: env.RESIDENT_TOKEN ?? null,
    uniswap: {
      ...UNISWAP,
      ...(env.RESIDENT_V3_FACTORY
        ? { v3Factory: env.RESIDENT_V3_FACTORY }
        : {}),
      ...(env.RESIDENT_V3_QUOTER ? { v3Quoter: env.RESIDENT_V3_QUOTER } : {}),
      ...(env.RESIDENT_V3_ROUTER ? { v3Router: env.RESIDENT_V3_ROUTER } : {}),
      ...(env.RESIDENT_V3_POSITION_MANAGER
        ? { v3PositionManager: env.RESIDENT_V3_POSITION_MANAGER }
        : {}),
    },
    pons: {
      ...PONS,
      ...(env.RESIDENT_PONS_V2_FACTORY
        ? { v2Factory: env.RESIDENT_PONS_V2_FACTORY }
        : {}),
    },
  };
}

/** Every address the desk will interact with, for the verifier to walk. */
export function addressManifest(config: ChainConfig): Array<[string, string]> {
  return [
    ["USDG", config.usdg],
    ["UniswapV3Factory", config.uniswap.v3Factory],
    ["QuoterV2", config.uniswap.v3Quoter],
    ["SwapRouter02", config.uniswap.v3Router],
    ["NonfungiblePositionManager", config.uniswap.v3PositionManager],
    ["TickLens", config.uniswap.v3TickLens],
    ["v4 PoolManager", config.uniswap.v4PoolManager],
    ["v4 Quoter", config.uniswap.v4Quoter],
    ["v4 StateView", config.uniswap.v4StateView],
    ["UniversalRouter", config.uniswap.universalRouter],
    ["Permit2", config.uniswap.permit2],
    ["PonsV2LaunchFactory", config.pons.v2Factory],
    ["ResidentVault", config.vault],
  ];
}
