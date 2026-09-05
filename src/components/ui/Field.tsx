"use client";

import type { ReactNode, SelectHTMLAttributes } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cx } from "@/lib/format";

/* Inputs sit on --surface with a --line-strong border in both themes, which
   keeps placeholder and helper text above WCAG AA on every background used. */
const control =
  "w-full rounded-control border bg-surface px-3.5 py-2.5 text-[15px] text-strong " +
  "placeholder:text-muted transition-colors duration-200 " +
  "focus:border-brand focus:outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

function Wrapper({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-strong">
        {label}
        {required ? (
          <span className="ml-1 text-danger" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type Common = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({
  id,
  label,
  hint,
  error,
  className,
  ...rest
}: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} required={rest.required}>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cx(control, error ? "border-danger" : "border-line-strong", className)}
        {...rest}
      />
    </Wrapper>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  className,
  ...rest
}: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} required={rest.required}>
      <textarea
        id={id}
        name={id}
        rows={rest.rows ?? 5}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cx(control, "resize-y", error ? "border-danger" : "border-line-strong", className)}
        {...rest}
      />
    </Wrapper>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  className,
  children,
  ...rest
}: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} required={rest.required}>
      <select
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cx(control, error ? "border-danger" : "border-line-strong", className)}
        {...rest}
      >
        {children}
      </select>
    </Wrapper>
  );
}

export function CheckboxField({
  id,
  label,
  error,
  ...rest
}: {
  id: string;
  label: ReactNode;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 size-4 shrink-0 accent-[var(--brand)]"
          {...rest}
        />
        <label htmlFor={id} className="text-[13px] leading-relaxed text-body">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-[13px] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
