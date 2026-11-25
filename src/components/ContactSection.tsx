"use client";

import { useState } from "react";
import { contactContent } from "@/data/travelData";
import { postInquiry } from "@/lib/api";
import { whatsappHref, WHATSAPP_DISPLAY } from "@/lib/contact";
import type { InquiryTopicId } from "@/types/travel";
import { WhatsAppIcon } from "./WhatsAppIcon";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  name: string;
  contact: string;
  topic: InquiryTopicId | "";
  message: string;
}

interface FormErrors {
  name?: string;
  contact?: string;
  email?: string;
  topic?: string;
  message?: string;
}

export function ContactSection() {
  const copy = contactContent;
  const [form, setForm] = useState<FormState>({
    name: "",
    contact: "",
    topic: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<"sent" | "pending" | null>(null);
  const [pendingNote, setPendingNote] = useState("");

  function validate(next: FormState): FormErrors {
    const result: FormErrors = {};
    if (next.name.trim().length < 2) {
      result.name = copy.errors.name;
    }
    const value = next.contact.trim();
    if (!value) {
      result.contact = copy.errors.contact;
    } else if (value.includes("@") && !emailPattern.test(value)) {
      result.email = copy.errors.email;
    }
    if (!next.topic) {
      result.topic = copy.errors.topic;
    }
    if (next.message.trim().length < 8) {
      result.message = copy.errors.message;
    }
    return result;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
        {copy.eyebrow}
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
        {copy.title}
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">{copy.lede}</p>

      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <aside className="space-y-4">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <li className="rounded-3xl border border-line bg-paper p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                WhatsApp
              </p>
              <a
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-ocean"
                href={whatsappHref()}
                rel="noreferrer"
                target="_blank"
              >
                <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
                {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li className="rounded-3xl border border-line bg-paper p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {copy.channels.email.label}
              </p>
              <a
                className="mt-2 block text-sm text-ink hover:text-ocean"
                href={copy.channels.email.href}
              >
                {copy.channels.email.display}
              </a>
            </li>
            <li className="rounded-3xl border border-line bg-paper p-4 shadow-sm sm:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {copy.office.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-ink">
                {copy.office.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="mt-1.5 block text-muted">{copy.office.hours}</span>
              </p>
            </li>
          </ul>
        </aside>

        {submitted ? (
          <div
            className="rounded-3xl border border-line bg-paper px-6 py-12 text-center shadow-sm"
            role="status"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
              {copy.form.confirmEyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink">
              {copy.form.confirmTitle.replace("{name}", form.name.trim())}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              {submitted === "sent"
                ? copy.form.confirmBody
                : pendingNote || copy.form.confirmPendingBody}
            </p>
            <button
              type="button"
              className="btn-secondary mt-8"
              onClick={() => setSubmitted(null)}
            >
              {copy.form.editLabel}
            </button>
          </div>
        ) : (
          <form
            className="rounded-3xl border border-line bg-paper p-5 shadow-sm sm:p-8"
            noValidate
            onSubmit={async (event) => {
              event.preventDefault();
              const nextErrors = validate(form);
              setErrors(nextErrors);
              if (Object.keys(nextErrors).length > 0) return;
              const result = await postInquiry({
                type: "contact",
                name: form.name.trim(),
                contact: form.contact.trim(),
                topic: form.topic,
                message: form.message.trim(),
              });
              if (result.status === "error") {
                setErrors({ contact: result.message });
                return;
              }
              setPendingNote(result.status === "pending" ? result.message : "");
              setSubmitted(result.status);
            }}
          >
            <div>
              <label className="field-label" htmlFor="inquiry-name">
                {copy.form.nameLabel}
              </label>
              <input
                id="inquiry-name"
                name="name"
                autoComplete="name"
                className="field-input"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
              />
              {errors.name ? <p className="field-error">{errors.name}</p> : null}
            </div>
            <div className="mt-4">
              <label className="field-label" htmlFor="inquiry-contact">
                {copy.form.contactLabel}
              </label>
              <input
                id="inquiry-contact"
                name="contact"
                className="field-input"
                autoComplete="email"
                placeholder="name@example.com or +976 …"
                value={form.contact}
                onChange={(event) =>
                  setForm({ ...form, contact: event.target.value })
                }
                required
              />
              {errors.contact ? (
                <p className="field-error">{errors.contact}</p>
              ) : null}
              {errors.email ? <p className="field-error">{errors.email}</p> : null}
              {!errors.contact && !errors.email ? (
                <p className="mt-1 text-xs text-muted">{copy.form.contactHint}</p>
              ) : null}
            </div>
            <div className="mt-4">
              <label className="field-label" htmlFor="inquiry-topic">
                {copy.form.topicLabel}
              </label>
              <select
                id="inquiry-topic"
                name="topic"
                className="field-input"
                value={form.topic}
                onChange={(event) =>
                  setForm({
                    ...form,
                    topic: event.target.value as InquiryTopicId | "",
                  })
                }
                required
              >
                <option value="">{copy.form.topicPlaceholder}</option>
                {copy.topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.label}
                  </option>
                ))}
              </select>
              {errors.topic ? <p className="field-error">{errors.topic}</p> : null}
            </div>
            <div className="mt-4">
              <label className="field-label" htmlFor="inquiry-message">
                {copy.form.messageLabel}
              </label>
              <textarea
                id="inquiry-message"
                name="message"
                rows={5}
                className="field-input min-h-32 resize-y"
                placeholder={copy.form.messagePlaceholder}
                value={form.message}
                onChange={(event) =>
                  setForm({ ...form, message: event.target.value })
                }
                required
              />
              {errors.message ? (
                <p className="field-error">{errors.message}</p>
              ) : null}
            </div>
            <button type="submit" className="btn-primary mt-6">
              {copy.form.submitLabel}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
