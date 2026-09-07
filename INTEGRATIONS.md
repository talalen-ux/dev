# What I need from you

The engines are built and tested. What is missing is everything chain-specific:
this session has no network access at all, so I could not look up a single
Robinhood Chain address, and I have not guessed any. A wrong router address is
funds sent to a stranger, so `src/lib/chain.ts` throws on startup naming the
missing variable rather than defaulting to anything.

Fill in `.env.example` and the whole product runs against the real chain.

## 1. Chain access

| Variable | What it is |
| --- | --- |
| `RESIDENT_RPC_URL` | A Robinhood Chain RPC endpoint. Archive access if you want the smart-LP tracker to backfill more than the recent window. |
| `RESIDENT_CHAIN_ID` | Numeric chain id. |

Also tell me the chain's **EVM version**. `test/harness.mjs` pins `shanghai`;
solc now defaults to something newer, and a mismatch produces bytecode that
reverts with `invalid opcode` on deploy.

## 2. Contracts

| Variable | What it is | Why |
| --- | --- | --- |
| `RESIDENT_USDG` | USDG token | Quote asset for every position and payout |
| `RESIDENT_V3_FACTORY` | Uniswap v3 factory | Pool discovery |
| `RESIDENT_V3_QUOTER` | QuoterV2 | The fillability probe and impact sweep |
| `RESIDENT_V3_ROUTER` | SwapRouter | Execution |
| `RESIDENT_V3_POSITION_MANAGER` | NonfungiblePositionManager | LP bands |
| `RESIDENT_V4_POOL_MANAGER` | v4 PoolManager | Only if v4 pools are in scope |
| `RESIDENT_V4_QUOTER` | v4 Quoter | Only if v4 pools are in scope |
| `RESIDENT_PONS_FEE_ESCROW` | Pons v2 fee escrow | Where the $RES creator fee accrues |

Every one of these must also be added to the vault's allowlist after deploy —
`setVenue(address,bool)`, owner only. The keeper cannot reach anything that is
not on that list.

## 3. An indexer — the one integration that is not just an address

The opportunity board and the smart-LP tracker need data an RPC cannot serve
fast enough:

- **Per-pool volume** over 5m / 1h / 6h / 24h windows.
- **24h price peak** per pool.
- **Pool creation time**, for the age gate.
- **Mint / burn / collect events** with the wallet behind each, for wallet
  scoring.
- **Swap events** with in-range liquidity, to credit fees to positions.

Options, roughly in order of effort:

1. **A Uniswap v3 subgraph on Robinhood Chain**, if one is deployed. Cheapest
   by far — set `RESIDENT_INDEXER_URL` and I write the queries.
2. **Self-hosted Graph node or Ponder**, indexing the factory and pools. A day
   or two of work, and it is what a desk running continuously will want anyway.
3. **Log polling straight off the RPC** into a local store. Works, and it is
   slow and fragile across reorgs. I would only do this to get moving.

Tell me which and I will write the adapter behind `PoolsSource`, which is the
one interface the board depends on. Nothing in the UI changes.

## 4. Reference prices

`RESIDENT_REFERENCE_API_URL` / `RESIDENT_REFERENCE_API_KEY`.

The whole method is priced against the issuer's consolidated primary-market
quote — bid/ask midpoint × the corporate-action multiplier, refreshed every 15
seconds, with Chainlink tokenized-equity feeds as the fallback. I need to know
which issuer feed you have access to and how it authenticates. Without it the
desk has no P̂ and every gate downstream is meaningless.

If Chainlink feeds are the primary rather than the fallback, I need the feed
addresses per instrument, and the ETH/USD feed for ETH-quoted venues.

## 5. Keys, which I should not have

Deployment and the keeper both need private keys. I have not asked for any and
should not be given any. Deploy from your own machine following
`DEPLOYMENT.md`; the keeper needs its own key holding gas only, kept separate
from the owner key that can withdraw.

## What already works without any of this

- `npm test` — 68 tests: vault, selectors, swap math, desk gates, opportunity
  engine, smart-LP tracker.
- `npm run simulate -- --scenarios` — the decision gate against constructed
  pools.
- `/desk` and `/desk/pools` — both run on fixtures and say so on screen.

## What is still unverified regardless of configuration

- No contract has been deployed anywhere, and none is audited.
- The swap engine has never run against a real pool.
- `sqrtPriceAtTick` uses floating-point `Math.pow` rather than exact TickMath
  (~1e-12 relative). Fine for sizing, wrong for an on-chain port.
- The tick loader reads ±40 spacings, so a swap walking past that window
  under-reports depth.
- Fee estimates on the board assume a band sits in range for the whole window
  at a constant share. That is the optimistic case, not the expected case.
