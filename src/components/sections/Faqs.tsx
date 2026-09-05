"use client";

import { useState } from "react";

import { SectionLabel } from "@/components/layout/SectionLabel";
import { FAQS } from "@/content/pinlink";

/**
 * Figma 4361:168 — accordion list. The design shows item 3 open with the plus
 * glyph rotated 45deg into a close icon, so that is the default open row.
 */
export function Faqs() {
  const [open, setOpen] = useState<number | null>(2);

  return (
    <section id="faqs" className="border-t border-rule pt-xl pb-xxl">
      <div className="flex flex-col gap-12 lg:flex-row">
        <SectionLabel label="FAQs" className="lg:w-[600px]" />
        <div className="flex flex-1 flex-col">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                className={`flex flex-col ${
                  i < FAQS.length - 1 ? "border-b border-rule" : ""
                } ${i === 0 ? "pb-l" : "py-l"}`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-start justify-between gap-6 text-left"
                >
                  <span className="type-h5 max-w-[500px] text-text-primary">
                    {faq.question}
                  </span>
                  <span
                    aria-hidden
                    className={`relative mt-1 size-5 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                    <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                  </span>
                </button>
                {isOpen && faq.answer ? (
                  <p className="type-body mt-6 text-text-muted">{faq.answer}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
