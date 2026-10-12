import { SectionRule } from "@/components/ui/SectionRule";
import { LEDGER, TOKEN, TOKENS_SECTION } from "@/content/landing";

/**
 * The token, and the ledger it will be judged on.
 *
 * The 15/85 split is drawn rather than described, because it is the one figure
 * on this page that is verified — a constant in the vault contract, bound here
 * by test/whitepaper.test.mjs. The ledger beside it reports zero four times,
 * which is the number.
 */
export function TokenEngine() {
  return (
    <section id="token" className="relative py-xxl">
      <SectionRule delay={-3.2} />
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-24">
        <div className="flex flex-1 flex-col gap-6">
          <p className="type-label text-brand-primary">{TOKEN}</p>
          <h2 className="type-h2 text-[28px] text-balance text-text-primary sm:text-[36px]">
            {TOKENS_SECTION.headline}
          </h2>
          {TOKENS_SECTION.body.map((paragraph) => (
            <p key={paragraph} className="type-body-lg max-w-[480px] text-text-secondary">
              {paragraph}
            </p>
          ))}

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="type-eyebrow text-text-primary">
                {TOKENS_SECTION.headline_stat.label}
              </span>
              <span className="text-[20px] leading-none font-medium tabular-nums text-text-primary">
                {TOKENS_SECTION.headline_stat.value}
              </span>
            </div>
            <div aria-hidden className="flex h-3 w-full overflow-hidden bg-rule">
              <span className="h-full w-[15%] bg-brand-fill" />
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <span className="type-eyebrow text-text-secondary">
                Working capital: redeployed, absorbs losses
              </span>
              <span className="type-eyebrow text-text-secondary tabular-nums">85%</span>
            </div>
          </div>
        </div>

        <div className="flex-1 self-start">
          <div className="flex items-baseline justify-between gap-6">
            <p className="type-eyebrow text-text-primary">{LEDGER.headline}</p>
          </div>
          <dl className="mt-6 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2">
            {LEDGER.rows.map((row) => (
              <div key={row.label} className="flex flex-col gap-2 bg-bg-primary p-6">
                <dt className="type-eyebrow text-brand-primary">{row.label}</dt>
                <dd className="text-[28px] leading-none font-medium tabular-nums text-text-primary">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="type-body-sm mt-6 max-w-[440px] text-text-secondary">
            {LEDGER.note}
          </p>
        </div>
      </div>
    </section>
  );
}
