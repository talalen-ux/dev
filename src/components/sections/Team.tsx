import { SectionLabel } from "@/components/layout/SectionLabel";
import { TEAM } from "@/content/pinlink";

/**
 * Figma 4371:55 — label column plus member cards, each name carrying an [X]
 * link. The frame is 956px tall for six members, roughly half the height of the
 * hidden single-column variant (4361:497), hence the two-column grid.
 */
export function Team() {
  return (
    <section id="team" className="border-t border-rule py-xxl">
      <div className="flex flex-col gap-12 lg:flex-row">
        <SectionLabel
          label="Team"
          labelClassName="type-label"
          className="lg:w-[276px]"
        />
        <div className="grid flex-1 grid-cols-1 gap-x-12 gap-y-xl md:grid-cols-2">
          {TEAM.map((member) => (
            <div key={member.name} className="flex flex-col gap-6">
              <h3 className="type-eyebrow text-text-primary">
                {member.name}
                <a
                  href="#"
                  className="ml-2 text-brand-primary"
                  aria-label={`${member.name} on X`}
                >
                  [X]
                </a>
                <span className="mt-1 block text-text-secondary">
                  {member.role}
                </span>
              </h3>
              <p className="type-body text-text-secondary">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
