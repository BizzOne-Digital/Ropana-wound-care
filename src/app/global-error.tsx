"use client";

import { useEffect } from "react";

/** Last-resort boundary: replaces the root layout, so it renders its own shell. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
          background: "#ffffff",
          color: "#12201f",
        }}
      >
        <div style={{ maxWidth: "34rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: "0.75rem", lineHeight: 1.6, color: "#4b5b5a" }}>
            Please try again. If the problem continues, call Ropana Wound Care
            on (847) 219-9924.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              height: "2.75rem",
              padding: "0 1.25rem",
              borderRadius: "10px",
              border: "none",
              background: "#14615c",
              color: "#ffffff",
              fontSize: "0.95rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
