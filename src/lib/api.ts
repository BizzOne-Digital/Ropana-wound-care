import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";
import { getSession } from "@/lib/auth";

export type FieldErrors = Record<string, string>;

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(message: string, status = 400, fields?: FieldErrors) {
  return NextResponse.json(
    { ok: false, error: message, ...(fields ? { fields } : {}) },
    { status }
  );
}

/** Flatten a ZodError into a { fieldName: firstMessage } map for form UIs. */
export function zodFieldErrors(error: ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function parseBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<
  { success: true; data: T } | { success: false; response: NextResponse }
> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return { success: false, response: fail("Request body must be JSON.", 400) };
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return {
      success: false,
      response: fail(
        "Please correct the highlighted fields.",
        422,
        zodFieldErrors(parsed.error)
      ),
    };
  }
  return { success: true, data: parsed.data };
}

/** Guard for every admin-only route handler. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return { session: null, response: fail("Not authorised.", 401) };
  }
  return { session, response: null };
}

/**
 * Log the real error server-side, return a generic message to the client.
 * Stack traces must never reach the browser in production.
 */
export function serverError(context: string, error: unknown) {
  console.error(`[${context}]`, error);
  const isDev = process.env.NODE_ENV !== "production";
  const detail =
    isDev && error instanceof Error ? `: ${error.message}` : "";
  return fail(`Something went wrong on our end${detail}.`, 500);
}
