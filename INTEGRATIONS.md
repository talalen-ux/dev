# Integrations

Most of the chain constants are now filled in. This records where each came
from, how far it has been checked, and what is still outstanding.

## Verification status — read this first

Direct access to `docs.robinhood.com`, `developers.uniswap.org`, the Robinhood
Chain RPC and its block explorer are all blocked by this environment's egress
policy. What worked was web search and `raw.githubusercontent.com`.

So every address below was transcribed from an official source and **fetched
twice from two different URLs**, matching character-for-character both times.
That proves the transcription is faithful. It does **not** prove the address
holds the contract it is labelled with, because nothing has been checked
against the chain.

```bash
RESIDENT_USDG=0x... RESIDENT_VAULT=0x... npm run verify:chain
```

Confirms the chain id, that every address has bytecode, and that USDG answers
`symbol()` and `decimals()`. Non-zero exit on any failure, so it can gate a
deploy. **Run it before anything touches money.**

## 1. Chain access — found

| | Mainnet | Testnet |
| --- | --- | --- |
| Chain id | `4663` | `46630` |
| RPC | `https://rpc.mainnet.chain.robinhood.com` | `https://rpc.testnet.chain.robinhood.com` |
| Explorer | `https://robinhoodchain.blockscout.com` | same |
| Gas token | ETH | ETH |

Robinhood Chain is an Arbitrum Orbit L2. The public RPC is rate-limited and not
recommended for production — QuickNode, Dwellir and ArrowRPC publish endpoints.
Set `RESIDENT_RPC_URL` to override.

**This row is the weakest link.** It comes from web search rather than the docs
site, which is blocked. Confirm the chain id first; `verify:chain` does it in
one call.

Still needed: the chain's **EVM version**. `test/harness.mjs` pins `shanghai`,
solc defaults to something newer, and a mismatch produces bytecode that reverts
with `invalid opcode` on deploy.

## 2. Contracts — found, except USDG

From `github.com/Uniswap/contracts/blob/main/deployments/4663.md`:

| Contract | Address |
| --- | --- |
| UniswapV3Factory | `0x1f7d7550b1b028f7571e69a784071f0205fd2efa` |
| QuoterV2 | `0x33e885ed0ec9bf04ecfb19341582aadcb4c8a9e7` |
| SwapRouter02 | `0xcaf681a66d020601342297493863e78c959e5cb2` |
| NonfungiblePositionManager | `0x73991a25c818bf1f1128deaab1492d45638de0d3` |
| TickLens | `0x7dfd4f31be6814d2906bde155c3e1b146eac1468` |
| UniswapInterfaceMulticall | `0x282a3c4d320cc7f0d5eaf56b8029e4b88338f0a3` |
| v4 PoolManager | `0x8366a39cc670b4001a1121b8f6a443a643e40951` |
| v4 Quoter | `0x8dc178efb8111bb0973dd9d722ebeff267c98f94` |
| v4 PositionManager | `0x58daec3116aae6d93017baaea7749052e8a04fa7` |
| v4 StateView | `0xf3334192d15450cdd385c8b70e03f9a6bd9e673b` |
| UniversalRouter | `0x8876789976decbfcbbbe364623c63652db8c0904` |
| Permit2 | `0x000000000022d473030f116ddee9f6b43ac78ba3` |

Permit2 matches its canonical cross-chain address, which is a third
independent check on that row.

From `github.com/ponsdotdev/ponsfamily`:

| Contract | Address |
| --- | --- |
| PonsV2LaunchFactory | `0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e` |
| PonsLaunchFactory (v1) | `0xA5aAb3F0c6EeadF30Ef1D3Eb997108E976351feB` |

**A correction to what I asked for last time.** There is no static Pons fee
escrow to configure. V2 keeps a claim-based `IPonsV2FeeEscrow` ledger rather
than one escrow contract, and every launch mints into its own bonding curve, so
there is no single address. What the desk needs is the factory (above) plus the
$RES launch address once it exists — set `RESIDENT_TOKEN`. The vault is named
as the launch's creator-fee recipient and the keeper claims against the ledger.

From `docs.robinhood.com/chain/contracts`:

| Token | Address |
| --- | --- |
| USDG | `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168` |
| WETH | `0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73` |

### Still outstanding

| Variable | What | Status |
| --- | --- | --- |
| `STOCK_TOKENS` in `src/lib/chain.ts` | Canonical Robinhood Stock Token addresses, by ticker | **Empty, and blocking.** See below. |
| `RESIDENT_VAULT` | Your deployed vault | Does not exist yet |
| `RESIDENT_TOKEN` | The $RES launch | Does not exist yet |

## The canonical stock-token registry

The contracts page carries a warning that matters more for this desk than for
most consumers of it:

> Use the addresses on this page to identify the **canonical** Robinhood Stock
> Token for each underlying — a token with a matching name/ticker but a
> different contract address is not a Robinhood Stock Token.

An impostor is the one thing the rest of the gate cannot catch. A fake token
with the right ticker, in a thin pool, has exactly the shallow book and violent
deviations the desk is built to hunt — it would be classified eligible, bought
with real USDG, and held as worthless inventory. The fillability probe does not
help: it proves a pool can be sold into, not that the asset is real. There is a
test asserting precisely this — without the registry, a fake AMC is a textbook
actionable dislocation.

So `classify()` and `evaluate()` now check token identity **before** any depth
measurement, and `verify:chain` fails while `STOCK_TOKENS` is empty. Populate it
from that page with every ticker the desk is allowed to hold, and nothing else.

Everything the keeper touches must also go on the vault's allowlist after
deploy — `setVenue(address,bool)`, owner only. The keeper cannot reach anything
that is not on that list.

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
