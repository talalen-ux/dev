import { Bands, total } from "@/components/positions/Bands";
import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { getAdapter, timeAgo, usd } from "@/lib/desk";

export const metadata = {
  title: "Positions — Resident",
  description:
    "Open concentrated-liquidity positions held by the Resident protocol, the fees they have earned, and how that fee income has been split between holders and working capital.",
};

// Live protocol state. Never serve it from a static render.
export const dynamic = "force-dynamic";

/** A headline figure. Same visual weight as the hero stats on the landing page. */
function Figure({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[36px] leading-none font-medium tracking-[-0.02em] text-text-primary tabular-nums">
        {value}
      </span>
      <span className="type-eyebrow text-text-secondary">{label}</span>
      {note ? (
        <span className="type-body-sm text-text-secondary">{note}</span>
      ) : null}
    </div>
  );
}

export default async function PositionsPage() {
  const snap = await getAdapter().snapshot();
  const { bands, ledger } = snap;
  const dp = snap.vault.payoutAsset.decimals;

  const deployed = total(bands, "capital");
  const bandFees = total(bands, "feesEarned");
  const inRange = bands.filter((b) => b.inRange).length;

  return (
    <Container>
      <SiteHeader />

      {/* The lime band. It replaces the 8px brand rule this section used to
          carry, starting at exactly the same y (pt-16 = the old border plus
          pt-14) so nothing below it shifts. The negative margins cancel the
          container's padding at each breakpoint, letting the fill reach the
          container edge while the text stays on the page grid.

          Everything inside takes on-brand rather than text-primary: they are
          the same ink today, but on-brand is the one that means "legible on
          lime", so a future palette change cannot quietly break it. */}
      <section className="-mx-6 bg-brand-fill px-6 pt-16 pb-xl text-on-brand md:-mx-12 md:px-12 min-[1440px]:-mx-24 min-[1440px]:px-24">
        <h1 className="max-w-[900px] text-[40px] leading-[1.02] font-medium tracking-[-0.02em] text-balance sm:text-[56px]">
          Positions
        </h1>
        <p className="type-body-lg mt-8 max-w-[620px]">
          Every position the protocol holds, the fees each has earned, and where
          that fee income went. Read from the vault, not from a spreadsheet.
        </p>
        <p className="type-body-sm mt-6 text-on-brand/70">
          {snap.isFixture ? "Illustrative data" : snap.chain} · updated{" "}
          {timeAgo(snap.readAt)}
        </p>
      </section>

      {/* A public page showing invented figures as though they were live would
          be worse than showing nothing, so this is deliberately unmissable and
          sits above the numbers rather than in a footnote. */}
      {snap.isFixture ? (
        <p className="type-body border-l-2 border-text-primary bg-bg-secondary px-5 py-4 text-text-primary">
          <strong className="font-semibold">
            These are illustrative figures, not live data.
          </strong>{" "}
          No vault has been deployed yet, so this page is showing example
          positions to demonstrate the format. Nothing below represents capital
          at work or fees actually earned.
        </p>
      ) : null}

      <section className="flex flex-wrap gap-x-16 gap-y-8 border-t border-rule py-10">
        <Figure
          value={usd(ledger.realized, dp)}
          label="Total fees earned"
          note="Lifetime, all positions"
        />
        <Figure
          value={usd((ledger.realized * 1500n) / 10_000n, dp)}
          label="Accrued to holders"
          note={`${usd(ledger.distributed, dp)} distributed to date`}
        />
        <Figure
          value={usd(ledger.workingCapital, dp)}
          label="Working capital"
          note="Retained 85%, less losses absorbed"
        />
        <Figure
          value={usd(deployed, dp)}
          label="Currently deployed"
          note={`${bands.length} position${bands.length === 1 ? "" : "s"}, ${inRange} in range`}
        />
      </section>

      <section className="flex flex-col gap-6 pb-xxl">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="type-h2 text-[28px] text-text-primary sm:text-[36px]">
            Open positions
          </h2>
          <span className="type-body-sm text-text-secondary">
            {usd(bandFees, dp)} earned by positions currently open
          </span>
        </div>
        <Bands bands={bands} />
        <p className="type-body-sm text-text-secondary">
          A concentrated position earns fees only while price trades inside its
          range. Positions that fall out of range are re-centered rather than
          closed at a loss.
        </p>
      </section>

      <SiteFooter />
    </Container>
  );
}
