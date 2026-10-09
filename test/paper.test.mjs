/**
 * A paper book, and the line between what it measures and what it assumes.
 *
 * The principal leg is a real measurement: real price, real bounds, the same
 * algebra a live mark uses. The fee leg is the model's own estimate. Most of
 * these tests are about keeping those two apart, because a paper book that
 * mixes them produces a track record of its own assumptions.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { accruedFrom, markPaper, paperReturn } from "../src/lib/keeper/paper.ts";
import { shouldRetire } from "../src/lib/keeper/sweep.ts";
import { positionValue, liquidityForCapital } from "../src/lib/sim/band.ts";

const position = {
  id: "p1", chain: "robinhood", pool: "AI/USDG", kind: "band", handle: "dry:1",
  capital: 10_000, lower: 0.95, upper: 1.05,
  openedAt: 0, feesSwept: 0, lastSweptAt: 0,
};

const base = {
  position, price: 1, openPrice: 1,
  volume: 5_000, liquidity: 500_000, volatility: 0.002, feePips: 3000,
  captureEfficiency: 0.5, feesAccrued: 0, freshHalfWidth: 0.04,
  series: undefined, now: 3_600_000, intervalMs: 60_000,
};

test("a position opened at the current price is worth about its capital", () => {
  const mark = markPaper(base);
  assert.ok(
    Math.abs(mark.value - position.capital) / position.capital < 0.001,
    `${mark.value} should be near ${position.capital}`,
  );
  assert.equal(mark.unrealised, mark.value - position.capital);
});

test("the principal leg is marked by the same algebra a live position uses", () => {
  const mark = markPaper({ ...base, price: 1.02 });
  const liquidity = liquidityForCapital(10_000, 0.95, 1.05, 1);
  const expected = positionValue(liquidity, 0.95, 1.05, 1.02);
  // Not an approximation of a live mark. The identical function.
  assert.equal(mark.value, expected);
});

test("the position loses against holding in both directions, which quote P&L hides", () => {
  const up = markPaper({ ...base, price: 1.04 });
  const down = markPaper({ ...base, price: 0.96 });

  // In quote terms the position is UP when the price rises. That is why
  // principal alone is not the measure: it reads as a gain on exactly the move
  // that cost the position money.
  assert.ok(up.value > position.capital, "quote value rises with price");
  assert.ok(up.value < up.heldValue, "but it is worth less than simply holding");
  assert.ok(down.value < down.heldValue, "and less on the way down too");
});

test("divergence is what the modelled fees have to cover before anything is earned", () => {
  const book = paperReturn({
    deposit: 10_000, cash: 0, feesSwept: 0,
    positions: [{ capital: 10_000, value: 10_116, feesUnclaimed: 40, heldValue: 10_195 }],
  });
  // Quote P&L says +116 and the position is losing: it is 79 behind holding,
  // and the modelled fees have only made 40 of that back.
  assert.equal(book.principalChange, 116);
  assert.equal(book.divergence, -79);
  assert.ok(book.divergence + book.feesUnswept < 0, "fees have not covered it");
});

test("a position whose price has left its range earns nothing", () => {
  const out = markPaper({ ...base, price: 1.2 });
  assert.equal(out.currentRate, 0);
  assert.equal(out.feeEstimate, 0);
  // It still has a value: the capital is all on one side, not gone.
  assert.ok(out.value > 0);
});

test("every mark is flagged as modelled, so the report cannot forget", () => {
  assert.equal(markPaper(base).modelled, true);
});

test("accrued fees are summed from the marks, not recomputed", () => {
  const series = {
    positionId: "p1",
    marks: [
      { at: 10, value: 1, feesUnclaimed: 0, price: 1, feeEstimate: 3 },
      { at: 20, value: 1, feesUnclaimed: 0, price: 1, feeEstimate: 4 },
      { at: 30, value: 1, feesUnclaimed: 0, price: 1, feeEstimate: 5 },
    ],
    sweeps: [{ at: 25, amount: 7 }],
  };
  // Only what accrued since the last sweep. Counting the earlier marks would
  // double-count fees the sweep already took out.
  assert.equal(accruedFrom(series), 5);
  assert.equal(accruedFrom(undefined), 0);
});

test("the book keeps principal and fees apart rather than summing them", () => {
  const book = paperReturn({
    deposit: 10_000,
    cash: 4_000,
    positions: [{ capital: 6_000, value: 5_800, feesUnclaimed: 120, heldValue: 5_900 }],
    feesSwept: 80,
  });
  assert.equal(book.positionValue, 5_800);
  // The position is down 200 on principal and up 120 on modelled fees. A single
  // "profit" would show -80 and hide that one half is measured and the other
  // is an assumption.
  assert.equal(book.principalChange, -200);
  assert.equal(book.feesUnswept, 120);
  assert.equal(book.equity, 9_920);
  assert.ok(Math.abs(book.totalReturn - -0.008) < 1e-9);
});

test("an all-cash book returns exactly zero rather than NaN", () => {
  const book = paperReturn({ deposit: 10_000, cash: 10_000, positions: [], feesSwept: 0 });
  assert.equal(book.equity, 10_000);
  assert.equal(book.totalReturn, 0);
  assert.equal(book.principalChange, 0);
});

test("a book with no deposit does not divide by it", () => {
  const book = paperReturn({ deposit: 0, cash: 0, positions: [], feesSwept: 0 });
  assert.equal(book.totalReturn, 0);
});

test("age and sweep gaps are counted in intervals", () => {
  const mark = markPaper({
    ...base,
    position: { ...position, openedAt: 0, lastSweptAt: 1_800_000 },
    now: 3_600_000, intervalMs: 60_000,
  });
  assert.equal(mark.ageIntervals, 60);
  assert.equal(mark.intervalsSinceSweep, 30);
});

/**
 * The quiet-pool trap.
 *
 * A held pool that stops trading used to vanish from the board, which made its
 * position unmarkable and therefore unmanageable: the retire rule skips what it
 * cannot see, so the capital sat committed indefinitely. Held pools are now
 * read whatever their activity, which fixes the stranding and introduces a
 * second way to get this wrong — marking the quiet interval as a net rate of
 * zero would hand the retire rule ten readings under its floor and close a
 * sound position after ten quiet minutes.
 *
 * So an unmeasured interval marks the principal leg, which is real, and
 * declines to invent a rate.
 */
test("an interval with no market data marks the price but contributes no rate", () => {
  const earning = [0.004, 0.003, 0.005];
  const series = { marks: earning.map((rate) => ({ rate })), sweeps: [] };

  const quiet = markPaper({
    ...base,
    price: 1.02,
    volume: 0,
    liquidity: 0,
    volatility: 0,
    series,
    measured: false,
  });

  assert.equal(quiet.measured, false);
  assert.equal(quiet.feeEstimate, 0, "a pool nobody traded earned nothing");

  // The principal leg is untouched by the pool being quiet.
  const live = markPaper({ ...base, price: 1.02, series });
  assert.equal(quiet.value, live.value, "price and value are still real");
  assert.equal(quiet.heldValue, live.heldValue);

  // And the retire run is exactly what it was before the quiet interval.
  assert.deepEqual(quiet.recentRates, earning);
  assert.equal(
    live.recentRates.length,
    earning.length + 1,
    "a measured interval does add its reading",
  );
});

test("a measured interval is the default, so an observer that says nothing is unchanged", () => {
  assert.equal(markPaper(base).measured, true);
  assert.equal(markPaper({ ...base, measured: true }).measured, true);
});

test("ten quiet intervals do not retire a position that was earning", async () => {
  // Three good readings, then the pool goes quiet for longer than the retire
  // rule's whole run length. The journal records a mark each interval; the ones
  // with no market data carry no rate, exactly as loop.ts writes them.
  const marks = [{ rate: 0.004 }, { rate: 0.003 }, { rate: 0.005 }];

  for (let i = 0; i < 10; i++) {
    const series = { marks: [...marks], sweeps: [] };
    const quiet = markPaper({
      ...base, price: 1.01, volume: 0, liquidity: 0, volatility: 0,
      series, measured: false,
    });
    marks.push({
      price: quiet.price,
      rate: quiet.measured === false ? undefined : quiet.currentRate,
    });
  }

  const series = { marks, sweeps: [] };
  const final = markPaper({
    ...base, price: 1.01, volume: 0, liquidity: 0, volatility: 0,
    series, measured: false,
  });

  assert.deepEqual(final.recentRates, [0.004, 0.003, 0.005], "only the real readings");
  assert.equal(
    shouldRetire(final.recentRates).retire,
    false,
    "a pool nobody traded is an absence of evidence, not a failing position",
  );
});
