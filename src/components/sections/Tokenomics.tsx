import { Icon } from "@/components/ui/Icon";
import { TOKENOMICS_LINKS, TOKENOMICS_ROWS } from "@/content/pinlink";

/** Figma 4373:313 — opens with a 4px accent rule; label / keys / values / links. */
export function Tokenomics() {
  return (
    <section
      id="tokenomics"
      className="flex flex-col gap-12 border-t-4 border-brand-primary py-xxl lg:flex-row"
    >
      <div className="flex flex-1 items-center gap-6">
        <Icon name="tokenomics-dot" size={16} className="size-4" />
        <span className="type-eyebrow text-text-primary">Tokenomics</span>
      </div>

      <dl className="flex flex-1 gap-12">
        <div className="flex flex-1 flex-col gap-s">
          {TOKENOMICS_ROWS.map((row, i) => (
            <dt
              key={`${row.label}-${i}`}
              className={`type-eyebrow ${
                row.muted ? "text-text-secondary" : "text-text-primary"
              }`}
            >
              {row.label}
            </dt>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-s">
          {TOKENOMICS_ROWS.map((row, i) => (
            <dd
              key={`${row.value}-${i}`}
              className={`type-eyebrow ${
                row.accent
                  ? "text-brand-primary"
                  : row.muted
                    ? "text-text-secondary"
                    : "text-text-primary"
              }`}
            >
              {row.value}
            </dd>
          ))}
        </div>
      </dl>

      <div className="flex flex-1 flex-col gap-s">
        {TOKENOMICS_LINKS.map((group) => (
          <div key={group.heading} className="flex flex-col gap-s">
            <span className="type-eyebrow text-text-secondary">
              {group.heading}
            </span>
            {group.links.map((link) => (
              <a
                key={link}
                href="#"
                className="type-eyebrow text-brand-primary"
              >
                &gt; {link}
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
