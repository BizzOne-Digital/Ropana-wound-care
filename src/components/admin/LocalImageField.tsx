"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Trash, UploadSimple } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/States";
import { useToast } from "@/components/admin/Toast";
import {
  ACCEPT_ATTRIBUTE,
  MAX_UPLOAD_BYTES,
  PLACEHOLDER_IMAGE_SRC,
  formatBytes,
  isAllowedMimeType,
  isManagedUploadUrl,
  resolveImageSrc,
  type UploadFolder,
} from "@/lib/uploads";

type UploadResponse = {
  success: boolean;
  url?: string;
  filename?: string;
  size?: number;
  folder?: string;
  error?: string;
};

/**
 * Admin image field.
 *
 * Uploads go to /api/upload as multipart form data with `file` and `folder`,
 * are stored as binary in MongoDB, and come back as a `/api/uploads/...` URL.
 * `onChange` hands the caller that URL string, which is the only thing the
 * surrounding document ever stores.
 *
 * Orphan handling: if an image uploaded during this editing session is replaced
 * or removed before the form is saved, its binary is discarded immediately.
 * Images already referenced by a saved document are deleted by that document's
 * own route handler when the reference changes.
 */
export function LocalImageField({
  value,
  folder,
  onChange,
  label = "Image",
  hint,
  designFallback,
}: {
  value: string;
  folder: UploadFolder;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  designFallback?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { notify } = useToast();
  const [uploading, setUploading] = useState(false);

  // URLs uploaded in this session that no saved document points at yet.
  const unsavedRef = useRef<Set<string>>(new Set());

  const inputId = `upload-${folder}-${label
    .replace(/\s+/g, "-")
    .toLowerCase()}`;

  const resolved = resolveImageSrc(value, designFallback);
  const isPlaceholder = resolved === PLACEHOLDER_IMAGE_SRC;

  /** Discard a binary this session created that is about to become unreachable. */
  async function discardIfUnsaved(url: string) {
    if (!url || !unsavedRef.current.has(url)) return;
    unsavedRef.current.delete(url);
    try {
      await fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
      });
    } catch {
      // A failed cleanup is not worth interrupting the editor over.
    }
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Fail fast in the browser. The server re-validates both of these.
    if (!isAllowedMimeType(file.type)) {
      notify("Upload a JPEG, PNG, WebP or GIF image.", "error");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      notify(
        `That image is ${formatBytes(file.size)}. The limit is ${formatBytes(
          MAX_UPLOAD_BYTES
        )}.`,
        "error"
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);

    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = (await res.json().catch(() => null)) as UploadResponse | null;

      if (!res.ok || !json?.success || !json.url) {
        notify(
          json?.error ??
            (res.status === 401
              ? "Your session has expired. Sign in again."
              : `Upload failed (${res.status}).`),
          "error"
        );
        return;
      }

      const previous = value;
      unsavedRef.current.add(json.url);
      onChange(json.url);
      notify(`Image uploaded (${formatBytes(json.size ?? file.size)}).`);

      // Only the binary this session created is safe to remove here.
      await discardIfUnsaved(previous);
    } catch {
      notify("Could not reach the server. Check your connection.", "error");
    } finally {
      setUploading(false);
      // Allow the same file to be selected again after a failure.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    const previous = value;
    onChange("");
    await discardIfUnsaved(previous);
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-strong">{label}</span>

      {value || designFallback ? (
        <div className="relative aspect-[16/10] w-full max-w-sm overflow-hidden rounded-card border border-line bg-surface-3">
          <Image
            src={resolved}
            alt="Selected image preview"
            fill
            sizes="384px"
            unoptimized={isPlaceholder}
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] w-full max-w-sm items-center justify-center rounded-card border border-dashed border-line-strong bg-surface-2 text-[14px] text-muted">
          No image selected
        </div>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        onChange={handleFile}
        disabled={uploading}
        className="sr-only"
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Spinner />
              Uploading
            </>
          ) : (
            <>
              <UploadSimple size={16} aria-hidden />
              {value ? "Replace image" : "Upload image"}
            </>
          )}
        </Button>

        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={uploading}
            onClick={handleRemove}
          >
            <Trash size={16} aria-hidden />
            Remove
          </Button>
        ) : null}
      </div>

      <p className="text-[13px] text-muted">
        {hint ??
          `JPEG, PNG, WebP or GIF. Maximum ${formatBytes(MAX_UPLOAD_BYTES)}.`}
      </p>

      {isManagedUploadUrl(value) ? (
        <p className="break-all text-[12px] text-muted">Stored at: {value}</p>
      ) : null}
    </div>
  );
}
