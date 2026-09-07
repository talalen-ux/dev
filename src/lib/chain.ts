/**
 * Chain constants for Robinhood Chain.
 *
 * EVERY VALUE HERE IS UNVERIFIED. Nothing in this repo has reached Robinhood
 * Chain — the environment it was built in blocks all outbound RPC — so these
 * are declarations of what the code needs, not addresses anyone has confirmed.
 * They are deliberately left unset rather than filled with plausible-looking
 * values, because a wrong router address is funds sent to a stranger.
 *
 * Set them through the environment. `requireChain()` throws if anything is
 * missing, so the failure is a startup error naming the variable rather than a
 * transaction to the zero address.
 *
 * See INTEGRATIONS.md for what each one is and where to find it.
 */

export type ChainConfig = {
  name: string;
  chainId: number;
  rpcUrl: string;
  /** Quote asset every position and payout is denominated in. */
  usdg: string;
  /** Uniswap v3 factory, for discovering pools. */
  v3Factory: string;
  /** QuoterV2 — the fillability probe and impact sweep run through this. */
  v3Quoter: string;
  /** SwapRouter, for execution. */
  v3Router: string;
  /** NonfungiblePositionManager, for LP bands. */
  v3PositionManager: string;
  /** Uniswap v4 PoolManager, if v4 pools are in scope. */
  v4PoolManager: string | null;
  /** v4 Quoter, if v4 pools are in scope. */
  v4Quoter: string | null;
  /** Pons v2 fee escrow the $RES creator fee accrues to. */
  ponsFeeEscrow: string;
  /** Deployed vault. */
  vault: string;
};

const KEYS: Array<[keyof ChainConfig, string]> = [
  ["rpcUrl", "RESIDENT_RPC_URL"],
  ["usdg", "RESIDENT_USDG"],
  ["v3Factory", "RESIDENT_V3_FACTORY"],
  ["v3Quoter", "RESIDENT_V3_QUOTER"],
  ["v3Router", "RESIDENT_V3_ROUTER"],
  ["v3PositionManager", "RESIDENT_V3_POSITION_MANAGER"],
  ["ponsFeeEscrow", "RESIDENT_PONS_FEE_ESCROW"],
  ["vault", "RESIDENT_VAULT"],
];

/** True when the chain is configured well enough to talk to. */
export function isConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return KEYS.every(([, envKey]) => Boolean(env[envKey]));
}

/** Which variables are still missing. Drives the banner the dashboard shows. */
export function missingKeys(env: NodeJS.ProcessEnv = process.env): string[] {
  return KEYS.filter(([, envKey]) => !env[envKey]).map(([, envKey]) => envKey);
}

/**
 * Resolve the chain config, or throw naming what is missing.
 *
 * Called before anything that would build a transaction. The alternative —
 * defaulting to the zero address — turns a configuration mistake into a
 * transfer, so this throws instead.
 */
export function requireChain(env: NodeJS.ProcessEnv = process.env): ChainConfig {
  const missing = missingKeys(env);
  if (missing.length) {
    throw new Error(
      `Robinhood Chain is not configured. Missing: ${missing.join(", ")}. ` +
        `See INTEGRATIONS.md — no address in this repo has been verified against a live chain.`,
    );
  }

  return {
    name: env.RESIDENT_CHAIN_NAME ?? "Robinhood Chain",
    chainId: Number(env.RESIDENT_CHAIN_ID ?? 0),
    rpcUrl: env.RESIDENT_RPC_URL!,
    usdg: env.RESIDENT_USDG!,
    v3Factory: env.RESIDENT_V3_FACTORY!,
    v3Quoter: env.RESIDENT_V3_QUOTER!,
    v3Router: env.RESIDENT_V3_ROUTER!,
    v3PositionManager: env.RESIDENT_V3_POSITION_MANAGER!,
    v4PoolManager: env.RESIDENT_V4_POOL_MANAGER ?? null,
    v4Quoter: env.RESIDENT_V4_QUOTER ?? null,
    ponsFeeEscrow: env.RESIDENT_PONS_FEE_ESCROW!,
    vault: env.RESIDENT_VAULT!,
  };
}
