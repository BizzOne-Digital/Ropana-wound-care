"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, Trash } from "@phosphor-icons/react/dist/ssr";
import { ConfirmDialog } from "@/components/admin/Confirm";
import { useToast } from "@/components/admin/Toast";
import { StatusBadge } from "@/components/admin/primitives";
import { EmptyState } from "@/components/ui/States";
import { apiRequest } from "@/lib/client-api";
import { formatDate, TIME_WINDOW_LABELS } from "@/lib/format";
import { BOOKING_STATUSES } from "@/lib/validation";
import type { AdminBooking } from "@/lib/admin-data";

export function BookingsManager({ bookings }: { bookings: AdminBooking[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [, startTransition] = useTransition();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminBooking | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (!q) return true;
      return [b.name, b.email, b.phone, b.service].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [bookings, query, statusFilter]);

  async function updateStatus(id: string, status: string) {
    setBusyId(id);
    const result = await apiRequest(`/api/bookings/${id}`, {
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
    const result = await apiRequest(`/api/bookings/${pendingDelete._id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setPendingDelete(null);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    notify("Booking request deleted.");
    startTransition(() => router.refresh());
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="booking-search" className="sr-only">
            Search booking requests
          </label>
          <MagnifyingGlass
            size={17}
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="booking-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone or service"
            className="h-11 w-full rounded-control border border-line-strong bg-surface pl-10 pr-3.5 text-[15px] text-strong placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="booking-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="booking-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 w-full rounded-control border border-line-strong bg-surface px-3.5 text-[15px] text-strong focus:border-brand focus:outline-none sm:w-48"
          >
            <option value="all">All statuses</option>
            {BOOKING_STATUSES.map((s) => (
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
            bookings.length === 0
              ? "No booking requests yet"
              : "No requests match those filters"
          }
          body={
            bookings.length === 0
              ? "Requests submitted through the website booking form appear here. A request is not a confirmed appointment until you contact the patient."
              : "Try clearing the search box or selecting a different status."
          }
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {filtered.map((booking) => (
            <li
              key={booking._id}
              className="rounded-card border border-line bg-surface p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-[16px] font-semibold text-strong">
                      {booking.name}
                    </h2>
                    <StatusBadge status={booking.status} />
                  </div>

                  <dl className="mt-3 grid gap-x-8 gap-y-2 text-[14px] sm:grid-cols-2">
                    <div className="flex gap-2">
                      <dt className="text-muted">Requested</dt>
                      <dd className="text-body">
                        {booking.preferredDate},{" "}
                        {TIME_WINDOW_LABELS[booking.preferredTime] ??
                          booking.preferredTime}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-muted">Service</dt>
                      <dd className="text-body">{booking.service}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-muted">Phone</dt>
                      <dd>
                        <a
                          href={`tel:${booking.phone.replace(/\D/g, "")}`}
                          className="text-brand hover:underline"
                        >
                          {booking.phone}
                        </a>
                      </dd>
                    </div>
                    <div className="flex min-w-0 gap-2">
                      <dt className="text-muted">Email</dt>
                      <dd className="min-w-0">
                        <a
                          href={`mailto:${booking.email}`}
                          className="block truncate text-brand hover:underline"
                        >
                          {booking.email}
                        </a>
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-muted">Submitted</dt>
                      <dd className="text-body">
                        {formatDate(booking.createdAt)}
                      </dd>
                    </div>
                  </dl>

                  {booking.message ? (
                    <p className="mt-3 whitespace-pre-wrap rounded-control bg-surface-2 p-3 text-[14px] leading-relaxed text-body">
                      {booking.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <label
                    htmlFor={`status-${booking._id}`}
                    className="sr-only"
                  >
                    Update status for {booking.name}
                  </label>
                  <select
                    id={`status-${booking._id}`}
                    value={booking.status}
                    disabled={busyId === booking._id}
                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                    className="h-10 rounded-control border border-line-strong bg-surface px-3 text-[14px] capitalize text-strong focus:border-brand focus:outline-none disabled:opacity-60"
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setPendingDelete(booking)}
                    aria-label={`Delete request from ${booking.name}`}
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
        title="Delete this booking request?"
        body={
          pendingDelete
            ? `The request from ${pendingDelete.name} will be permanently removed. This cannot be undone.`
            : ""
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
