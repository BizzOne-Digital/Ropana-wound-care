"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PencilSimple, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { CheckboxField, TextAreaField, TextField } from "@/components/ui/Field";
import { EmptyState, Spinner } from "@/components/ui/States";
import { SafeImage } from "@/components/ui/SafeImage";
import { ConfirmDialog } from "@/components/admin/Confirm";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { Panel, StatusBadge } from "@/components/admin/primitives";
import { useToast } from "@/components/admin/Toast";
import { apiRequest } from "@/lib/client-api";
import { formatDate } from "@/lib/format";
import type { AdminWoundCase } from "@/lib/admin-data";

type Draft = {
  title: string;
  summary: string;
  timeframe: string;
  beforeImage: string;
  afterImage: string;
  consent: boolean;
  sensitive: boolean;
  published: boolean;
  order: string;
};

const emptyDraft: Draft = {
  title: "",
  summary: "",
  timeframe: "",
  beforeImage: "",
  afterImage: "",
  consent: false,
  sensitive: true,
  published: false,
  order: "0",
};

export function WoundCasesManager({ cases }: { cases: AdminWoundCase[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [, startTransition] = useTransition();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminWoundCase | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setErrors({});
    setFormError("");
    setShowForm(true);
  }

  function openEdit(item: AdminWoundCase) {
    setEditingId(item._id);
    setDraft({
      title: item.title,
      summary: item.summary,
      timeframe: item.timeframe,
      beforeImage: item.beforeImage,
      afterImage: item.afterImage,
      consent: item.consent,
      sensitive: item.sensitive,
      published: item.published,
      order: String(item.order),
    });
    setErrors({});
    setFormError("");
    setShowForm(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    // Checked in the browser so the editor gets an answer without a round trip.
    // The API enforces the same two rules regardless of what is sent.
    const localErrors: Record<string, string> = {};
    if (!draft.beforeImage) localErrors.beforeImage = "Upload the before image.";
    if (!draft.afterImage) localErrors.afterImage = "Upload the after image.";
    if (draft.published && !draft.consent) {
      localErrors.consent =
        "Confirm you hold written patient consent before publishing.";
    }
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setFormError("Please correct the highlighted fields.");
      return;
    }

    setSaving(true);
    setErrors({});
    setFormError("");

    const payload = {
      title: draft.title,
      summary: draft.summary,
      timeframe: draft.timeframe,
      beforeImage: draft.beforeImage,
      afterImage: draft.afterImage,
      consent: draft.consent,
      sensitive: draft.sensitive,
      published: draft.published,
      order: Number(draft.order) || 0,
    };

    const result = editingId
      ? await apiRequest(`/api/wound-cases/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : await apiRequest("/api/wound-cases", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    setSaving(false);

    if (!result.ok) {
      setErrors(result.fields ?? {});
      setFormError(result.error);
      return;
    }

    notify(editingId ? "Result updated." : "Result added.");
    setShowForm(false);
    setDraft(emptyDraft);
    setEditingId(null);
    startTransition(() => router.refresh());
  }

  async function togglePublished(item: AdminWoundCase) {
    if (!item.published && !item.consent) {
      notify(
        "Record written patient consent before publishing this result.",
        "error"
      );
      return;
    }

    setBusyId(item._id);
    const result = await apiRequest(`/api/wound-cases/${item._id}`, {
      method: "PATCH",
      body: JSON.stringify({ published: !item.published }),
    });
    setBusyId(null);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    notify(item.published ? "Result unpublished." : "Result published.");
    startTransition(() => router.refresh());
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const result = await apiRequest(`/api/wound-cases/${pendingDelete._id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setPendingDelete(null);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    notify("Result deleted.");
    startTransition(() => router.refresh());
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={openCreate}>
          <Plus size={16} aria-hidden />
          Add result
        </Button>
      </div>

      {showForm ? (
        <Panel className="mb-6">
          <h2 className="text-lg">
            {editingId ? "Edit result" : "New before and after result"}
          </h2>
          <p className="mt-1 text-[14px] text-body">
            Publish a case only with written patient consent. Do not include
            names, faces, tattoos or anything else that could identify the
            patient, and crop images to the wound area.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 flex flex-col gap-5"
          >
            {formError ? (
              <div
                role="alert"
                className="rounded-control border border-danger bg-danger-soft px-4 py-3 text-[14px] text-strong"
              >
                {formError}
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                id="w-title"
                label="Wound type"
                required
                value={draft.title}
                error={errors.title}
                hint="For example: Diabetic foot ulcer"
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
              <TextField
                id="w-timeframe"
                label="Healing time"
                value={draft.timeframe}
                error={errors.timeframe}
                hint="Optional. For example: 8 weeks"
                onChange={(e) =>
                  setDraft({ ...draft, timeframe: e.target.value })
                }
              />
            </div>

            <TextAreaField
              id="w-summary"
              label="What treatment involved"
              rows={3}
              value={draft.summary}
              error={errors.summary}
              hint="Optional. A short, plain-language description of the care provided."
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <LocalImageField
                  label="Before image"
                  folder="results"
                  value={draft.beforeImage}
                  onChange={(url) => setDraft({ ...draft, beforeImage: url })}
                  hint="The wound at the first visit."
                />
                {errors.beforeImage ? (
                  <p className="mt-2 text-[13px] font-medium text-danger">
                    {errors.beforeImage}
                  </p>
                ) : null}
              </div>
              <div>
                <LocalImageField
                  label="After image"
                  folder="results"
                  value={draft.afterImage}
                  onChange={(url) => setDraft({ ...draft, afterImage: url })}
                  hint="The same wound after treatment."
                />
                {errors.afterImage ? (
                  <p className="mt-2 text-[13px] font-medium text-danger">
                    {errors.afterImage}
                  </p>
                ) : null}
              </div>
            </div>

            <TextField
              id="w-order"
              label="Display order"
              type="number"
              min={0}
              max={999}
              value={draft.order}
              error={errors.order}
              hint="Lower numbers appear first."
              onChange={(e) => setDraft({ ...draft, order: e.target.value })}
            />

            <div className="flex flex-col gap-4 rounded-control border border-line bg-surface-2 p-4">
              <CheckboxField
                id="w-consent"
                checked={draft.consent}
                error={errors.consent}
                onChange={(e) =>
                  setDraft({ ...draft, consent: e.target.checked })
                }
                label={
                  <>
                    <span className="font-medium text-strong">
                      Written patient consent is on file
                    </span>{" "}
                    for these images to be published on the public website. A
                    result cannot be published without this.
                  </>
                }
              />
              <CheckboxField
                id="w-sensitive"
                checked={draft.sensitive}
                onChange={(e) =>
                  setDraft({ ...draft, sensitive: e.target.checked })
                }
                label={
                  <>
                    <span className="font-medium text-strong">
                      Hide behind a warning on the website
                    </span>{" "}
                    so visitors choose to view the clinical images. Recommended
                    for graphic wounds.
                  </>
                }
              />
              <CheckboxField
                id="w-published"
                checked={draft.published}
                onChange={(e) =>
                  setDraft({ ...draft, published: e.target.checked })
                }
                label={
                  <span className="font-medium text-strong">
                    Publish on the public website
                  </span>
                }
              />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner />
                    Saving
                  </>
                ) : editingId ? (
                  "Save changes"
                ) : (
                  "Add result"
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Panel>
      ) : null}

      {cases.length === 0 ? (
        <EmptyState
          title="No before and after results yet"
          body="Add a case with a before and an after image. Nothing appears on the website until you have recorded patient consent and published it."
          action={
            <Button onClick={openCreate} size="sm">
              Add result
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {cases.map((item) => (
            <li
              key={item._id}
              className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 lg:flex-row lg:items-start lg:justify-between"
            >
              <div className="flex min-w-0 flex-1 gap-4">
                <div className="flex shrink-0 gap-2">
                  {[
                    { src: item.beforeImage, label: "Before" },
                    { src: item.afterImage, label: "After" },
                  ].map(({ src, label }) => (
                    <div key={label} className="w-16">
                      <div className="relative aspect-square overflow-hidden rounded-control border border-line bg-surface-3">
                        <SafeImage
                          src={src}
                          alt={`${item.title}, ${label.toLowerCase()}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <span className="mt-1 block text-center text-[11px] text-muted">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-[16px] font-semibold text-strong">
                      {item.title}
                    </h2>
                    <StatusBadge
                      status={item.published ? "published" : "draft"}
                    />
                    {!item.consent ? (
                      <span className="inline-flex items-center rounded-pill border border-warning bg-warning-soft px-2.5 py-1 text-[12px] font-medium text-warning">
                        No consent recorded
                      </span>
                    ) : null}
                  </div>
                  {item.summary ? (
                    <p className="mt-2 text-[14px] leading-relaxed text-body">
                      {item.summary}
                    </p>
                  ) : null}
                  <p className="mt-2 text-[13px] text-muted">
                    {item.timeframe ? `${item.timeframe} · ` : ""}
                    {item.sensitive ? "Shown behind a warning · " : ""}
                    Order {item.order} · Added {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => togglePublished(item)}
                  disabled={busyId === item._id}
                  className="h-10 rounded-control border border-line-strong px-3 text-[14px] text-strong transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
                >
                  {item.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  aria-label={`Edit result: ${item.title}`}
                  className="inline-flex size-10 items-center justify-center rounded-control border border-line-strong text-muted transition-colors hover:border-brand hover:text-brand"
                >
                  <PencilSimple size={16} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(item)}
                  aria-label={`Delete result: ${item.title}`}
                  className="inline-flex size-10 items-center justify-center rounded-control border border-line-strong text-muted transition-colors hover:border-danger hover:text-danger"
                >
                  <Trash size={16} aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        busy={deleting}
        title="Delete this result?"
        body={
          pendingDelete
            ? `"${pendingDelete.title}" and both of its images will be permanently removed. This cannot be undone.`
            : ""
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
