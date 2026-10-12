import Link from "next/link";

import { HeroBand } from "@/components/layout/HeroBand";
import { TokenCta } from "@/components/ui/TokenCta";
import { HERO, STATUS } from "@/content/landing";
import { TOKEN_URL } from "@/lib/site";

/**
 * The lime band: one claim, one paragraph, and where the House actually is.
 *
 * STATUS takes the slot the figures used to sit in, on the band's own rule.
 * There are no figures worth that slot yet — the only true ones are zero — and
 * the status is the thing a reader most needs in the first screen anyway.
 */
export function Hero() {
  return (
    <HeroBand>
      <p className="type-eyebrow text-on-brand/70">{HERO.eyebrow}</p>

      <h1 className="mt-8 max-w-[900px] text-[40px] leading-[1.02] font-medium tracking-[-0.02em] text-balance sm:text-[64px] lg:text-[80px]">
        {HERO.headline}
      </h1>

      <p className="type-body-lg mt-10 max-w-[620px]">{HERO.sub}</p>

      <div className="mt-14 border-t border-rule pt-8">
        <p className="type-eyebrow text-on-brand">{STATUS.label}</p>
        <p className="type-body mt-3 max-w-[640px] text-on-brand/70">{STATUS.body}</p>
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-6">
        <Link
          href="#thesis"
          className="type-eyebrow bg-on-brand px-6 py-4 text-brand-fill transition-opacity hover:opacity-85"
        >
          {HERO.cta} →
        </Link>
        {/* Only once there is something to trade — the masthead already carries
            the "Launching soon" state, and twice in one screen reads as two
            dead buttons rather than one honest one. */}
        {TOKEN_URL ? (
          <TokenCta
            label={`${HERO.secondary} ↗`}
            className="type-eyebrow inline-flex min-h-11 items-center text-on-brand/70 underline underline-offset-4 hover:text-on-brand"
          />
        ) : null}
      </div>
    </HeroBand>
  );
}
