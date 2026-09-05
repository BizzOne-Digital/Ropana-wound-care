"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/States";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Only accept an internal path, so ?next= cannot be used as an open redirect.
  const requested = searchParams.get("next") ?? "/admin";
  const next =
    requested.startsWith("/admin") && !requested.startsWith("//")
      ? requested
      : "/admin";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");
    setFieldErrors({});

    const data = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          password: String(data.get("password") ?? ""),
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setFieldErrors(json.fields ?? {});
        setError(json.error ?? "Sign in failed.");
        setSubmitting(false);
        return;
      }

      router.replace(next);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {error ? (
        <div
          role="alert"
          className="rounded-control border border-danger bg-danger-soft px-4 py-3 text-[14px] text-strong"
        >
          {error}
        </div>
      ) : null}

      <TextField
        id="email"
        label="Email"
        type="email"
        required
        autoComplete="username"
        autoFocus
        error={fieldErrors.email}
      />

      <TextField
        id="password"
        label="Password"
        type="password"
        required
        autoComplete="current-password"
        error={fieldErrors.password}
      />

      <Button type="submit" size="lg" disabled={submitting} className="mt-1 w-full">
        {submitting ? (
          <>
            <Spinner />
            Signing in
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
