import { Icon } from "@/components/ui/Icon";
import { VALUE_PROPS } from "@/content/pinlink";

/** Figma 4361:86 — three eyebrow + statement columns. */
export function ValueProps() {
  return (
    <section className="border-t border-rule py-xxl">
      <div className="flex flex-col gap-12 lg:flex-row">
        {VALUE_PROPS.map((item) => (
          <div key={item.eyebrow} className="flex flex-1 flex-col gap-l">
            <div className="flex items-center gap-s">
              <Icon name={item.icon} size={16} className="size-4" />
              <span className="type-eyebrow text-brand-primary">
                {item.eyebrow}
              </span>
            </div>
            <p className="type-body-lg text-text-primary">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
