/**
 * Figma 4373:123 — copyright left, "Follow along" plus the :: glyph right.
 * Layout inferred from layer metadata; design context for this row was not
 * retrieved (see ASSETS.md).
 */
export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-6 border-t border-rule py-10 md:flex-row md:items-center md:justify-between">
      <p className="type-eyebrow text-text-secondary">
        ©2025 – All Rights Reserved.
      </p>
      <div className="flex items-center gap-6">
        <span className="type-eyebrow text-text-secondary">Follow along</span>
        <span className="type-eyebrow text-brand-primary">::</span>
      </div>
    </footer>
  );
}
