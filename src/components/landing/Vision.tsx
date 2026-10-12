import { SectionRule } from "@/components/ui/SectionRule";
import { VISION } from "@/content/landing";

/** Where the House intends to go, stated as intention rather than roadmap. */
export function Vision() {
  return (
    <section id="vision" className="relative py-xxl">
      <SectionRule delay={-7.4} />
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-24">
        <h2 className="type-h2 shrink-0 text-[28px] text-balance text-text-primary sm:text-[36px] lg:w-[400px]">
          {VISION.headline}
        </h2>
        <div className="flex flex-1 flex-col gap-6">
          {VISION.body.map((paragraph) => (
            <p key={paragraph} className="type-body-lg max-w-[620px] text-text-secondary">
              {paragraph}
            </p>
          ))}
          <p className="type-h3 mt-4 max-w-[480px] text-text-primary">{VISION.close}</p>
        </div>
      </div>
    </section>
  );
}
