import Link from "next/link";

import { TokenCta } from "@/components/ui/TokenCta";
import { HERO, STATUS } from "@/content/landing";
import { TOKEN_URL } from "@/lib/site";

/**
 * The first screen, and nothing else on it.
 *
 * One line of display type carries the whole thing: no stat cards, no chart, no
 * product shot. The grid behind it is the only ornament and is barely there.
 *
 * STATUS sits here rather than in the footer on purpose. The headline makes a
 * large claim about ambition, and the fastest way to make a large claim
 * credible is to publish the small position it is being made from — in the same
 * frame, where nobody has to scroll to find it.
 */
export function Hero() {
  return (
    <section className="house-grid pt-16 pb-xxl sm:pt-24">
      <p className="type-eyebrow text-brand-primary">{HERO.eyebrow}</p>

      <h1 className="type-display mt-8 max-w-[16ch] text-text-primary">
        {HERO.headline}
      </h1>

      <div className="mt-14 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <p className="type-body-lg max-w-[54ch] text-text-secondary">{HERO.sub}</p>

        <div className="flex shrink-0 flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="#thesis"
            className="type-eyebrow inline-flex min-h-11 items-center bg-brand-fill px-6 text-on-brand"
          >
            {HERO.cta} →
          </Link>
          {/* Only once there is something to trade. Before then TokenCta
              renders "Launching soon", which the masthead already says — and
              saying it twice in one screen reads as a page with two dead
              buttons rather than one honest state. */}
          {TOKEN_URL ? (
            <TokenCta
              label={`${HERO.secondary} ↗`}
              className="type-eyebrow inline-flex min-h-11 items-center text-brand-primary underline underline-offset-4"
            />
          ) : null}
        </div>
      </div>

      <p className="type-body-sm mt-16 max-w-[72ch] border-l-2 border-brand-primary pl-5 text-text-secondary">
        <span className="type-eyebrow mr-3 text-text-primary">{STATUS.label}</span>
        {STATUS.body}
      </p>
    </section>
  );
}
