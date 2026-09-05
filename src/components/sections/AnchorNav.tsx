import { Icon } from "@/components/ui/Icon";
import { NAV_LINKS } from "@/content/pinlink";

/** Figma 4361:76 — in-page anchors; the first is the active state. */
export function AnchorNav() {
  return (
    <nav className="flex items-center gap-6 overflow-x-auto border-t border-rule py-5">
      <Icon name="nav-arrow" size={20} className="size-5" />
      {NAV_LINKS.map((link, i) => (
        <a
          key={link.href}
          href={link.href}
          className={`type-eyebrow whitespace-nowrap transition-colors hover:text-text-primary ${
            i === 0 ? "text-text-primary" : "text-text-secondary"
          }`}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
