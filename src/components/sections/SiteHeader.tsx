import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/** Figma 4361:22 — logo lockup left, utility links + theme toggle right. */
export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center gap-x-12 gap-y-4 py-10">
      <div className="flex flex-1 items-center">
        <a href="#" className="flex items-center gap-[14px]" aria-label="PinLink home">
          <Logo markOnly className="size-9" />
          <span className="text-[29.454px] leading-none font-semibold tracking-[-0.5891px] text-text-primary">
            PinLink
          </span>
        </a>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4 sm:gap-6">
        <a href="#" className="type-eyebrow text-brand-primary">
          [Connect dApp]
        </a>
        <a href="#" className="type-eyebrow text-text-primary">
          Contact
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
