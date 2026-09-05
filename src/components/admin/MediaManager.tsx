"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Panel } from "@/components/admin/primitives";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { useToast } from "@/components/admin/Toast";
import { apiRequest } from "@/lib/client-api";
import { isLegacyUploadUrl } from "@/lib/uploads";
import type { AdminSetting } from "@/lib/admin-data";

const slots = [
  {
    key: "logo",
    label: "Logo",
    hint: "Shown in the header and footer. A transparent PNG works best. Leave empty to use the Ropana wordmark.",
  },
  {
    key: "heroImage",
    label: "Homepage hero image",
    hint: "Portrait or landscape, at least 1200px wide. This is the first image visitors see.",
  },
  {
    key: "aboutImage",
    label: "Practitioner portrait",
    hint: "Used on the homepage and the About page. Portrait orientation works best.",
  },
  {
    key: "mobileCareImage",
    label: "Mobile care image",
    hint: "Used in the mobile visits section on the homepage. Landscape orientation.",
  },
] as const;

/**
 * Each slot saves immediately on upload or removal, because there is no
 * surrounding form to submit. The server stores only the returned URL and
 * discards the binary the slot previously pointed at.
 */
export function MediaManager({ settings }: { settings: AdminSetting[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [, startTransition] = useTransition();

  const [images, setImages] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      slots.map((slot) => [
        slot.key,
        settings.find((s) => s.key === slot.key)?.value ?? "",
      ])
    )
  );
  const [savingKey, setSavingKey] = useState<string | null>(null);

  async function persist(key: string, url: string) {
    const previous = images[key];
    setImages((prev) => ({ ...prev, [key]: url }));
    setSavingKey(key);

    const result = await apiRequest("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ key, value: url }),
    });
    setSavingKey(null);

    if (!result.ok) {
      // Roll back so the panel never shows an image the site is not using.
      setImages((prev) => ({ ...prev, [key]: previous }));
      notify(result.error, "error");
      return;
    }

    notify(url ? "Image saved and live on the website." : "Image removed.");
    startTransition(() => router.refresh());
  }

  const hasLegacy = Object.values(images).some(isLegacyUploadUrl);

  return (
    <>
      {hasLegacy ? (
        <div
          role="alert"
          className="mb-6 rounded-card border border-line-strong bg-warning-soft p-5"
        >
          <h2 className="text-[15px] font-semibold text-strong">
            Some images point at old disk storage
          </h2>
          <p className="mt-2 max-w-[70ch] text-[14px] leading-relaxed text-body">
            One or more slots below still reference a <code>/uploads/...</code>{" "}
            path from the previous disk-based storage. Those files do not survive
            a deployment, so the website is showing a placeholder in their place.
            Re-upload each affected image to fix it permanently.
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {slots.map((slot) => (
          <Panel key={slot.key}>
            <LocalImageField
              label={slot.label}
              hint={slot.hint}
              folder="pages"
              value={images[slot.key]}
              onChange={(url) => persist(slot.key, url)}
            />
            {savingKey === slot.key ? (
              <p className="mt-3 text-[13px] text-muted">Saving...</p>
            ) : null}
          </Panel>
        ))}
      </div>
    </>
  );
}
