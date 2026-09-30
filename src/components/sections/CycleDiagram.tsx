import { CYCLE_CAPTION, CYCLE_STEPS } from "@/content/whitepaper";

/**
 * The capital cycle, drawn.
 *
 * Seven boxes and one loop back, because the loop is the whole claim: the
 * retained share funds the next position, so the picture has to close rather
 * than end. /docs draws the same sequence as numbered cards; here it is drawn
 * as a cycle, which is what makes the return arrow visible.
 *
 * The drawing is a fixed 760-unit frame scaled to whatever column it lands in.
 * Below md that column is narrow enough to take the 11.5px body lines under
 * what anyone can read, so the same content is rendered as a list instead and
 * the svg is hidden — not shrunk. Both come off CYCLE_STEPS, so the two cannot
 * drift apart.
 */

/** Where each step's box sits in the 760x492 frame. */
const AT = {
  trade: { cx: 138, y: 76 },
  route: { cx: 380, y: 76 },
  price: { cx: 622, y: 76 },
  open: { cx: 622, y: 252 },
  earn: { cx: 380, y: 252 },
  book: { cx: 138, y: 252 },
  pay: { cx: 138, y: 380 },
} as const;

const W = 216;
const H = 88;

const INK = "var(--color-text-primary)";
const QUIET = "var(--color-text-secondary)";
const EDGE = "var(--color-rule)";
const ACCENT = "var(--color-brand-primary)";
const FILL = "var(--color-brand-fill)";

export function CycleDiagram() {
  return (
    <figure className="flex flex-col gap-3">
      <svg
        viewBox="0 0 760 492"
        role="img"
        aria-label="The capital cycle: a trade on $RES pays a fee, the fee is priced and deployed as a position, what it earns is booked and split, and the retained share funds the next position."
        fontSize="11.5"
        className="hidden h-auto w-full md:block"
      >
        <defs>
          <marker
            id="cycle-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10z" fill={EDGE} />
          </marker>
        </defs>

        <text x="24" y="28" fontSize="15" fontWeight="600" fill={INK}>
          The fee never leaves: it is priced, then deployed
        </text>
        <text x="24" y="48" fontSize="11.5" fill={QUIET}>
          One cycle, from a trade on $RES to a holder payment
        </text>

        {/* Connectors run in the gaps: never across a box, never over a label.
            The return leg rises at x=554 and the forward leg drops at x=690 so
            the two verticals between the rows do not cross. */}
        <g fill="none" stroke={EDGE} strokeWidth="1.25">
          <path d="M246 120H272" markerEnd="url(#cycle-arrow)" />
          <path d="M488 120H514" markerEnd="url(#cycle-arrow)" />
          <path d="M690 164V252" markerEnd="url(#cycle-arrow)" />
          <path d="M514 296H488" markerEnd="url(#cycle-arrow)" />
          <path d="M272 296H246" markerEnd="url(#cycle-arrow)" />
          <path d="M138 252V208H554V164" markerEnd="url(#cycle-arrow)" />
          <path d="M138 340V380" markerEnd="url(#cycle-arrow)" />
        </g>

        {CYCLE_STEPS.map((step) => {
          const at = AT[step.id];
          const accent = step.id === "price";
          const x = at.cx - W / 2;
          return (
            <g key={step.id}>
              <rect
                x={x}
                y={at.y}
                width={W}
                height={H}
                rx="8"
                fill={accent ? FILL : "none"}
                stroke={accent ? ACCENT : EDGE}
                strokeWidth={accent ? 2 : 1.25}
              />
              <text
                x={x + 16}
                y={at.y + 24}
                fontSize="13"
                fontWeight="600"
                fill={INK}
              >
                {step.name}
              </text>
              {step.lines.map((line, i) => (
                <text key={line} x={x + 16} y={at.y + 40 + i * 16} fill={INK}>
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        <text x="346" y="200" textAnchor="middle" fill={QUIET}>
          The retained share stays as working capital
        </text>
        <text x="148" y="364" fill={QUIET}>
          The holders&rsquo; share of realized profit
        </text>
      </svg>

      {/* Same seven steps, for the column the drawing would be illegible in. */}
      <ol className="flex flex-col gap-6 md:hidden">
        {CYCLE_STEPS.map((step, i) => (
          <li key={step.id} className="grid grid-cols-[2.5rem_1fr] gap-4">
            <span className="type-label text-brand-primary tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="type-body-lg text-text-primary">{step.name}</h3>
              <p className="type-body-sm mt-1 text-text-secondary">
                {step.lines.join(" ")}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <figcaption className="type-eyebrow text-text-secondary">
        {CYCLE_CAPTION}
      </figcaption>
    </figure>
  );
}
