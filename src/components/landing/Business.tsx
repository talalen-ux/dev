import { SectionRule } from "@/components/ui/SectionRule";
import { BUSINESS } from "@/content/landing";

/**
 * Four steps from a trade on the token to a payment to its holders.
 *
 * Numbered because the order is real: each stage is funded by the one before
 * it, and the last one is a share of what the third actually banked.
 */
export function Business() {
  return (
    <>
      <SectionRule inFlow delay={-4} />
      <section id="business" className="py-xxl">
        <p className="type-eyebrow text-text-secondary">{BUSINESS.eyebrow}</p>
        <h2 className="type-h2 mt-4 max-w-[18ch] text-balance">
          {BUSINESS.headline}
        </h2>
        <p className="type-body-lg mt-8 max-w-[64ch] text-text-secondary">
          {BUSINESS.standfirst}
        </p>

        <ol className="mt-16 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2">
          {BUSINESS.steps.map((step) => (
            <li key={step.n} className="flex flex-col gap-3 bg-bg-primary p-8">
              <span className="type-label text-brand-primary tabular-nums">
                {step.n}
              </span>
              <h3 className="type-h3 text-text-primary">{step.title}</h3>
              <p className="type-body max-w-[46ch] text-text-secondary">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="type-h3 mt-16 max-w-[24ch] text-balance text-text-primary">
          {BUSINESS.close}
        </p>
        {/* Travels with the line above it, always. */}
        <p className="type-body-sm mt-6 max-w-[72ch] border-l-2 border-brand-primary pl-5 text-text-secondary">
          {BUSINESS.note}
        </p>
      </section>
    </>
  );
}
