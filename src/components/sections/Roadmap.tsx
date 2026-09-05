import { ROADMAP } from "@/content/pinlink";

/** Figma 4361:135 — a raised card on bg-secondary, one column per phase. */
export function Roadmap() {
  return (
    <section
      id="roadmap"
      className="flex flex-col gap-16 bg-bg-secondary px-6 pt-xl pb-xxl md:px-xl lg:gap-xxl"
    >
      <h2 className="type-h3 text-text-primary">Roadmap</h2>
      <div className="flex flex-col gap-12 md:flex-row">
        {ROADMAP.map((phase) => (
          <div key={phase.phase} className="flex flex-1 gap-4 md:pr-xl">
            <span
              aria-hidden
              className="mt-[5px] h-3 w-[6px] shrink-0 bg-brand-primary"
            />
            <div className="flex flex-col gap-6">
              <h3 className="type-label">
                <span className="text-brand-primary">{phase.phase} </span>
                <span className="text-text-secondary">{phase.window}</span>
                <span className="block text-text-primary">{phase.title}</span>
              </h3>
              <p className="type-body text-text-muted">{phase.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
