import { Icon } from "@/components/ui/Icon";

/** Figma 4361:40 — token strip left, social row right. */
export function TokenTicker() {
  return (
    <div className="flex flex-col gap-6 border-t border-rule pt-5 pb-xl md:flex-row md:items-center md:gap-12">
      <div className="flex flex-1 items-center gap-6">
        <span className="type-body-sm text-brand-primary">$KRV</span>
        <span aria-hidden className="h-px w-[39px] bg-rule" />
        <span className="type-body-sm text-text-primary">ETH</span>
        <span className="type-body-sm text-text-primary">ERC-20*</span>
      </div>
      <Icon
        name="social-menu"
        width={600}
        height={20}
        fluid
        className="h-5 w-full object-contain object-right"
      />
    </div>
  );
}
