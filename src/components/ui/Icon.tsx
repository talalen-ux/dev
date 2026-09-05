import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * Renders an icon exported from Figma.
 *
 * By default both axes are pinned to the designed pixel size so the artwork
 * keeps its intended geometry. Pass `fluid` for the few assets that are allowed
 * to scale down with the viewport (the social row), where the designed size
 * acts as a max rather than a fixed box.
 */
export function Icon({
  name,
  size,
  width,
  height,
  fluid = false,
  className,
  alt = "",
}: {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  fluid?: boolean;
  className?: string;
  alt?: string;
}) {
  const w = width ?? size ?? 16;
  const h = height ?? size ?? 16;
  return (
    <Image
      src={`/assets/icons/${name}.svg`}
      alt={alt}
      width={w}
      height={h}
      className={cn("block shrink-0", className)}
      style={fluid ? { maxWidth: w, height: h } : { width: w, height: h }}
      aria-hidden={alt === "" ? true : undefined}
    />
  );
}
