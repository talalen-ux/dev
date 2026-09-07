import type { DeskAdapter, DeskSnapshot } from "./types";

/**
 * Live adapter. Reads the vault's public state over JSON-RPC with no
 * dependencies beyond fetch, so it works anywhere the app runs.
 *
 * The ledger, vault roles and rate limit come straight off the contract.
 * Positions, dislocations and the eligible set are the keeper's working state
 * rather than contract state — those are served by the keeper's own endpoint,
 * and this adapter returns them empty until `keeperUrl` is configured.
 */

/**
 * Function selectors on ResidentVault. Derived from the ABI, not written by
 * hand — test/selectors.test.mjs asserts every entry still matches the compiled
 * contract, so a signature change breaks the build rather than the dashboard.
 */
export const SELECTORS = {
  owner: "0x8da5cb5b",
  keeper: "0xaced1661",
  payoutAsset: "0x3eac5251",
  realized: "0x306cccd6",
  reserved: "0xfe60d12c",
  distributed: "0xf84b903e",
  owed: "0xc87d6779",
  rateLimitRemaining: "0xf5b026f7",
} as const;

async function ethCall(rpcUrl: string, to: string, data: string): Promise<string> {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to, data }, "latest"],
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`RPC ${res.status} for ${data.slice(0, 10)}`);
  const json = await res.json();
  if (json.error) throw new Error(`RPC error: ${json.error.message}`);
  return json.result as string;
}

const toBigInt = (hex: string) => (hex && hex !== "0x" ? BigInt(hex) : 0n);
const toAddress = (hex: string) => `0x${hex.slice(-40)}`;

export class RpcAdapter implements DeskAdapter {
  readonly isFixture = false;

  constructor(
    private readonly rpcUrl: string,
    private readonly vaultAddress: string,
    private readonly chainName: string,
  ) {}

  async snapshot(): Promise<DeskSnapshot> {
    const call = (data: string) => ethCall(this.rpcUrl, this.vaultAddress, data);

    const [owner, keeper, payoutAsset, realized, reserved, distributed, owed] =
      await Promise.all([
        call(SELECTORS.owner),
        call(SELECTORS.keeper),
        call(SELECTORS.payoutAsset),
        call(SELECTORS.realized),
        call(SELECTORS.reserved),
        call(SELECTORS.distributed),
        call(SELECTORS.owed),
      ]);

    const asset = toAddress(payoutAsset);
    const rateLimitRemaining = await call(
      SELECTORS.rateLimitRemaining + asset.slice(2).padStart(64, "0"),
    );
    // balanceOf(vault) on the payout asset
    const cash = await ethCall(
      this.rpcUrl,
      asset,
      "0x70a08231" + this.vaultAddress.slice(2).padStart(64, "0"),
    );

    return {
      readAt: new Date().toISOString(),
      isFixture: false,
      chain: this.chainName,
      vault: {
        address: this.vaultAddress,
        owner: toAddress(owner),
        keeper: toAddress(keeper),
        venues: [],
        payoutAsset: { address: asset, symbol: "USDG", decimals: 6 },
      },
      ledger: {
        realized: toBigInt(realized),
        reserved: toBigInt(reserved),
        distributed: toBigInt(distributed),
        owed: toBigInt(owed),
        cash: toBigInt(cash),
        rateLimitRemaining: toBigInt(rateLimitRemaining),
      },
      // Keeper working state, not contract state.
      positions: [],
      dislocations: [],
      distributions: [],
      eligible: [],
    };
  }
}
