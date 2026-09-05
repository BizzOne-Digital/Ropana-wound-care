"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  PencilSimple,
  Plus,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { EmptyState, Spinner } from "@/components/ui/States";
import { ConfirmDialog } from "@/components/admin/Confirm";
import { Panel, StatusBadge } from "@/components/admin/primitives";
import { useToast } from "@/components/admin/Toast";
import { apiRequest } from "@/lib/client-api";
import type { AdminFaq } from "@/lib/admin-data";

type Draft = { question: string; answer: string; published: boolean };
const emptyDraft: Draft = { question: "", answer: "", published: true };

export function FaqsManager({ faqs }: { faqs: AdminFaq[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [, startTransition] = useTransition();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminFaq | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setErrors({});
    setFormError("");
    setShowForm(true);
  }

  function openEdit(faq: AdminFaq) {
    setEditingId(faq._id);
    setDraft({
      question: faq.question,
      answer: faq.answer,
      published: faq.published,
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

    // New questions go to the end of the list.
    const order = editingId
      ? undefined
      : faqs.reduce((max, f) => Math.max(max, f.order), -1) + 1;

    const payload = { ...draft, ...(order === undefined ? {} : { order }) };

    const result = editingId
      ? await apiRequest(`/api/faqs/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : await apiRequest("/api/faqs", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    setSaving(false);

    if (!result.ok) {
      setErrors(result.fields ?? {});
      setFormError(result.error);
      return;
    }

    notify(editingId ? "Question updated." : "Question added.");
    setShowForm(false);
    setEditingId(null);
    setDraft(emptyDraft);
    startTransition(() => router.refresh());
  }

  async function togglePublished(faq: AdminFaq) {
    setBusyId(faq._id);
    const result = await apiRequest(`/api/faqs/${faq._id}`, {
      method: "PATCH",
      body: JSON.stringify({ published: !faq.published }),
    });
    setBusyId(null);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    notify(faq.published ? "Question unpublished." : "Question published.");
    startTransition(() => router.refresh());
  }

  /** Swap sort order with the neighbouring question. */
  async function move(index: number, direction: -1 | 1) {
    const current = faqs[index];
    const neighbour = faqs[index + direction];
    if (!current || !neighbour) return;

    setBusyId(current._id);
    const results = await Promise.all([
      apiRequest(`/api/faqs/${current._id}`, {
        method: "PATCH",
        body: JSON.stringify({ order: neighbour.order }),
      }),
      apiRequest(`/api/faqs/${neighbour._id}`, {
        method: "PATCH",
        body: JSON.stringify({ order: current.order }),
      }),
    ]);
    setBusyId(null);

    const failed = results.find((r) => !r.ok);
    if (failed && !failed.ok) {
      notify(failed.error, "error");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const result = await apiRequest(`/api/faqs/${pendingDelete._id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setPendingDelete(null);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    notify("Question deleted.");
    startTransition(() => router.refresh());
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={openCreate}>
          <Plus size={16} aria-hidden />
          Add question
        </Button>
      </div>

      {showForm ? (
        <Panel className="mb-6">
          <h2 className="text-lg">
            {editingId ? "Edit question" : "New question"}
          </h2>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
            {formError ? (
              <div
                role="alert"
                className="rounded-control border border-danger bg-danger-soft px-4 py-3 text-[14px] text-strong"
              >
                {formError}
              </div>
            ) : null}

            <TextField
              id="f-question"
              label="Question"
              required
              value={draft.question}
              error={errors.question}
              onChange={(e) => setDraft({ ...draft, question: e.target.value })}
            />

            <TextAreaField
              id="f-answer"
              label="Answer"
              required
              rows={5}
              value={draft.answer}
              error={errors.answer}
              hint="Separate paragraphs with a line break."
              onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
            />

            <div className="flex items-center gap-3">
              <input
                id="f-published"
                type="checkbox"
                checked={draft.published}
                onChange={(e) =>
                  setDraft({ ...draft, published: e.target.checked })
                }
                className="size-4 accent-[var(--brand)]"
              />
              <label htmlFor="f-published" className="text-[15px] text-strong">
                Publish on the public website
              </label>
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
                  "Add question"
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

      {faqs.length === 0 ? (
        <EmptyState
          title="No questions yet"
          body="Questions you publish here appear on the FAQ page and in the homepage FAQ section."
          action={<Button onClick={openCreate} size="sm">Add question</Button>}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <li
              key={faq._id}
              className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 lg:flex-row lg:items-start lg:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-[16px] font-semibold text-strong">
                    {faq.question}
                  </h2>
                  <StatusBadge status={faq.published ? "published" : "draft"} />
                </div>
                <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-body">
                  {faq.answer}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || busyId === faq._id}
                  aria-label={`Move "${faq.question}" up`}
                  className="inline-flex size-10 items-center justify-center rounded-control border border-line-strong text-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-40"
                >
                  <ArrowUp size={15} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === faqs.length - 1 || busyId === faq._id}
                  aria-label={`Move "${faq.question}" down`}
                  className="inline-flex size-10 items-center justify-center rounded-control border border-line-strong text-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-40"
                >
                  <ArrowDown size={15} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => togglePublished(faq)}
                  disabled={busyId === faq._id}
                  className="h-10 rounded-control border border-line-strong px-3 text-[14px] text-strong transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
                >
                  {faq.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(faq)}
                  aria-label={`Edit "${faq.question}"`}
                  className="inline-flex size-10 items-center justify-center rounded-control border border-line-strong text-muted transition-colors hover:border-brand hover:text-brand"
                >
                  <PencilSimple size={16} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(faq)}
                  aria-label={`Delete "${faq.question}"`}
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
        title="Delete this question?"
        body={
          pendingDelete
            ? `"${pendingDelete.question}" will be permanently removed from the website. This cannot be undone.`
            : ""
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
