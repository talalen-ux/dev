import { SectionRule } from "@/components/ui/SectionRule";
import { THESIS } from "@/content/landing";

/** The argument before the product: why a liquidity business exists at all. */
export function Thesis() {
  return (
    <section id="thesis" className="relative py-xxl">
      <SectionRule delay={-2.7} />
      <h2 className="type-h2 max-w-[720px] text-[28px] text-balance text-text-primary sm:text-[36px]">
        {THESIS.headline}
      </h2>

      <div className="mt-12 flex flex-col gap-6">
        {THESIS.body.map((paragraph) => (
          <p key={paragraph} className="type-body-lg max-w-[720px] text-text-secondary">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
