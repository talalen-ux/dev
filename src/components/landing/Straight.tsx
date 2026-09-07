import Link from "next/link";

import { FAQS } from "@/content/landing";

/**
 * Straight answers. Open by default — these are the questions someone should
 * read before buying, so they are not hidden behind a click.
 */
export function Straight() {
  return (
    <section id="risk" className="border-t border-rule py-xxl">
      <h2 className="type-h2 text-[28px] text-balance text-text-primary sm:text-[36px]">
        Straight answers
      </h2>

      <div className="mt-12 flex flex-col">
        {FAQS.map((faq, i) => (
          <div
            key={faq.q}
            className={`flex flex-col gap-4 py-8 md:flex-row md:gap-12 ${
              i < FAQS.length - 1 ? "border-b border-rule" : ""
            }`}
          >
            <h3 className="type-h3 shrink-0 text-text-primary md:w-[320px]">
              {faq.q}
            </h3>
            <p className="type-body max-w-[620px] flex-1 text-text-secondary">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <p className="type-body-sm mt-10 text-text-secondary">
        Everything above is spelled out in full, with the numbers, in{" "}
        <Link href="/method" className="text-brand-primary underline underline-offset-4">
          the method
        </Link>
        .
      </p>
    </section>
  );
}
