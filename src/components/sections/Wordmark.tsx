import Image from "next/image";

import { TAGLINE } from "@/content/pinlink";

/** Figma 4373:147 — oversized lockup closing the page, tagline beneath. */
export function Wordmark() {
  return (
    <section className="flex flex-col gap-6 py-xl">
      <Image
        src="/assets/pinlink-lockup.svg"
        alt="PinLink"
        width={152}
        height={37}
        className="h-auto w-full max-w-[900px]"
      />
      <p className="type-body-lg text-text-secondary">{TAGLINE}</p>
    </section>
  );
}
