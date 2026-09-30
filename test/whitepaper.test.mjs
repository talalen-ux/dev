/**
 * The whitepaper's numbers are the code's numbers.
 *
 * /whitepaper publishes every operating constant and two formulas that quote
 * constants inside them. Those rot exactly the way the docs table does: a
 * value gets tuned, the page keeps the old one, and the claim that the
 * parameters are published quietly becomes false. Every row below is bound to
 * the constant it quotes, and a row nothing binds fails the last test in this
 * file rather than passing unnoticed.
 *
 * A row here that no longer matches is not a test to update. It is either a
 * documentation change that was forgotten or a constant that moved without
 * anyone deciding it should.
 */
import test from "node:test";
import assert from "node:assert/strict";

import {
  PARAMETER_GROUPS,
  WIDTH_FORMULA,
} from "../src/content/whitepaper.ts";
import {
  DEFAULT_ENTRY_CONFIG,
  DEFAULT_WIDTH_CONFIG,
} from "../src/lib/sim/strategy.ts";
import { DEFAULT_SCAN } from "../src/lib/sim/scanner.ts";
import { DEFAULT_CAPTURE } from "../src/lib/sim/capture.ts";
import { DEFAULT_SIZING } from "../src/lib/sim/dlmm.ts";
import { DEFAULT_REBALANCE } from "../src/lib/sim/rebalance.ts";
import { DEFAULT_ROTATION } from "../src/lib/sim/rotate.ts";
import { DEFAULT_ALLOCATION } from "../src/lib/sim/allocate.ts";
import { DEFAULT_DECIDE } from "../src/lib/keeper/decide.ts";
import { DEFAULT_SWEEP, DEFAULT_RETIRE } from "../src/lib/keeper/sweep.ts";
import { DEFAULT_CONVERT } from "../src/lib/keeper/swap-v4.ts";
import { DEFAULT_DISTRIBUTION } from "../src/lib/keeper/distribution.ts";

const usd = (n) => `$${n.toLocaleString("en-US")}`;

/** meaning → the string the constant should render as. */
const BINDINGS = {
  // Range and pricing
  "Sigma multiple a range is built to contain": () =>
    `${DEFAULT_WIDTH_CONFIG.sigmas}`,
  "Horizon a range's width is sized for": () =>
    `${DEFAULT_WIDTH_CONFIG.horizon} intervals`,
  "Narrowest half-width": () => `${DEFAULT_WIDTH_CONFIG.minWidth * 100}%`,
  "Widest half-width": () => `${DEFAULT_WIDTH_CONFIG.maxWidth * 100}%`,
  "Intervals per year, for annualizing": () =>
    DEFAULT_ENTRY_CONFIG.intervalsPerYear.toLocaleString("en-US"),
  "Net rate an entry must beat": () => `${DEFAULT_ENTRY_CONFIG.minNetRate}`,

  // Gates
  "Refuse a pool not shown to range": () =>
    DEFAULT_SCAN.requireRanging ? "on" : "off",
  "Band containment is measured against": () =>
    `±${DEFAULT_SCAN.rangingHalfWidth * 100}%`,
  "Samples before capture counts as measured": () =>
    `${DEFAULT_CAPTURE.minSamples}`,
  "Capture assumed for a pool with no history": () =>
    `${DEFAULT_CAPTURE.unmeasured * 100}%`,
  "Ceiling on a measured capture estimate": () => `${DEFAULT_CAPTURE.ceiling}`,
  "A sample counts half as much after": () =>
    `${DEFAULT_CAPTURE.halfLifeMs / 3_600_000} hours`,

  // Sizing
  "Target position size at the reference cap": () => usd(DEFAULT_SIZING.baseCapital),
  "Market cap that base capital is quoted at": () =>
    usd(DEFAULT_SIZING.referenceMarketCap),
  "Floor on a sized position": () => usd(DEFAULT_SIZING.minCapital),
  "Held back from deployment at all times": () => usd(DEFAULT_DECIDE.reserve),
  "Below this, do not open at all": () => usd(DEFAULT_DECIDE.minOpen),
  "Probes into unmeasured pools": () => `${DEFAULT_DECIDE.maxProbes}`,
  "Before a probe's capture reading is used": () =>
    `${DEFAULT_DECIDE.probeIntervals} intervals`,

  // Maintaining an open position
  "Fees below this are not worth collecting": () => usd(DEFAULT_SWEEP.minAmount),
  "Collect at least this often regardless": () =>
    `${DEFAULT_SWEEP.maxIntervals} intervals`,
  "A sweep must be worth this much gas": () => `${DEFAULT_SWEEP.gasMargin}x`,
  "Net rate below which a position is failing": () => `${DEFAULT_RETIRE.floorRate}`,
  "Failing readings before closing": () => `${DEFAULT_RETIRE.runLength}`,
  "Earnings horizon a re-centre is judged over": () =>
    `${DEFAULT_REBALANCE.horizon} intervals`,
  "Re-centring must be worth": () => `${DEFAULT_REBALANCE.requiredMargin}x its cost`,
  "Youngest position that may be re-centred": () =>
    `${DEFAULT_REBALANCE.minAgeIntervals} intervals`,
  "Earnings horizon a rotation is judged over": () =>
    `${DEFAULT_ROTATION.horizon} intervals`,
  "Rotating must be worth": () => `${DEFAULT_ROTATION.requiredMargin}x its cost`,
  "Youngest position that may be rotated": () =>
    `${DEFAULT_ROTATION.minAgeIntervals} intervals`,
  "Below this, a round trip is not worth paying": () =>
    usd(DEFAULT_ROTATION.minCapital),

  // Inventory
  "Resting on a ladder before inventory is sold": () =>
    `${DEFAULT_CONVERT.patience} intervals`,
  "Most of the depth a sale may take": () => `${DEFAULT_CONVERT.maxImpact * 100}%`,
  "Bound on the executed price": () => `${DEFAULT_CONVERT.slippage * 100}%`,
  "Below this, leave the inventory alone": () => usd(DEFAULT_CONVERT.minValue),

  // Crossing chains
  "A cross-chain edge is assumed to last": () =>
    `${DEFAULT_ALLOCATION.edgeHalfLife} intervals`,
  "A cross-chain move must be worth": () =>
    `${DEFAULT_ALLOCATION.requiredMargin}x its cost`,
  "Smallest amount worth moving between chains": () =>
    usd(DEFAULT_ALLOCATION.minCapital),

  // Assumed costs
  "Gas assumed per collection": () => usd(DEFAULT_DECIDE.costs.sweepGas),
  "Gas assumed per range move": () => usd(DEFAULT_DECIDE.costs.rebalanceGas),
  "Price cost of a range move": () =>
    `${DEFAULT_DECIDE.costs.rebalanceSlippage * 100}%`,

  // The vault and distributions
  "Smallest payment worth making, per holder": () =>
    usd(DEFAULT_DISTRIBUTION.minPayment),
  "Most of a payout that may go to gas": () =>
    `${DEFAULT_DISTRIBUTION.maxGasShare * 100}%`,
  "Gas assumed per recipient": () =>
    DEFAULT_DISTRIBUTION.gasPerRecipient.toLocaleString("en-US"),
  "Gas assumed before any transfer": () =>
    DEFAULT_DISTRIBUTION.gasOverhead.toLocaleString("en-US"),
  "Recipients in one call": () => `${DEFAULT_DISTRIBUTION.maxRecipients}`,
};

const ROWS = PARAMETER_GROUPS.flatMap((g) => g.rows);

/** Bindings are keyed by meaning, so two rows sharing one would be unbindable. */
test("every published meaning is unique across the groups", () => {
  const seen = new Set();
  const duplicates = [];
  for (const row of ROWS) {
    if (seen.has(row.meaning)) duplicates.push(row.meaning);
    seen.add(row.meaning);
  }
  assert.deepEqual(duplicates, []);
});

for (const [meaning, expected] of Object.entries(BINDINGS)) {
  test(`the whitepaper's "${meaning}" matches the code`, () => {
    const row = ROWS.find((p) => p.meaning === meaning);
    assert.ok(row, `no published row for "${meaning}" — was it renamed?`);
    assert.equal(row.value, expected());
  });
}

/**
 * The check that keeps the check honest: a new published parameter has to be
 * bound to something, or the tables grow rows nothing verifies.
 */
test("every published parameter is bound to a constant or explicitly excused", () => {
  const EXCUSED = new Set([
    // A default argument of concentratedShare rather than an exported const.
    "Window competing liquidity is measured in",
    // Both live in the Solidity, and are checked against it below.
    "Holders' share of realized profit",
    "Rolling window the payout cap refills over",
  ]);
  const unbound = ROWS.filter(
    (p) => !(p.meaning in BINDINGS) && !EXCUSED.has(p.meaning),
  );
  assert.deepEqual(
    unbound.map((p) => p.meaning),
    [],
    "add a binding in this file, or excuse it with a reason",
  );
});

/** The width formula quotes four constants, so it rots like any other row. */
test("the published width formula is the width the code computes", () => {
  const { sigmas, horizon, minWidth, maxWidth } = DEFAULT_WIDTH_CONFIG;
  assert.equal(
    WIDTH_FORMULA,
    `halfWidth = clamp( ${sigmas} · σ · √${horizon} , ${minWidth} , ${maxWidth.toFixed(2)} )`,
  );
});

/** The split is in the contract, so it is checked against the contract. */
test("the holders' share on the whitepaper is the share the contract enforces", async () => {
  const { readFileSync } = await import("node:fs");
  const source = readFileSync("contracts/ResidentVault.sol", "utf8");
  // Solidity allows underscores in numeric literals, so 1_500 has to parse.
  const match = source.match(/HOLDER_BPS\s*=\s*([\d_]+)/);
  assert.ok(match, "HOLDER_BPS is no longer a literal in the contract");
  const share = Number(match[1].replace(/_/g, "")) / 100;
  const row = ROWS.find((p) => p.meaning === "Holders' share of realized profit");
  assert.equal(row.value, `${share}%`);
});

test("the payout window on the whitepaper is the window the contract enforces", async () => {
  const { readFileSync } = await import("node:fs");
  const source = readFileSync("contracts/ResidentVault.sol", "utf8");
  const match = source.match(/LIMIT_WINDOW\s*=\s*(\d+)\s*hours/);
  assert.ok(match, "LIMIT_WINDOW is no longer a literal in hours");
  const row = ROWS.find(
    (p) => p.meaning === "Rolling window the payout cap refills over",
  );
  assert.equal(row.value, `${match[1]} hours`);
});

/**
 * The one claim this page cannot make.
 *
 * The live board's rate figures are not yet trustworthy — the whitepaper says
 * so itself — so a yield, an APR or a percentage return must not appear
 * anywhere in this copy, however it got there.
 */
test("the whitepaper publishes no performance figure", async () => {
  const copy = JSON.stringify(await import("../src/content/whitepaper.ts"));
  for (const banned of ["APR", "APY", "annualized return", "returns of"]) {
    assert.ok(
      !copy.includes(banned),
      `the whitepaper must not quote performance: found "${banned}"`,
    );
  }
});
