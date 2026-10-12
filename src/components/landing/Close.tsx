import Link from "next/link";

import { SectionRule } from "@/components/ui/SectionRule";
import { CLOSE } from "@/content/landing";

/**
 * The closing claim, on the page's own ground rather than a second lime band.
 *
 * The hero already spends the lime. Bracketing the page with it would make the
 * two ends compete, which is the thing the old design is careful not to do —
 * one accent, used once.
 */
export function Close() {
  return (
    <section id="close" className="relative py-xxl">
      <SectionRule delay={-4.3} />
      <h2 className="type-h2 max-w-[640px] text-[28px] text-balance text-text-primary sm:text-[36px]">
        {CLOSE.headline}
      </h2>
      <p className="type-body-lg mt-8 max-w-[620px] text-text-secondary">{CLOSE.body}</p>

      <div className="mt-12 flex flex-wrap items-center gap-6">
        <Link
          href={CLOSE.primary.href}
          className="type-eyebrow bg-brand-fill px-6 py-4 text-on-brand transition-opacity hover:opacity-85"
        >
          {CLOSE.primary.label} →
        </Link>
        <Link
          href={CLOSE.secondary.href}
          className="type-eyebrow inline-flex min-h-11 items-center text-text-secondary underline underline-offset-4 hover:text-text-primary"
        >
          {CLOSE.secondary.label}
        </Link>
      </div>
    </section>
  );
}
