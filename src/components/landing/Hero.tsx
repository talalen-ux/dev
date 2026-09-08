import Link from "next/link";

import { HERO, HERO_STATS } from "@/content/landing";

/** One definitional claim, one paragraph, three figures. */
export function Hero() {
  return (
    <section className="border-t-8 border-brand-fill pt-14 pb-xxl">
      <h1 className="max-w-[900px] text-[40px] leading-[1.02] font-medium tracking-[-0.02em] text-balance text-text-primary sm:text-[64px] lg:text-[80px]">
        {HERO.headline}
      </h1>

      <p className="type-body-lg mt-10 max-w-[620px] text-text-primary">
        {HERO.sub}
      </p>

      <div className="mt-14 flex flex-wrap gap-x-16 gap-y-8 border-t border-rule pt-8">
        {HERO_STATS.map((s) => (
          <div key={s.label} className="flex flex-col gap-1.5">
            <span className="text-[36px] leading-none font-medium tracking-[-0.02em] text-text-primary tabular-nums">
              {s.value}
            </span>
            <span className="type-eyebrow text-text-secondary">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-6">
        <a
          href="#"
          className="type-eyebrow bg-brand-fill px-6 py-4 text-on-brand transition-opacity hover:opacity-85"
        >
          {HERO.cta}
        </a>
        <Link href="/method" className="type-eyebrow text-text-secondary underline underline-offset-4 hover:text-text-primary">
          {HERO.secondary}
        </Link>
      </div>
    </section>
  );
}
