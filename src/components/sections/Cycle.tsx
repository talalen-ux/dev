import { CYCLE } from "@/content/resident";

/**
 * The capital cycle. This is a genuine sequence — fee flow only becomes a payout
 * by passing through every stage — so the steps are numbered and the terminal
 * split is drawn rather than described.
 */
export function Cycle() {
  return (
    <section id="cycle" className="border-t border-rule py-xxl">
      <div className="flex items-center gap-6 pb-16">
        <span className="type-eyebrow text-brand-primary">./</span>
        <h2 className="type-eyebrow text-text-primary">
          How the desk turns fee flow into a payout
        </h2>
      </div>

      <ol className="grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {CYCLE.map((node, i) => (
          <li
            key={node.step}
            className="flex flex-col gap-3 bg-bg-primary p-6"
          >
            <span className="type-label text-brand-primary tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="type-h5 text-text-primary">{node.step}</h3>
            <p className="type-body-sm text-text-secondary">{node.note}</p>
          </li>
        ))}

        {/* The terminal split: the sequence ends by dividing, not continuing. */}
        <li className="flex flex-col gap-3 bg-bg-secondary p-6">
          <span className="type-label text-brand-primary tabular-nums">08</span>
          <h3 className="type-h5 text-text-primary">Split</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className="type-body-sm text-text-primary">Holders</span>
              <span className="type-label text-brand-primary tabular-nums">
                75%
              </span>
            </div>
            <div
              aria-hidden
              className="flex h-1.5 w-full overflow-hidden bg-rule"
            >
              <span className="h-full w-3/4 bg-brand-primary" />
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="type-body-sm text-text-primary">
                Desk reserve
              </span>
              <span className="type-label text-text-secondary tabular-nums">
                25%
              </span>
            </div>
          </div>
        </li>
      </ol>

      <p className="type-body mt-8 max-w-[708px] text-text-secondary">
        The reserve absorbs losses on the pools and is never paid out. Everything
        else is owed to holders and carries forward until it is paid.
      </p>
    </section>
  );
}
