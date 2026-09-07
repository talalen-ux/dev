import { Formula } from "@/components/ui/Formula";
import { METHOD } from "@/content/resident";

/** The method, argued in order. Each step keeps its own anchor. */
export function Method() {
  return (
    <>
      {METHOD.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="border-t border-rule py-xxl"
        >
          <div className="flex flex-col gap-12 lg:flex-row">
            <div className="flex shrink-0 items-start gap-6 lg:w-[276px]">
              <span className="type-label text-brand-primary tabular-nums">
                {section.n}
              </span>
              <h2 className="type-label text-text-primary">{section.title}</h2>
            </div>

            <div className="flex flex-1 flex-col gap-8 lg:pr-xl">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="type-body text-text-secondary">
                  {paragraph}
                </p>
              ))}

              {"pull" in section && section.pull ? (
                <p className="type-h3 border-l-2 border-brand-primary pl-6 text-text-primary">
                  {section.pull}
                </p>
              ) : null}

              {"formula" in section && section.formula ? (
                <Formula
                  expr={section.formula.expr}
                  caption={section.formula.caption}
                />
              ) : null}

              {"sub" in section && section.sub ? (
                <div className="flex flex-col gap-3 border-t border-rule pt-8">
                  <h3 className="type-eyebrow text-text-primary">
                    {section.sub.title}
                  </h3>
                  <p className="type-body text-text-secondary">
                    {section.sub.body}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
