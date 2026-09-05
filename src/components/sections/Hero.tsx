import Image from "next/image";

import { HERO_HEADLINE } from "@/content/pinlink";

/**
 * Figma 4361:48 — headline over a half-opacity GPU render bleeding off the
 * bottom of the section. The 8px accent rule above it opens the page.
 */
export function Hero() {
  return (
    <section
      id="about"
      className="relative border-t-8 border-rule pt-11 pb-[220px] lg:pb-[340px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-[180px] -z-10 h-[300px] opacity-50 lg:top-[336px] lg:h-[503px]">
        <Image
          src="/assets/hero-gpu.svg"
          alt=""
          fill
          sizes="(max-width: 1440px) 100vw, 1248px"
          className="object-cover object-top"
          priority
        />
      </div>
      <h1 className="type-h1 max-w-[816px] text-[32px] leading-[36px] text-text-primary sm:text-[40px] sm:leading-[43px] lg:text-[48px] lg:leading-[51px]">
        {HERO_HEADLINE}
      </h1>
    </section>
  );
}
