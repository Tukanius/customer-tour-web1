"use client";

import { useState } from "react";
import {
  included,
  itineraryDays,
  notIncluded,
  pricingTiers,
} from "@/data/tours";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ItineraryAndPricing() {
  const [openDays, setOpenDays] = useState<number[]>([1]);

  function toggleDay(day: number) {
    setOpenDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day],
    );
  }

  return (
    <section id="itinerary" className="scroll-mt-24 border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          Sample 7-day Gobi
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Days you can expand. Prices that drop as the group grows.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <h3 className="font-display text-2xl text-ink">Itinerary</h3>
            <ul className="mt-4 space-y-3">
              {itineraryDays.map((day) => {
                const open = openDays.includes(day.day);
                const panelId = `day-panel-${day.day}`;
                return (
                  <li
                    key={day.day}
                    className="overflow-hidden rounded-2xl border border-line bg-sand/30"
                  >
                    <button
                      type="button"
                      className="flex w-full items-start gap-3 px-4 py-4 text-left sm:px-5"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => toggleDay(day.day)}
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                        {day.day}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-lg text-ink sm:text-xl">
                          {day.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted">
                          {day.route}
                        </span>
                      </span>
                      <span className="mt-1 text-muted" aria-hidden="true">
                        {open ? "–" : "+"}
                      </span>
                    </button>
                    {open ? (
                      <div
                        id={panelId}
                        className="border-t border-line px-4 pb-5 pt-3 text-sm leading-6 text-muted sm:px-5"
                      >
                        <p>{day.description}</p>
                        <p className="mt-3 text-ink">
                          Overnight: {day.overnight}
                        </p>
                        <p className="mt-2 flex flex-wrap gap-1.5">
                          {day.meals.map((meal) => (
                            <span
                              key={meal}
                              className="rounded-full border border-line bg-paper px-2.5 py-1 text-xs text-ink"
                            >
                              {meal}
                            </span>
                          ))}
                        </p>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-2xl text-ink">Per-person pricing</h3>
            <p className="mt-2 text-sm text-muted">
              Sample Gobi prices in USD. Private vehicle, camps, and guiding
              included. Final quotes follow the trip request.
            </p>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
              <table className="min-w-full text-left text-sm">
                <caption className="sr-only">
                  Per-person Gobi expedition pricing by group size
                </caption>
                <thead className="bg-sand/70 text-xs uppercase tracking-[0.12em] text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Group</th>
                    <th className="px-4 py-3 font-medium">Per person</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Per day</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingTiers.map((tier) => {
                    const total = tier.pricePerPersonUsd * tier.travellers;
                    const perDay = Math.round(tier.pricePerPersonUsd / tier.days);
                    return (
                      <tr key={tier.id} className="border-t border-line">
                        <td className="px-4 py-3 text-ink">{tier.label}</td>
                        <td className="px-4 py-3 text-ink">
                          {usd.format(tier.pricePerPersonUsd)}
                        </td>
                        <td className="px-4 py-3 text-ink">{usd.format(total)}</td>
                        <td className="px-4 py-3 text-muted">
                          {usd.format(perDay)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <ListCard title="Included" items={included} />
              <ListCard title="Not included" items={notIncluded} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-line bg-sand/30 p-4">
      <h4 className="font-display text-lg text-ink">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-azure" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
