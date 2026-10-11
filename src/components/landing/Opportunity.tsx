import Link from "next/link";

import { SectionRule } from "@/components/ui/SectionRule";
import { OPPORTUNITY, POSITIONS } from "@/content/landing";

/**
 * The size of the thing, and then the size of the book.
 *
 * The two halves are deliberately adjacent. The first is the largest claim on
 * the page; the second is an empty table. A reader who sees them together
 * learns the shape of this business in one scroll — large ambition, nothing
 * deployed — and that is the impression the page wants to leave.
 */
export function Opportunity() {
  return (
    <>
      <SectionRule inFlow delay={-6} />
      <section id="opportunity" className="py-xxl">
        <p className="type-eyebrow text-text-secondary">{OPPORTUNITY.eyebrow}</p>
        <h2 className="type-h2 mt-4 max-w-[20ch] text-balance">
          {OPPORTUNITY.headline}
        </h2>
        <p className="type-h3 mt-4 max-w-[24ch] text-text-secondary">
          {OPPORTUNITY.standfirst}
        </p>

        <div className="mt-12 flex flex-col gap-6">
          {OPPORTUNITY.body.map((paragraph) => (
            <p key={paragraph} className="type-body-lg max-w-[58ch] text-text-secondary">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-20 border-t-4 border-brand-fill pt-10">
          <p className="type-eyebrow text-text-secondary">{POSITIONS.eyebrow}</p>
          <h3 className="type-h2 mt-4 max-w-[18ch] text-balance">
            {POSITIONS.headline}
          </h3>
          <p className="type-body mt-6 max-w-[62ch] text-text-secondary">
            {POSITIONS.body}
          </p>
          <p className="type-body mt-8">
            <Link
              href={POSITIONS.link.href}
              className="text-brand-primary underline underline-offset-4"
            >
              {POSITIONS.link.label} →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
