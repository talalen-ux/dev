import Link from "next/link";

import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/** Logo lockup left; utility links and the theme toggle right. */
export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center gap-x-12 gap-y-4 py-10">
      <div className="flex flex-1 items-center">
        <Link href="/" aria-label="Resident home">
          <Logo wordClassName="text-text-primary" />
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4 sm:gap-6">
        <Link href="/positions" className="type-eyebrow text-text-secondary hover:text-text-primary">
          Positions
        </Link>
        <Link href="/method" className="type-eyebrow text-text-secondary hover:text-text-primary">
          Method
        </Link>
        <a href="#" className="type-eyebrow text-brand-primary">
          Get $RES
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
