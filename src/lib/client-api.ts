"use client";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fields?: Record<string, string> };

/**
 * Thin wrapper over fetch for admin mutations. Always resolves; network and
 * parse failures come back as a normal failed result so callers only branch once.
 */
export async function apiRequest<T = unknown>(
  url: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers:
        init?.body instanceof FormData
          ? init?.headers
          : { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });

    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    const body = json as
      | { ok?: boolean; data?: T; error?: string; fields?: Record<string, string> }
      | null;

    if (!res.ok || !body?.ok) {
      if (res.status === 401) {
        return { ok: false, error: "Your session has expired. Sign in again." };
      }
      return {
        ok: false,
        error: body?.error ?? `Request failed (${res.status}).`,
        fields: body?.fields,
      };
    }

    return { ok: true, data: body.data as T };
  } catch {
    return {
      ok: false,
      error: "Could not reach the server. Check your connection.",
    };
  }
}
