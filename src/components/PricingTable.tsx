import { usd } from "@/lib/format";
import type { PricingTier } from "@/types/travel";

export function PricingTable({ tiers }: { tiers: PricingTier[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">Per-person pricing by group size</caption>
        <thead className="bg-sand/70 text-xs uppercase tracking-[0.12em] text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Group</th>
            <th className="px-4 py-3 font-medium">Per person</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Per day</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier) => {
            const total = tier.pricePerPersonUsd * tier.travellers;
            const perDay = Math.round(tier.pricePerPersonUsd / tier.days);
            return (
              <tr key={tier.id} className="border-t border-line">
                <td className="px-4 py-3 text-ink">{tier.label}</td>
                <td className="px-4 py-3 text-ink">
                  {usd.format(tier.pricePerPersonUsd)}
                </td>
                <td className="px-4 py-3 text-ink">{usd.format(total)}</td>
                <td className="px-4 py-3 text-muted">{usd.format(perDay)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
