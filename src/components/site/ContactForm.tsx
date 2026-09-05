"use client";

import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import {
  CheckboxField,
  TextAreaField,
  TextField,
} from "@/components/ui/Field";
import { Spinner } from "@/components/ui/States";
import { PHI_NOTICE, site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setFieldErrors({});
    setFormError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setFieldErrors(json.fields ?? {});
        setFormError(json.error ?? "We could not send your message.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setFormError(
        "We could not reach the server. Please check your connection or call us instead."
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-card border border-line bg-success-soft p-8"
      >
        <CheckCircle
          size={34}
          weight="duotone"
          aria-hidden
          className="text-success"
        />
        <h2 className="mt-4 text-xl">Thank you, your message is with us</h2>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-body">
          We will reply using the contact details you provided. If your question
          is urgent, call {site.phoneDisplay}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {formError ? (
        <div
          role="alert"
          className="rounded-control border border-danger bg-danger-soft px-4 py-3 text-[14px] text-strong"
        >
          {formError}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id="name"
          label="Full name"
          required
          autoComplete="name"
          error={fieldErrors.name}
        />
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          error={fieldErrors.phone}
        />
      </div>

      <TextField
        id="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        error={fieldErrors.email}
      />

      <TextAreaField
        id="message"
        label="How can we help?"
        required
        hint={PHI_NOTICE}
        error={fieldErrors.message}
      />

      <CheckboxField
        id="consent"
        required
        error={fieldErrors.consent}
        label={
          <>
            I agree that {site.name} may contact me using the details above, and
            I have not included sensitive medical information in this message.
          </>
        }
      />

      <div className="flex flex-col items-start gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Spinner />
              Sending
            </>
          ) : (
            "Send Message"
          )}
        </Button>
        <p className="text-[13px] leading-relaxed text-muted">
          For a medical emergency call 911. Do not use this form.
        </p>
      </div>
    </form>
  );
}
