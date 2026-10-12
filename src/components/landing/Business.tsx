import { SectionRule } from "@/components/ui/SectionRule";
import { BUSINESS } from "@/content/landing";

/** Four stages, each funded by the one before it. A sequence, so numbered. */
export function Business() {
  return (
    <section id="business" className="relative py-xxl">
      <SectionRule delay={-9.8} />
      <h2 className="type-h2 mx-auto max-w-[560px] text-[28px] text-balance text-text-primary sm:text-[36px] text-center">
        {BUSINESS.headline}
      </h2>
      <p className="type-body-lg mx-auto mt-8 max-w-[640px] text-center text-text-secondary">
        {BUSINESS.standfirst}
      </p>

      <ol className="mt-16 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {BUSINESS.steps.map((step) => (
          <li
            key={step.n}
            className="hover-lime-item flex flex-col gap-4 bg-bg-primary p-8"
          >
            <span className="type-label text-brand-primary tabular-nums">{step.n}</span>
            <h3 className="type-h3 text-text-primary">{step.title}</h3>
            <p className="type-body text-text-secondary">{step.body}</p>
          </li>
        ))}
      </ol>

      <p className="type-h3 mx-auto mt-16 max-w-[520px] text-balance text-center text-text-primary">
        {BUSINESS.close}
      </p>
      {/* Travels with the line above it, always. */}
      <p className="type-body-sm mx-auto mt-6 max-w-[640px] text-center text-text-secondary">
        {BUSINESS.note}
      </p>
    </section>
  );
}
