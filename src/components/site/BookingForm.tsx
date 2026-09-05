"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonLink } from "@/components/ui/Button";
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/Field";
import { Spinner } from "@/components/ui/States";
import { TIME_WINDOW_LABELS } from "@/lib/format";
import { PHI_NOTICE, site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

export function BookingForm({ serviceOptions }: { serviceOptions: string[] }) {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") ?? "";

  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  const options = serviceOptions.length
    ? serviceOptions
    : ["Mobile wound care visit", "Telehealth consultation"];

  // Patients cannot request a date in the past.
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Guard against double submission while a request is in flight.
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
      preferredDate: String(data.get("preferredDate") ?? ""),
      preferredTime: String(data.get("preferredTime") ?? ""),
      service: String(data.get("service") ?? ""),
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setFieldErrors(json.fields ?? {});
        setFormError(json.error ?? "We could not send your request.");
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
        className="rounded-card border border-line bg-success-soft p-8 text-center"
      >
        <CheckCircle
          size={36}
          weight="duotone"
          aria-hidden
          className="mx-auto text-success"
        />
        <h2 className="mt-4 text-xl">Your request has been received</h2>
        <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-relaxed text-body">
          Our team will contact you to confirm availability. This request is not
          a confirmed appointment until we speak with you.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" variant="secondary" size="sm">
            Back to home
          </ButtonLink>
          <a
            href={site.phoneHref}
            className="text-[15px] font-medium text-brand underline underline-offset-4"
          >
            Call {site.phoneDisplay}
          </a>
        </div>
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

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id="preferredDate"
          label="Preferred date"
          type="date"
          min={today}
          required
          error={fieldErrors.preferredDate}
        />
        <SelectField
          id="preferredTime"
          label="Preferred time"
          required
          defaultValue=""
          error={fieldErrors.preferredTime}
        >
          <option value="" disabled>
            Select a time window
          </option>
          {Object.entries(TIME_WINDOW_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectField>
      </div>

      <SelectField
        id="service"
        label="Service needed"
        required
        defaultValue={options.includes(preselected) ? preselected : ""}
        error={fieldErrors.service}
      >
        <option value="" disabled>
          Select a service
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value="Not sure yet">Not sure yet</option>
      </SelectField>

      <TextAreaField
        id="message"
        label="Anything we should know?"
        hint={PHI_NOTICE}
        rows={4}
        error={fieldErrors.message}
      />

      <CheckboxField
        id="consent"
        error={fieldErrors.consent}
        required
        label={
          <>
            I understand this form sends a request only, that it is not a
            confirmed appointment, and that {site.name} will contact me using the
            details above. I have not included sensitive medical information.
          </>
        }
      />

      <div className="flex flex-col items-start gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Spinner />
              Sending request
            </>
          ) : (
            "Request a Visit"
          )}
        </Button>
        <p className="text-[13px] leading-relaxed text-muted">
          For a medical emergency call 911. Do not use this form.
        </p>
      </div>
    </form>
  );
}
