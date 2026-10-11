import { SectionRule } from "@/components/ui/SectionRule";
import { THESIS } from "@/content/landing";

/** Why a liquidity business exists at all: the argument before the product. */
export function Thesis() {
  return (
    <>
      <SectionRule inFlow delay={-2} />
      <section id="thesis" className="py-xxl">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-[320px] md:shrink-0">
            <p className="type-eyebrow text-text-secondary">{THESIS.eyebrow}</p>
            <h2 className="type-h2 mt-4 max-w-[16ch] text-balance">
              {THESIS.headline}
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            {THESIS.body.map((paragraph) => (
              <p
                key={paragraph}
                className="type-body-lg max-w-[58ch] text-text-secondary"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
