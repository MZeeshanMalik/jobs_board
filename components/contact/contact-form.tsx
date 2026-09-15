// components/contact/contact-form.tsx
"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/api/contact";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [globalMessage, setGlobalMessage] = useState<string>("");

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setGlobalMessage("");

    const result = await submitContactForm(form);

    if (result.success) {
      setStatus("success");
      setGlobalMessage(
        result.message ??
          "Thanks for reaching out. We'll get back to you soon.",
      );
      setForm(initialState);
      return;
    }

    setStatus("error");
    setGlobalMessage(result.message ?? "Something went wrong.");
    if (result.errors) setErrors(result.errors);
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl border border-pink-100 p-8 sm:p-10 shadow-sm text-center">
        <div className="mx-auto inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-50 text-rose-600">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          Message sent
        </h2>
        <p className="mt-2 text-sm text-gray-600">{globalMessage}</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setGlobalMessage("");
          }}
          className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-pink-100 p-6 sm:p-8 shadow-sm space-y-5"
      noValidate
    >
      {status === "error" && globalMessage && (
        <div
          role="alert"
          className="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3"
        >
          {globalMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          id="name"
          label="Your Name"
          value={form.name}
          onChange={update("name")}
          error={errors.name}
          placeholder="Ali Ahmed"
          autoComplete="name"
          required
        />
        <Field
          id="email"
          label="Email Address"
          type="email"
          value={form.email}
          onChange={update("email")}
          error={errors.email}
          placeholder="ali@example.com"
          autoComplete="email"
          required
        />
      </div>

      <Field
        id="subject"
        label="Subject"
        value={form.subject}
        onChange={update("subject")}
        error={errors.subject}
        placeholder="I need help with…"
        required
      />

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-900 mb-1.5"
        >
          Message <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={form.message}
          onChange={update("message")}
          placeholder="Tell us how we can help you…"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`w-full rounded-xl border bg-pink-50/40 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 transition-colors resize-y ${
            errors.message
              ? "border-rose-400 focus:border-rose-500"
              : "border-pink-100 focus:border-rose-300"
          }`}
          required
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-rose-600">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 active:bg-rose-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
      >
        {status === "submitting" ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                fill="currentColor"
                className="opacity-75"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Sending…
          </>
        ) : (
          <>
            Send Message
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  required,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-900 mb-1.5"
      >
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-pink-50/40 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 transition-colors ${
          error
            ? "border-rose-400 focus:border-rose-500"
            : "border-pink-100 focus:border-rose-300"
        }`}
        required={required}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
