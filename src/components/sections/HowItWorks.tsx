import Image from "next/image";

/**
 * Figma 4436:490 (label) + 4454:309 (diagram) — the protocol flow between DePIN
 * asset owners, PinLink, service users and passive-income holders.
 */
export function HowItWorks() {
  return (
    <section className="border-t border-rule">
      <div className="flex items-center gap-6 py-5">
        <span className="type-eyebrow text-brand-primary">./</span>
        <span className="type-eyebrow text-text-primary">How pinlink works</span>
      </div>
      <div className="relative aspect-[1248/640] w-full">
        <Image
          src="/assets/how-it-works.svg"
          alt="PinLink protocol flow: DePIN asset owners mint an RWA ERC-1155, service users pay rental fees into the contract, and passive income seekers buy fractional shares that fund a service user rebate."
          fill
          sizes="(max-width: 1440px) 100vw, 1248px"
          className="object-contain"
        />
      </div>
    </section>
  );
}
