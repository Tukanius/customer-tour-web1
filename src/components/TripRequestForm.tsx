"use client";

import { useMemo, useState } from "react";
import { destinations, MONTHS } from "@/data/tours";
import { useTrip, type TravellerCount } from "./TripProvider";

const TRAVELLER_OPTIONS: TravellerCount[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
];

interface FormState {
  name: string;
  email: string;
  whatsapp: string;
  month: string;
  travellers: TravellerCount;
  notes: string;
}

interface FormErrors {
  name?: string;
  contact?: string;
  email?: string;
  month?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function TripRequestForm() {
  const {
    selectedIds,
    removeDestination,
    clearDestinations,
    appliedFilters,
  } = useTrip();
  const selected = useMemo(
    () => destinations.filter((item) => selectedIds.includes(item.id)),
    [selectedIds],
  );

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    whatsapp: "",
    month:
      appliedFilters.when === "any" ? "" : String(appliedFilters.when),
    travellers: appliedFilters.travellers,
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(next: FormState): FormErrors {
    const result: FormErrors = {};
    if (next.name.trim().length < 2) {
      result.name = "Please enter your name.";
    }
    const email = next.email.trim();
    const whatsapp = next.whatsapp.trim();
    if (!email && !whatsapp) {
      result.contact = "Add an email or a WhatsApp number.";
    }
    if (email && !emailPattern.test(email)) {
      result.email = "That email does not look complete.";
    }
    if (!next.month) {
      result.month = "Choose a travel month.";
    }
    return result;
  }

  if (submitted) {
    return (
      <section id="contact" className="scroll-mt-24 bg-sand/35">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div
            className="rounded-3xl border border-line bg-paper px-6 py-12 text-center"
            role="status"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
              Request received
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink">
              Thank you, {form.name.trim()}. We will write back within a day.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              This is a sample confirmation. No message was sent. Your notes and
              selected places stay on this page until you refresh.
            </p>
            {selected.length > 0 ? (
              <p className="mt-6 text-sm text-ink">
                On the list: {selected.map((item) => item.name).join(", ")}
              </p>
            ) : null}
            <button
              type="button"
              className="btn-secondary mt-8"
              onClick={() => setSubmitted(false)}
            >
              Edit request
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="scroll-mt-24 bg-sand/35">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          Contact
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Tell us the month. We will sketch the road.
        </h2>
        <p className="mt-3 max-w-xl text-muted">
          A planner replies by email or WhatsApp. Nothing is booked until you
          approve an itinerary.
        </p>

        <div className="mt-8 rounded-3xl border border-line bg-paper p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl text-ink">Selected places</h3>
            {selected.length > 0 ? (
              <button
                type="button"
                className="text-sm font-medium text-azure underline-offset-2 hover:underline"
                onClick={clearDestinations}
              >
                Clear all
              </button>
            ) : null}
          </div>
          {selected.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              Add places from Destinations, or leave this empty and describe the
              trip in notes.
            </p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {selected.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 rounded-full border border-line bg-sand/70 pl-3 pr-1 py-1 text-sm text-ink"
                >
                  {item.name}
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-paper"
                    onClick={() => removeDestination(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              const nextErrors = validate(form);
              setErrors(nextErrors);
              if (Object.keys(nextErrors).length === 0) {
                setSubmitted(true);
              }
            }}
          >
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                className="field-input"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
              />
              {errors.name ? (
                <p className="field-error">{errors.name}</p>
              ) : null}
            </div>
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="field-input"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
              />
              {errors.email ? (
                <p className="field-error">{errors.email}</p>
              ) : null}
            </div>
            <div>
              <label className="field-label" htmlFor="whatsapp">
                WhatsApp
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                autoComplete="tel"
                className="field-input"
                placeholder="+976 …"
                value={form.whatsapp}
                onChange={(event) =>
                  setForm({ ...form, whatsapp: event.target.value })
                }
              />
            </div>
            {errors.contact ? (
              <p className="field-error sm:col-span-2">{errors.contact}</p>
            ) : (
              <p className="sm:col-span-2 text-xs text-muted">
                Email or WhatsApp is enough — we only need one way to reply.
              </p>
            )}
            <div>
              <label className="field-label" htmlFor="month">
                Travel month
              </label>
              <select
                id="month"
                name="month"
                className="field-input"
                value={form.month}
                onChange={(event) =>
                  setForm({ ...form, month: event.target.value })
                }
                required
              >
                <option value="">Choose a month</option>
                {MONTHS.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              {errors.month ? (
                <p className="field-error">{errors.month}</p>
              ) : null}
            </div>
            <div>
              <label className="field-label" htmlFor="form-travellers">
                Travellers
              </label>
              <select
                id="form-travellers"
                name="travellers"
                className="field-input"
                value={form.travellers}
                onChange={(event) =>
                  setForm({
                    ...form,
                    travellers: Number(event.target.value) as TravellerCount,
                  })
                }
              >
                {TRAVELLER_OPTIONS.map((count) => (
                  <option key={count} value={count}>
                    {count === 12 ? "12+" : String(count)}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="field-input min-h-28 resize-y"
                placeholder="Pace, diet, photography, children, winter travel…"
                value={form.notes}
                onChange={(event) =>
                  setForm({ ...form, notes: event.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary">
                Send trip request
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
