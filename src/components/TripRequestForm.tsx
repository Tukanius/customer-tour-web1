"use client";

import { useMemo, useState } from "react";
import { postInquiry } from "@/lib/api";
import { MONTHS } from "@/lib/format";
import type { CatalogItem } from "@/types/catalog";
import { useTrip } from "./TripProvider";

interface FormState {
  name: string;
  email: string;
  whatsapp: string;
  month: string;
  travellers: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  contact?: string;
  email?: string;
  month?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function TripRequestForm({
  destinations,
  tours,
  vehicles,
}: {
  destinations: CatalogItem[];
  tours: CatalogItem[];
  vehicles: CatalogItem[];
}) {
  const trip = useTrip();
  const selectedPlaces = useMemo(
    () => destinations.filter((item) => trip.destinationIds.includes(item.id)),
    [destinations, trip.destinationIds],
  );
  const selectedTours = useMemo(
    () => tours.filter((item) => trip.tourIds.includes(item.id)),
    [tours, trip.tourIds],
  );
  const selectedVehicles = useMemo(
    () => vehicles.filter((item) => trip.vehicleIds.includes(item.id)),
    [vehicles, trip.vehicleIds],
  );
  const hasSelection =
    selectedPlaces.length + selectedTours.length + selectedVehicles.length > 0;

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    whatsapp: "",
    month: "",
    travellers: "2",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<"sent" | "pending" | null>(null);
  const [pendingNote, setPendingNote] = useState("");

  function validate(next: FormState): FormErrors {
    const result: FormErrors = {};
    if (next.name.trim().length < 2) result.name = "Please enter your name.";
    const email = next.email.trim();
    const whatsapp = next.whatsapp.trim();
    if (!email && !whatsapp) result.contact = "Add an email or a WhatsApp number.";
    if (email && !emailPattern.test(email)) {
      result.email = "That email does not look complete.";
    }
    if (!next.month) result.month = "Choose a travel month.";
    return result;
  }

  if (submitted) {
    return (
      <section id="trip-request" className="scroll-mt-24 bg-sand/35">
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
              {submitted === "sent"
                ? "Your request was sent to the desk."
                : pendingNote}
            </p>
            <button
              type="button"
              className="btn-secondary mt-8"
              onClick={() => setSubmitted(null)}
            >
              Edit request
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="trip-request" className="scroll-mt-24 bg-sand/35">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          Plan a trip
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Tell us the month. We will sketch the road.
        </h2>
        <div className="mt-8 rounded-3xl border border-line bg-paper p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl text-ink">On this request</h3>
            {hasSelection ? (
              <button
                type="button"
                className="text-sm font-medium text-azure underline-offset-2 hover:underline"
                onClick={trip.clearTrip}
              >
                Clear all
              </button>
            ) : null}
          </div>
          {!hasSelection ? (
            <p className="mt-3 text-sm text-muted">
              Add published places, tours, or vehicles, or describe the trip in
              notes.
            </p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {selectedPlaces.map((item) => (
                <Chip
                  key={item.id}
                  label={`Place: ${item.name}`}
                  onRemove={() => trip.removeDestination(item.id)}
                />
              ))}
              {selectedTours.map((item) => (
                <Chip
                  key={item.id}
                  label={`Tour: ${item.name}`}
                  onRemove={() => trip.removeTour(item.id)}
                />
              ))}
              {selectedVehicles.map((item) => (
                <Chip
                  key={item.id}
                  label={`Vehicle: ${item.name}`}
                  onRemove={() => trip.removeVehicle(item.id)}
                />
              ))}
            </ul>
          )}
          <form
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
            noValidate
            onSubmit={async (event) => {
              event.preventDefault();
              const nextErrors = validate(form);
              setErrors(nextErrors);
              if (Object.keys(nextErrors).length > 0) return;
              const result = await postInquiry({
                type: "trip-request",
                name: form.name.trim(),
                email: form.email.trim() || undefined,
                whatsapp: form.whatsapp.trim() || undefined,
                month: Number(form.month),
                travellers: Number(form.travellers),
                notes: form.notes.trim() || undefined,
                destinationIds: trip.destinationIds,
                tourIds: trip.tourIds,
                vehicleIds: trip.vehicleIds,
              });
              if (result.status === "error") {
                setErrors({ contact: result.message });
                return;
              }
              setPendingNote(result.status === "pending" ? result.message : "");
              setSubmitted(result.status);
            }}
          >
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                autoComplete="name"
                className="field-input"
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
              {errors.name ? <p className="field-error">{errors.name}</p> : null}
            </div>
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="field-input"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
              {errors.email ? <p className="field-error">{errors.email}</p> : null}
            </div>
            <div>
              <label className="field-label" htmlFor="whatsapp">
                WhatsApp
              </label>
              <input
                id="whatsapp"
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
                required
                value={form.month}
                onChange={(event) => setForm({ ...form, month: event.target.value })}
              >
                <option value="">Choose a month</option>
                {MONTHS.map((label, index) => (
                  <option key={label} value={index + 1}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.month ? <p className="field-error">{errors.month}</p> : null}
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
                  setForm({ ...form, travellers: event.target.value })
                }
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                    {index + 1 === 12 ? "+" : ""}
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
                placeholder="Pace, diet, photography, self-drive, children…"
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
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

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <li>
      <button
        type="button"
        className="rounded-full border border-line bg-sand/50 px-3 py-1 text-sm text-ink hover:bg-sand"
        onClick={onRemove}
      >
        {label} ×
      </button>
    </li>
  );
}
