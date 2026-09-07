import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/** Logo lockup left; utility links and the theme toggle right. */
export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center gap-x-12 gap-y-4 py-10">
      <div className="flex flex-1 items-center">
        <a href="#" aria-label="Resident home">
          <Logo wordClassName="text-text-primary" />
        </a>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4 sm:gap-6">
        <a href="#" className="type-eyebrow text-brand-primary">
          [Open desk]
        </a>
        <a href="#" className="type-eyebrow text-text-primary">
          Contact
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
