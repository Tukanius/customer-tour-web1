"use client";

import { useState } from "react";
import { contactContent } from "@/data/travelData";
import type { InquiryTopicId } from "@/types/travel";
import { SiteSubNav } from "./SiteSubNav";

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
  const [submitted, setSubmitted] = useState(false);

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
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SiteSubNav current="/contact" />
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
        {copy.eyebrow}
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
        {copy.title}
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">{copy.lede}</p>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <aside className="space-y-6">
          <dl className="space-y-4 rounded-2xl border border-line bg-sand/30 p-5">
            <Channel
              label={copy.channels.phone.label}
              href={copy.channels.phone.href}
              display={copy.channels.phone.display}
            />
            <Channel
              label={copy.channels.email.label}
              href={copy.channels.email.href}
              display={copy.channels.email.display}
            />
            <Channel
              label={copy.channels.whatsapp.label}
              href={copy.channels.whatsapp.href}
              display={copy.channels.whatsapp.display}
            />
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {copy.office.label}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-ink">
                {copy.office.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="mt-2 block text-muted">{copy.office.hours}</span>
              </dd>
            </div>
          </dl>
          <ul className="flex flex-wrap gap-2">
            {copy.social.map((item) => (
              <li key={item.label}>
                <a
                  className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink hover:bg-sand"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {submitted ? (
          <div
            className="rounded-3xl border border-line bg-paper px-6 py-12 text-center"
            role="status"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
              {copy.form.confirmEyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink">
              {copy.form.confirmTitle.replace("{name}", form.name.trim())}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">{copy.form.confirmBody}</p>
            <button
              type="button"
              className="btn-secondary mt-8"
              onClick={() => setSubmitted(false)}
            >
              {copy.form.editLabel}
            </button>
          </div>
        ) : (
          <form
            className="rounded-3xl border border-line bg-paper p-5 sm:p-8"
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

function Channel({
  label,
  href,
  display,
}: {
  label: string;
  href: string;
  display: string;
}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm">
        <a className="text-ink hover:text-azure" href={href}>
          {display}
        </a>
      </dd>
    </div>
  );
}
