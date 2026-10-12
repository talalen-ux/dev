import Link from "next/link";

import { SectionRule } from "@/components/ui/SectionRule";
import { OPPORTUNITY, POSITIONS } from "@/content/landing";

/**
 * The size of the thing, and then the size of the book.
 *
 * Adjacent on purpose: the largest claim on the page sits directly above an
 * empty table. A reader takes in the shape of this business in one scroll —
 * large ambition, nothing deployed — which is the impression it should leave.
 */
export function Opportunity() {
  return (
    <section id="opportunity" className="relative py-xxl">
      <SectionRule delay={-5.1} />
      <h2 className="type-h2 max-w-[720px] text-[28px] text-balance text-text-primary sm:text-[36px]">
        {OPPORTUNITY.headline}
      </h2>
      <p className="type-h3 mt-6 max-w-[520px] text-text-secondary">
        {OPPORTUNITY.standfirst}
      </p>

      <div className="mt-12 flex flex-col gap-6">
        {OPPORTUNITY.body.map((paragraph) => (
          <p key={paragraph} className="type-body-lg max-w-[720px] text-text-secondary">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="hover-lime-item mt-16 flex flex-col gap-4 border-t-4 border-brand-fill bg-bg-primary p-8 lg:flex-row lg:gap-12">
        <h3 className="type-label shrink-0 text-brand-primary lg:w-[276px]">
          {POSITIONS.eyebrow}
        </h3>
        <div className="flex-1">
          <p className="type-h3 max-w-[480px] text-text-primary">{POSITIONS.headline}</p>
          <p className="type-body mt-4 max-w-[640px] text-text-secondary">
            {POSITIONS.body}
          </p>
          <p className="type-body mt-6">
            <Link
              href={POSITIONS.link.href}
              className="text-brand-primary underline underline-offset-4"
            >
              {POSITIONS.link.label} →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
