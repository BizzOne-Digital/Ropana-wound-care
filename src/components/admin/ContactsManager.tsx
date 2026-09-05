"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, Trash } from "@phosphor-icons/react/dist/ssr";
import { ConfirmDialog } from "@/components/admin/Confirm";
import { useToast } from "@/components/admin/Toast";
import { StatusBadge } from "@/components/admin/primitives";
import { EmptyState } from "@/components/ui/States";
import { apiRequest } from "@/lib/client-api";
import { formatDateTime } from "@/lib/format";
import { CONTACT_STATUSES } from "@/lib/validation";
import type { AdminContact } from "@/lib/admin-data";

export function ContactsManager({ contacts }: { contacts: AdminContact[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [, startTransition] = useTransition();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminContact | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!q) return true;
      return [c.name, c.email, c.phone, c.message].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [contacts, query, statusFilter]);

  async function updateStatus(id: string, status: string) {
    setBusyId(id);
    const result = await apiRequest(`/api/contact/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setBusyId(null);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    notify("Status updated.");
    startTransition(() => router.refresh());
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const result = await apiRequest(`/api/contact/${pendingDelete._id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setPendingDelete(null);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    notify("Submission deleted.");
    startTransition(() => router.refresh());
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="contact-search" className="sr-only">
            Search submissions
          </label>
          <MagnifyingGlass
            size={17}
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="contact-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone or message"
            className="h-11 w-full rounded-control border border-line-strong bg-surface pl-10 pr-3.5 text-[15px] text-strong placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="contact-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="contact-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 w-full rounded-control border border-line-strong bg-surface px-3.5 text-[15px] text-strong focus:border-brand focus:outline-none sm:w-48"
          >
            <option value="all">All statuses</option>
            {CONTACT_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={
            contacts.length === 0
              ? "No messages yet"
              : "No submissions match those filters"
          }
          body={
            contacts.length === 0
              ? "Messages sent through the website contact form appear here."
              : "Try clearing the search box or selecting a different status."
          }
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {filtered.map((contact) => (
            <li
              key={contact._id}
              className="rounded-card border border-line bg-surface p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-[16px] font-semibold text-strong">
                      {contact.name}
                    </h2>
                    <StatusBadge status={contact.status} />
                    <span className="text-[13px] text-muted">
                      {formatDateTime(contact.createdAt)}
                    </span>
                  </div>

                  <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[14px]">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-brand hover:underline"
                    >
                      {contact.email}
                    </a>
                    <a
                      href={`tel:${contact.phone.replace(/\D/g, "")}`}
                      className="text-brand hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </p>

                  <p className="mt-3 whitespace-pre-wrap rounded-control bg-surface-2 p-3 text-[14px] leading-relaxed text-body">
                    {contact.message}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <label htmlFor={`cstatus-${contact._id}`} className="sr-only">
                    Update status for {contact.name}
                  </label>
                  <select
                    id={`cstatus-${contact._id}`}
                    value={contact.status}
                    disabled={busyId === contact._id}
                    onChange={(e) => updateStatus(contact._id, e.target.value)}
                    className="h-10 rounded-control border border-line-strong bg-surface px-3 text-[14px] capitalize text-strong focus:border-brand focus:outline-none disabled:opacity-60"
                  >
                    {CONTACT_STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setPendingDelete(contact)}
                    aria-label={`Delete message from ${contact.name}`}
                    className="inline-flex size-10 items-center justify-center rounded-control border border-line-strong text-muted transition-colors hover:border-danger hover:text-danger"
                  >
                    <Trash size={16} aria-hidden />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        busy={deleting}
        title="Delete this submission?"
        body={
          pendingDelete
            ? `The message from ${pendingDelete.name} will be permanently removed. This cannot be undone.`
            : ""
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
