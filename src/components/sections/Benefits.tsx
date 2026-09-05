import { Icon } from "@/components/ui/Icon";
import { BENEFITS, BENEFITS_HEADLINE } from "@/content/pinlink";

/** Figma 4361:143 — statement headline over a four-up benefit grid. */
export function Benefits() {
  return (
    <section
      id="benefits"
      className="flex flex-col gap-16 border-t border-rule py-xxl lg:gap-24"
    >
      <h2 className="type-h2 max-w-[708px] text-[28px] text-text-primary sm:text-[32px] lg:text-[36px]">
        {BENEFITS_HEADLINE}
      </h2>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((benefit) => (
          <div key={benefit.icon} className="flex flex-col gap-6">
            <Icon name={benefit.icon} size={24} className="size-6" />
            <h3 className="type-eyebrow text-[16px] text-text-primary">
              {benefit.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
            <p className="type-body text-text-muted">{benefit.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
