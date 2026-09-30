import { cn } from "@/lib/cn";

/**
 * A display expression. Set in the mono face on the raised surface, and allowed
 * to scroll inside its own box so a long expression never widens the page.
 *
 * `whitespace-pre` rather than `nowrap`: an expression whose two halves are
 * aligned by spaces loses that alignment under nowrap, and a `\n` in `expr`
 * is a deliberate line break rather than an accident.
 */
export function Formula({
  expr,
  caption,
  className,
}: {
  expr: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <div className="overflow-x-auto border-l-2 border-brand-primary bg-bg-secondary px-6 py-5">
        <code className="type-label block whitespace-pre text-[15px] normal-case text-text-primary">
          {expr}
        </code>
      </div>
      {caption ? (
        <figcaption className="type-eyebrow text-text-secondary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
