"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PencilSimple, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { EmptyState, Spinner } from "@/components/ui/States";
import { Rating } from "@/components/ui/Rating";
import { ConfirmDialog } from "@/components/admin/Confirm";
import { Panel, StatusBadge } from "@/components/admin/primitives";
import { useToast } from "@/components/admin/Toast";
import { apiRequest } from "@/lib/client-api";
import { formatDate } from "@/lib/format";
import type { AdminTestimonial } from "@/lib/admin-data";

type Draft = {
  name: string;
  content: string;
  rating: string;
  location: string;
  published: boolean;
};

const emptyDraft: Draft = {
  name: "",
  content: "",
  rating: "",
  location: "",
  published: false,
};

export function TestimonialsManager({
  testimonials,
}: {
  testimonials: AdminTestimonial[];
}) {
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
  const [pendingDelete, setPendingDelete] =
    useState<AdminTestimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setErrors({});
    setFormError("");
    setShowForm(true);
  }

  function openEdit(t: AdminTestimonial) {
    setEditingId(t._id);
    setDraft({
      name: t.name,
      content: t.content,
      rating: t.rating ? String(t.rating) : "",
      location: t.location,
      published: t.published,
    });
    setErrors({});
    setFormError("");
    setShowForm(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setErrors({});
    setFormError("");

    const payload = {
      name: draft.name,
      content: draft.content,
      rating: draft.rating ? Number(draft.rating) : null,
      location: draft.location,
      published: draft.published,
    };

    const result = editingId
      ? await apiRequest(`/api/testimonials/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : await apiRequest("/api/testimonials", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    setSaving(false);

    if (!result.ok) {
      setErrors(result.fields ?? {});
      setFormError(result.error);
      return;
    }

    notify(editingId ? "Testimonial updated." : "Testimonial added.");
    setShowForm(false);
    setDraft(emptyDraft);
    setEditingId(null);
    startTransition(() => router.refresh());
  }

  async function togglePublished(t: AdminTestimonial) {
    setBusyId(t._id);
    const result = await apiRequest(`/api/testimonials/${t._id}`, {
      method: "PATCH",
      body: JSON.stringify({ published: !t.published }),
    });
    setBusyId(null);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    notify(t.published ? "Testimonial unpublished." : "Testimonial published.");
    startTransition(() => router.refresh());
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const result = await apiRequest(`/api/testimonials/${pendingDelete._id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setPendingDelete(null);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    notify("Testimonial deleted.");
    startTransition(() => router.refresh());
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={openCreate}>
          <Plus size={16} aria-hidden />
          Add testimonial
        </Button>
      </div>

      {showForm ? (
        <Panel className="mb-6">
          <h2 className="text-lg">
            {editingId ? "Edit testimonial" : "New testimonial"}
          </h2>
          <p className="mt-1 text-[14px] text-body">
            Only publish feedback a patient has given you permission to share.
            Use a first name or initials rather than full patient identifiers.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
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
                id="t-name"
                label="Display name"
                required
                value={draft.name}
                error={errors.name}
                hint="For example: Maria R."
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
              <TextField
                id="t-location"
                label="Location"
                value={draft.location}
                error={errors.location}
                hint="Optional. For example: Arlington, TX"
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              />
            </div>

            <TextAreaField
              id="t-content"
              label="Testimonial"
              required
              rows={4}
              value={draft.content}
              error={errors.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                id="t-rating"
                label="Rating"
                value={draft.rating}
                error={errors.rating}
                hint="Optional."
                onChange={(e) => setDraft({ ...draft, rating: e.target.value })}
              >
                <option value="">No rating</option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} out of 5
                  </option>
                ))}
              </SelectField>

              <div className="flex items-center gap-3 pb-2 sm:pt-8">
                <input
                  id="t-published"
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) =>
                    setDraft({ ...draft, published: e.target.checked })
                  }
                  className="size-4 accent-[var(--brand)]"
                />
                <label htmlFor="t-published" className="text-[15px] text-strong">
                  Publish on the public website
                </label>
              </div>
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
                  "Add testimonial"
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

      {testimonials.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          body="Add feedback a patient has given you permission to share. Nothing appears on the public site until you publish it."
          action={<Button onClick={openCreate} size="sm">Add testimonial</Button>}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {testimonials.map((t) => (
            <li
              key={t._id}
              className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 lg:flex-row lg:items-start lg:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-[16px] font-semibold text-strong">
                    {t.name}
                  </h2>
                  <StatusBadge status={t.published ? "published" : "draft"} />
                  <Rating value={t.rating} />
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-body">
                  {t.content}
                </p>
                <p className="mt-2 text-[13px] text-muted">
                  {t.location ? `${t.location} · ` : ""}
                  Added {formatDate(t.createdAt)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => togglePublished(t)}
                  disabled={busyId === t._id}
                  className="h-10 rounded-control border border-line-strong px-3 text-[14px] text-strong transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
                >
                  {t.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(t)}
                  aria-label={`Edit testimonial from ${t.name}`}
                  className="inline-flex size-10 items-center justify-center rounded-control border border-line-strong text-muted transition-colors hover:border-brand hover:text-brand"
                >
                  <PencilSimple size={16} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(t)}
                  aria-label={`Delete testimonial from ${t.name}`}
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
        title="Delete this testimonial?"
        body={
          pendingDelete
            ? `The testimonial from ${pendingDelete.name} will be permanently removed. This cannot be undone.`
            : ""
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
