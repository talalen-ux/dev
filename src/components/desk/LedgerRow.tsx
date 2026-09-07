import { Stat } from "@/components/desk/Panel";
import type { LedgerState, VaultState } from "@/lib/desk";
import { usd } from "@/lib/desk";

/**
 * The ledger identity, laid out as the identity: realized, less the reserve,
 * less what has been paid, leaves what is owed.
 */
export function LedgerRow({
  ledger,
  vault,
}: {
  ledger: LedgerState;
  vault: VaultState;
}) {
  const dp = vault.payoutAsset.decimals;
  const payable = ledger.owed < ledger.cash ? ledger.owed : ledger.cash;
  const capped = ledger.owed > ledger.cash;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <Stat label="Realized  Π" value={usd(ledger.realized, dp)} note="lifetime, monotonic" />
        <Stat label="Reserve  R (25%)" value={usd(ledger.reserved, dp)} note="absorbs pool losses" />
        <Stat label="Distributed  D" value={usd(ledger.distributed, dp)} note="lifetime paid out" />
        <Stat
          label="Owed  O = Π − R − D"
          value={usd(ledger.owed, dp)}
          note="carries forward, never resets"
          emphasis
        />
      </div>

      <div className="grid grid-cols-1 gap-6 border-t border-rule pt-6 sm:grid-cols-3">
        <Stat label="Vault cash" value={usd(ledger.cash, dp)} note={vault.payoutAsset.symbol} />
        <Stat
          label="Payable now"
          value={usd(payable, dp)}
          note={capped ? "capped by cash, not by owed" : "fully covered by cash"}
        />
        <Stat
          label="Rate limit remaining"
          value={usd(ledger.rateLimitRemaining, dp)}
          note="rolling 24h window"
        />
      </div>
    </div>
  );
}
