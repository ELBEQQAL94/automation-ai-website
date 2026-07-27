"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-8 text-center sm:p-10">
        <p className="text-xl font-medium text-on-surface">Message sent.</p>
        <p className="mt-2 text-lg text-on-surface-variant">
          Thanks for reaching out — we&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-5 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-8 sm:p-10"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-base font-medium text-on-surface">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="rounded-lg border border-outline-variant/40 bg-surface px-4 py-3 text-base text-on-surface outline-none transition-colors focus:border-primary"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-base font-medium text-on-surface">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-lg border border-outline-variant/40 bg-surface px-4 py-3 text-base text-on-surface outline-none transition-colors focus:border-primary"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-base font-medium text-on-surface">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="resize-none rounded-lg border border-outline-variant/40 bg-surface px-4 py-3 text-base text-on-surface outline-none transition-colors focus:border-primary"
        />
      </div>

      {status === "error" && (
        <p className="text-base text-red-500" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 cursor-pointer rounded-full bg-primary-container px-8 py-4 text-lg font-medium text-on-primary-container transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
