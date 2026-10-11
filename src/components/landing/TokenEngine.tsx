import { SectionRule } from "@/components/ui/SectionRule";
import { LEDGER, TOKEN, TOKENS_SECTION } from "@/content/landing";

/**
 * What the token is for, and the ledger it will be judged on.
 *
 * One figure is set large because one figure is verified: the 15% is a constant
 * in the vault contract, bound to this page by test/whitepaper.test.mjs. The
 * brief paired it with "100% of Resident's ambition", which is a brand line
 * wearing a number's clothes — next to a real statistic it teaches a reader
 * that the real one is decorative too. The ledger strip takes its place, and
 * reports zero, because zero is the number.
 */
export function TokenEngine() {
  return (
    <>
      <SectionRule inFlow delay={-8} />
      <section id="token" className="py-xxl">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="lg:w-[380px] lg:shrink-0">
            <p className="type-eyebrow text-text-secondary">
              {TOKENS_SECTION.eyebrow}
            </p>
            <p className="type-display mt-4 text-brand-primary">{TOKEN}</p>
            <h2 className="type-h2 mt-6 max-w-[16ch] text-balance">
              {TOKENS_SECTION.headline}
            </h2>
          </div>

          <div className="flex flex-1 flex-col gap-6">
            {TOKENS_SECTION.body.map((paragraph) => (
              <p key={paragraph} className="type-body-lg max-w-[58ch] text-text-secondary">
                {paragraph}
              </p>
            ))}

            <div className="mt-6 border-l-4 border-brand-fill pl-8">
              <p className="type-display text-text-primary">
                {TOKENS_SECTION.headline_stat.value}
              </p>
              <p className="type-eyebrow mt-4 text-text-primary">
                {TOKENS_SECTION.headline_stat.label}
              </p>
              <p className="type-eyebrow mt-2 text-text-secondary">
                {TOKENS_SECTION.headline_stat.note}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-rule pt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
            <div>
              <p className="type-eyebrow text-text-secondary">{LEDGER.eyebrow}</p>
              <h3 className="type-h3 mt-3 text-text-primary">{LEDGER.headline}</h3>
            </div>
            <p className="type-body-sm max-w-[44ch] text-text-secondary">{LEDGER.note}</p>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-px bg-rule lg:grid-cols-4">
            {LEDGER.rows.map((row) => (
              <div key={row.label} className="flex flex-col gap-2 bg-bg-primary p-6">
                <dt className="type-eyebrow text-text-secondary">{row.label}</dt>
                <dd className="type-h2 text-text-primary tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
