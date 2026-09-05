import { Icon } from "@/components/ui/Icon";
import { DOCS_BLURB } from "@/content/pinlink";

/** Figma 4361:240 — documentation prompt with a [read docs] action. */
export function DocsCta() {
  return (
    <section
      id="docs"
      className="flex flex-col gap-8 border-t border-rule py-xl lg:flex-row lg:gap-12"
    >
      <div className="flex items-center gap-6 lg:w-[600px]">
        <Icon name="docs" width={28} height={20} className="h-5 w-7" />
        <span className="type-label text-text-primary">Documentation</span>
      </div>
      <p className="type-body text-text-secondary lg:w-[382px]">{DOCS_BLURB}</p>
      <div className="flex flex-1 lg:justify-end">
        <a href="#" className="type-eyebrow text-brand-primary">
          [read docs]
        </a>
      </div>
    </section>
  );
}
