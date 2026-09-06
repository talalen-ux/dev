"use client";

import { useEffect, useState } from "react";

/**
 * Figma 4361:477 — a 40x22 pill with a 16px knob. The page now opens on the
 * pastel-orange ground, so the toggle rests left and switches to the original
 * near-black palette.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

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
