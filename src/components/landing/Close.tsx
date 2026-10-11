import Link from "next/link";

import { CLOSE } from "@/content/landing";

/**
 * The closing claim.
 *
 * The brief's line was "The House is open." It is not, so this says what is
 * true and is the stronger position anyway: the books were published before the
 * first dollar moved, and a reader can check them right now. Both calls to
 * action lead to documents rather than to a buy button, which is the point.
 */
export function Close() {
  return (
    <section className="-mx-6 bg-brand-fill px-6 py-xxl text-on-brand md:-mx-12 md:px-12 min-[1440px]:-mx-24 min-[1440px]:px-24">
      <p className="type-eyebrow text-on-brand/70">{CLOSE.eyebrow}</p>
      <h2 className="type-h1 mt-6 max-w-[20ch] text-balance text-[32px] leading-[36px] sm:text-[40px] sm:leading-[43px] lg:text-[48px] lg:leading-[51px]">
        {CLOSE.headline}
      </h2>
      <p className="type-body-lg mt-8 max-w-[54ch]">{CLOSE.body}</p>
      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link
          href={CLOSE.primary.href}
          className="type-eyebrow inline-flex min-h-11 items-center bg-on-brand px-6 text-brand-fill"
        >
          {CLOSE.primary.label} →
        </Link>
        <Link
          href={CLOSE.secondary.href}
          className="type-eyebrow inline-flex min-h-11 items-center text-on-brand underline underline-offset-4"
        >
          {CLOSE.secondary.label}
        </Link>
      </div>
    </section>
  );
}
