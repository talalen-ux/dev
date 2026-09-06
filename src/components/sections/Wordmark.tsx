import { Logo } from "@/components/ui/Logo";
import { TAGLINE } from "@/content/pinlink";

/** Figma 4373:147 — oversized lockup closing the page, tagline beneath. */
export function Wordmark() {
  return (
    <section className="flex flex-col gap-6 py-xl">
      <Logo className="h-auto w-full max-w-[900px] text-text-primary" />
      <p className="type-body-lg text-text-secondary">{TAGLINE}</p>
    </section>
  );
}
