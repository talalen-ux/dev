import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { HeroBand } from "@/components/layout/HeroBand";
import { CycleDiagram } from "@/components/sections/CycleDiagram";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { Formula } from "@/components/ui/Formula";
import { SectionRule } from "@/components/ui/SectionRule";
import {
  type Block,
  CONSTRUCTION,
  CONSTRUCTION_TITLE,
  CUSTODY_GUARANTEES,
  CUSTODY_INTRO,
  CUSTODY_KEY_NOTE,
  CUSTODY_TITLE,
  CYCLE_CLOSING,
  CYCLE_TITLE,
  DISTRIBUTION_CADENCE,
  DISTRIBUTION_HOLDERS,
  DISTRIBUTION_TITLE,
  DISTRIBUTION_WHAT,
  HERO_HEADLINE,
  HERO_NOTE,
  HERO_STANDFIRST,
  NAV_LINKS,
  PARAMETERS_INTRO,
  PARAMETERS_NOTE,
  PARAMETERS_TITLE,
  PARAMETER_GROUPS,
  PRICING,
  PRICING_TITLE,
  PROBLEM,
  PROBLEM_TITLE,
  PROCEDURE_CLOSING,
  PROCEDURE_GUARD,
  PROCEDURE_INTRO,
  PROCEDURE_RULES,
  PROCEDURE_TITLE,
  RISK_MODEL,
  RISK_OPERATIONAL,
  RISK_TITLE,
  RISK_UNMITIGATED,
  RISK_UNMITIGATED_INTRO,
  RISK_UNMITIGATED_TITLE,
  STATUS_ABSENT,
  STATUS_BUILT,
  STATUS_BUILT_NOTE,
  STATUS_CLOSING,
  STATUS_INTRO,
  STATUS_NEXT,
  STATUS_NEXT_TITLE,
  STATUS_PROVEN,
  STATUS_TITLE,
} from "@/content/whitepaper";

export const metadata = {
  title: "Whitepaper",
  description:
    "The formal statement of the Resident protocol: how a position's fee income is priced against the cost of the price moving, how range width and size are derived, the ordered rules the keeper applies each interval, the custody model, every operating parameter, and an unsoftened account of what is proven, what is merely built, and what does not exist.",
};

/** A section heading with its eyebrow, matching /holders. */
function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <p className="type-eyebrow text-text-secondary">{eyebrow}</p>
      <h2 className="type-h2 mt-4 max-w-[24ch] text-balance">{title}</h2>
    </>
  );
}

/** Prose with sub-headings and display expressions in argument order. */
function Prose({ blocks }: { blocks: readonly Block[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block) => {
        if (block.kind === "h") {
          return (
            <h3 key={block.text} className="type-h5 mt-5 text-text-primary first:mt-0">
              {block.text}
            </h3>
          );
        }
        if (block.kind === "formula") {
          return (
            <Formula
              key={block.expr}
              expr={block.expr}
              caption={block.caption}
              className="my-1"
            />
          );
        }
        return (
          <p key={block.text} className="type-body max-w-[62ch] text-text-secondary">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

/** A side-headed section: heading in the left rail, body beside it. */
function Split({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-10 md:flex-row md:gap-16">
      <div className="md:w-[320px] md:shrink-0">
        <Heading eyebrow={eyebrow} title={title} />
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** A named list of claims, used for the three status registers. */
function Register({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h3 className="type-h5 text-text-primary">{title}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item}
            className="type-body max-w-[68ch] border-l-2 border-rule pl-5 text-text-secondary"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The whitepaper.
 *
 * /docs is the mechanism in plain words and /holders is the consequence. This
 * is the argument: the algebra, the ordered procedure, every constant, and the
 * status register. It carries no performance figure anywhere, which is not an
 * oversight — see the open item in the risk section.
 */
export default function WhitepaperPage() {
  return (
    <Container>
      <SiteHeader />

      <HeroBand>
        <Link
          href="/"
          className="type-eyebrow inline-flex min-h-11 items-center text-on-brand/70 hover:text-on-brand"
        >
          ← Back
        </Link>
        <h1 className="type-h1 mt-8 max-w-[900px] text-[32px] leading-[36px] text-balance sm:text-[40px] sm:leading-[43px] lg:text-[48px] lg:leading-[51px]">
          {HERO_HEADLINE}
        </h1>
        <div className="mt-12 flex flex-col gap-6 md:flex-row md:gap-12">
          <p className="type-body-lg flex-1">{HERO_STANDFIRST}</p>
          <p className="type-body text-on-brand/70 md:w-[276px]">{HERO_NOTE}</p>
        </div>
      </HeroBand>

      <nav className="relative flex items-center gap-6 overflow-x-auto py-5">
        <SectionRule delay={-2.1} />
        <span aria-hidden className="type-label text-brand-primary">
          ./
        </span>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="type-eyebrow inline-flex min-h-11 items-center whitespace-nowrap text-text-secondary transition-colors hover:text-text-primary"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <section id="problem" className="py-xxl">
        <Split eyebrow="The problem" title={PROBLEM_TITLE}>
          <Prose blocks={PROBLEM} />
        </Split>
      </section>

      <SectionRule delay={-2} />

      <section id="cycle" className="py-xxl">
        <Heading eyebrow="The cycle" title={CYCLE_TITLE} />
        <div className="mt-10">
          <CycleDiagram />
        </div>
        <p className="type-body-lg mt-10 max-w-[68ch] text-text-primary">
          {CYCLE_CLOSING}
        </p>
      </section>

      <SectionRule delay={-4} />

      <section id="pricing" className="py-xxl">
        <Split eyebrow="Pricing a position" title={PRICING_TITLE}>
          <Prose blocks={PRICING} />
        </Split>
      </section>

      <SectionRule delay={-6} />

      <section id="construction" className="py-xxl">
        <Split eyebrow="Building a position" title={CONSTRUCTION_TITLE}>
          <Prose blocks={CONSTRUCTION} />
        </Split>
      </section>

      <SectionRule delay={-8} />

      {/* The rules are numbered because the order is load-bearing: each one can
          claim a position so nothing below it acts on the same one. */}
      <section id="procedure" className="py-xxl">
        <Heading eyebrow="The decision procedure" title={PROCEDURE_TITLE} />
        <p className="type-body-lg mt-6 max-w-[68ch] text-text-secondary">
          {PROCEDURE_INTRO}
        </p>
        <p className="type-body mt-5 max-w-[68ch] text-text-secondary">
          {PROCEDURE_GUARD}
        </p>
        <ol className="mt-12 flex flex-col gap-8">
          {PROCEDURE_RULES.map((rule) => (
            <li key={rule.n} className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-8">
              <span className="type-label text-brand-primary tabular-nums">
                {rule.n}
              </span>
              <div>
                <h3 className="type-body-lg text-text-primary">{rule.name}</h3>
                <p className="type-body mt-2 max-w-[62ch] text-text-secondary">
                  {rule.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="type-body-lg mt-12 max-w-[68ch] text-text-primary">
          {PROCEDURE_CLOSING}
        </p>
      </section>

      <SectionRule delay={-10} />

      <section id="custody" className="py-xxl">
        <Split eyebrow="Custody" title={CUSTODY_TITLE}>
          <Prose blocks={CUSTODY_INTRO} />
        </Split>
        <dl className="mt-16 grid gap-10 sm:grid-cols-2 sm:gap-x-12">
          {CUSTODY_GUARANTEES.map((item) => (
            <div key={item.what}>
              <dt className="type-body-lg text-text-primary">{item.what}</dt>
              <dd className="type-body mt-2 text-text-secondary">{item.body}</dd>
            </div>
          ))}
        </dl>
        <p className="type-body mt-12 max-w-[68ch] border-l-2 border-brand-primary pl-5 text-text-primary">
          {CUSTODY_KEY_NOTE}
        </p>
      </section>

      <SectionRule delay={-12} />

      <section id="distributions" className="py-xxl">
        <Split eyebrow="Distributions" title={DISTRIBUTION_TITLE}>
          <Prose blocks={DISTRIBUTION_WHAT} />
        </Split>
        <div className="mt-16">
          <Split eyebrow="Cadence" title="Set by the payout, not by a clock">
            <Prose blocks={DISTRIBUTION_CADENCE} />
          </Split>
        </div>
        <div className="mt-16">
          <Split eyebrow="Eligibility" title="Rebuilt from the chain's own record">
            <Prose blocks={DISTRIBUTION_HOLDERS} />
          </Split>
        </div>
      </section>

      <SectionRule delay={-14} />

      <section id="parameters" className="py-xxl">
        <Heading eyebrow="Parameters" title={PARAMETERS_TITLE} />
        <p className="type-body-lg mt-6 max-w-[68ch] text-text-secondary">
          {PARAMETERS_INTRO}
        </p>
        {/* Held to a readable measure: across the full container the label and
            its value end up a hand's width apart and rows stop tracking. */}
        <div className="mt-12 flex max-w-[760px] flex-col gap-12">
          {PARAMETER_GROUPS.map((group) => (
            <div key={group.group}>
              <h3 className="type-eyebrow text-text-primary">{group.group}</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <tbody>
                    {group.rows.map((row) => (
                      <tr key={row.meaning} className="border-b border-rule">
                        <td className="type-body-sm py-3 pr-6 align-top text-text-secondary">
                          {row.meaning}
                        </td>
                        <td className="type-body-sm w-[1%] whitespace-nowrap py-3 text-right align-top text-text-primary tabular-nums">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <p className="type-body mt-12 max-w-[68ch] text-text-secondary">
          {PARAMETERS_NOTE}
        </p>
      </section>

      <SectionRule delay={-16} />

      {/* Same visual weight as everything above it. A risk section set smaller
          than the mechanism is a risk section nobody reads. */}
      <section id="risk" className="py-xxl">
        <Split eyebrow="Risk" title={RISK_TITLE}>
          <Prose blocks={RISK_MODEL} />
        </Split>
        <div className="mt-16">
          <Split eyebrow="Operations" title="Reconstructed, not given">
            <Prose blocks={RISK_OPERATIONAL} />
          </Split>
        </div>
        <div className="mt-16">
          <Heading eyebrow="Unmitigated" title={RISK_UNMITIGATED_TITLE} />
          <p className="type-body-lg mt-6 max-w-[68ch] text-text-secondary">
            {RISK_UNMITIGATED_INTRO}
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-x-12">
            {RISK_UNMITIGATED.map((item) => (
              <div key={item.risk}>
                <h3 className="type-body-lg text-text-primary">{item.risk}</h3>
                <p className="type-body mt-2 text-text-secondary">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionRule delay={-18} />

      <section id="status" className="py-xxl">
        <Heading eyebrow="Status" title={STATUS_TITLE} />
        <p className="type-body-lg mt-6 max-w-[68ch] text-text-secondary">
          {STATUS_INTRO}
        </p>
        <div className="mt-12 flex flex-col gap-12">
          <Register title="Proven" items={STATUS_PROVEN} />
          <div>
            <Register title="Built, never exercised" items={STATUS_BUILT} />
            <p className="type-body-sm mt-4 max-w-[68ch] text-text-secondary">
              {STATUS_BUILT_NOTE}
            </p>
          </div>
          <Register title="Not built" items={STATUS_ABSENT} />
        </div>

        <div className="mt-16">
          <h3 className="type-h5 text-text-primary">{STATUS_NEXT_TITLE}</h3>
          <ol className="mt-6 flex flex-col gap-5">
            {STATUS_NEXT.map((step, i) => (
              <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="type-label text-brand-primary tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="type-body max-w-[62ch] text-text-secondary">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="type-body-lg mt-12 max-w-[68ch] text-text-primary">
          {STATUS_CLOSING}
        </p>

        <p className="type-body mt-10">
          <Link href="/docs" className="text-brand-primary underline underline-offset-4">
            The same mechanism in plain words
          </Link>
          <span className="text-text-secondary"> · </span>
          <Link href="/holders" className="text-brand-primary underline underline-offset-4">
            What it means if you hold the token
          </Link>
        </p>
      </section>

      <SiteFooter />
    </Container>
  );
}
