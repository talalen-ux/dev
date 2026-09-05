import { SectionLabel } from "@/components/layout/SectionLabel";
import { FEATURES } from "@/content/pinlink";

/** Figma 4361:118 — label column plus stacked feature rows divided by rules. */
export function Features() {
  return (
    <section id="features" className="border-t border-rule py-xxl">
      <div className="flex flex-col gap-12 lg:flex-row">
        <SectionLabel
          label="Features"
          labelClassName="type-label"
          className="lg:w-[276px]"
        />
        <div className="flex flex-1 flex-col gap-xl">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`flex flex-col gap-6 md:flex-row md:gap-12 ${
                i > 0 ? "border-t border-rule pt-xl" : ""
              }`}
            >
              <div className="shrink-0 md:w-[276px] md:pr-xl">
                <h3 className="type-eyebrow text-text-primary">
                  {feature.title}
                </h3>
              </div>
              <div className="flex flex-1 flex-col gap-6 md:pr-xl">
                {feature.body.map((paragraph) => (
                  <p key={paragraph} className="type-body text-text-secondary">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
