"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/States";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { Panel } from "@/components/admin/primitives";
import { useToast } from "@/components/admin/Toast";
import { apiRequest } from "@/lib/client-api";
import { slugify } from "@/lib/validation";
import type { AdminService } from "@/lib/admin-data";

type FormState = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  features: string[];
  /** Managed upload URL returned by /api/upload. */
  image: string;
  published: boolean;
  order: number;
};

const emptyState: FormState = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  features: [],
  image: "",
  published: true,
  order: 0,
};

export function ServiceForm({ service }: { service?: AdminService }) {
  const router = useRouter();
  const { notify } = useToast();

  const [form, setForm] = useState<FormState>(
    service
      ? {
          title: service.title,
          slug: service.slug,
          shortDescription: service.shortDescription,
          description: service.description,
          features: service.features,
          image: service.image,
          published: service.published,
          order: service.order,
        }
      : emptyState
  );
  // Only auto-generate the slug for new services, so existing URLs never move.
  const [slugTouched, setSlugTouched] = useState(Boolean(service));
  const [featureDraft, setFeatureDraft] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addFeature() {
    const value = featureDraft.trim();
    if (!value) return;
    if (form.features.includes(value)) {
      setFeatureDraft("");
      return;
    }
    set("features", [...form.features, value]);
    setFeatureDraft("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setErrors({});
    setFormError("");

    const payload = { ...form, slug: form.slug || slugify(form.title) };

    const result = service
      ? await apiRequest(`/api/services/${service._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : await apiRequest("/api/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    setSaving(false);

    if (!result.ok) {
      setErrors(result.fields ?? {});
      setFormError(result.error);
      return;
    }

    notify(service ? "Service updated." : "Service created.");
    router.push("/admin/services");
    router.refresh();
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

      <Panel>
        <div className="flex flex-col gap-6">
          <TextField
            id="title"
            label="Title"
            required
            value={form.title}
            error={errors.title}
            onChange={(e) => {
              const title = e.target.value;
              set("title", title);
              if (!slugTouched) set("slug", slugify(title));
            }}
          />

          <TextField
            id="slug"
            label="URL slug"
            required
            value={form.slug}
            error={errors.slug}
            hint={`Public address: /services/${form.slug || "your-slug"}`}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
          />

          <TextAreaField
            id="shortDescription"
            label="Short description"
            required
            rows={2}
            value={form.shortDescription}
            error={errors.shortDescription}
            hint="Shown on the services grid and cards. Keep it to one or two sentences."
            onChange={(e) => set("shortDescription", e.target.value)}
          />

          <TextAreaField
            id="description"
            label="Full description"
            required
            rows={10}
            value={form.description}
            error={errors.description}
            hint="Shown on the service detail page. Separate paragraphs with a blank line."
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
      </Panel>

      <Panel>
        <h2 className="text-lg">What this includes</h2>
        <p className="mt-1 text-[14px] text-body">
          Optional list shown alongside the full description.
        </p>

        <div className="mt-5 flex gap-3">
          <div className="flex-1">
            <label htmlFor="feature-draft" className="sr-only">
              Add an item
            </label>
            <input
              id="feature-draft"
              type="text"
              value={featureDraft}
              onChange={(e) => setFeatureDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              placeholder="Add an item and press Enter"
              className="h-11 w-full rounded-control border border-line-strong bg-surface px-3.5 text-[15px] text-strong placeholder:text-muted focus:border-brand focus:outline-none"
            />
          </div>
          <Button type="button" variant="secondary" onClick={addFeature}>
            <Plus size={16} aria-hidden />
            Add
          </Button>
        </div>

        {form.features.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {form.features.map((feature) => (
              <li
                key={feature}
                className="inline-flex items-center gap-2 rounded-pill border border-line bg-surface-2 py-1.5 pl-3.5 pr-2 text-[14px] text-strong"
              >
                {feature}
                <button
                  type="button"
                  aria-label={`Remove ${feature}`}
                  onClick={() =>
                    set(
                      "features",
                      form.features.filter((f) => f !== feature)
                    )
                  }
                  className="text-muted transition-colors hover:text-danger"
                >
                  <X size={14} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[14px] text-muted">No items added yet.</p>
        )}
      </Panel>

      <Panel>
        <LocalImageField
          label="Service image"
          folder="products"
          value={form.image}
          onChange={(url) => set("image", url)}
          hint="Landscape 16:10 works best. JPEG, PNG, WebP or GIF, maximum 8 MB."
        />
      </Panel>

      <Panel>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="sm:w-40">
            <TextField
              id="order"
              label="Sort order"
              type="number"
              min={0}
              max={999}
              value={String(form.order)}
              error={errors.order}
              hint="Lower first."
              onChange={(e) => set("order", Number(e.target.value) || 0)}
            />
          </div>

          <div className="flex items-center gap-3 pb-2">
            <input
              id="published"
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
              className="size-4 accent-[var(--brand)]"
            />
            <label htmlFor="published" className="text-[15px] text-strong">
              Published on the public website
            </label>
          </div>
        </div>
      </Panel>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? (
            <>
              <Spinner />
              Saving
            </>
          ) : service ? (
            "Save changes"
          ) : (
            "Create service"
          )}
        </Button>
        <ButtonLink href="/admin/services" variant="secondary" size="lg">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
