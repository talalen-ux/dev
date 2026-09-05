"use client";

import { useEffect, useState } from "react";

/**
 * Figma 4361:477 — a 40x22 pill with a 16px knob. The design ships both a dark
 * and a light frame; the knob sits right in dark mode.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setIsDark((v) => !v)}
      className="relative h-[22px] w-10 shrink-0 cursor-pointer rounded-[30px] border border-brand-primary"
    >
      <span
        className="absolute top-[2px] size-4 rounded-[30px] bg-brand-primary transition-[left] duration-200"
        style={{ left: isDark ? 19 : 3 }}
      />
    </button>
  );
}
