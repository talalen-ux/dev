import { SectionRule } from "@/components/ui/SectionRule";
import { VISION } from "@/content/landing";

/** Where the House intends to go, stated as intention rather than roadmap. */
export function Vision() {
  return (
    <>
      <SectionRule inFlow delay={-10} />
      <section id="vision" className="py-xxl">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-[320px] md:shrink-0">
            <p className="type-eyebrow text-text-secondary">{VISION.eyebrow}</p>
            <h2 className="type-h2 mt-4 max-w-[16ch] text-balance">
              {VISION.headline}
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            {VISION.body.map((paragraph) => (
              <p key={paragraph} className="type-body-lg max-w-[58ch] text-text-secondary">
                {paragraph}
              </p>
            ))}
            <p className="type-h3 mt-6 max-w-[30ch] text-balance text-text-primary">
              {VISION.close}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
