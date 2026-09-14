"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/admin/primitives";
import { ErrorNotice, Spinner } from "@/components/ui/States";
import { apiRequest } from "@/lib/client-api";
import { formatDateTime, TIME_WINDOW_LABELS } from "@/lib/format";
import type { AdminBooking } from "@/lib/admin-data";

type Props = {
  /** The row that was opened, or null when the dialog is closed. */
  booking: AdminBooking | null;
  onClose: () => void;
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-3 last:border-b-0 sm:flex-row sm:gap-4">
      <dt className="shrink-0 text-[13px] text-muted sm:w-36">{label}</dt>
      <dd className="min-w-0 text-[14px] leading-relaxed text-body">{children}</dd>
    </div>
  );
}

/**
 * Full detail view for one booking request. The row already in memory renders
 * immediately, then the record is re-read from /api/bookings/:id so the admin
 * always sees the current database state rather than a stale list snapshot.
 */
export function BookingDetailDialog({ booking, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [record, setRecord] = useState<AdminBooking | null>(booking);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const open = booking !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    setRecord(booking);
    setLoadError("");
    if (!booking) return;

    let active = true;
    setLoading(true);
    apiRequest<AdminBooking>(`/api/bookings/${booking._id}`).then((result) => {
      if (!active) return;
      setLoading(false);
      if (result.ok) setRecord(result.data);
      else setLoadError(result.error);
    });

    return () => {
      active = false;
    };
  }, [booking]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby="booking-detail-title"
      className="w-[min(34rem,calc(100vw-2rem))] rounded-card border border-line bg-surface p-0 text-body backdrop:bg-black/45"
    >
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="booking-detail-title" className="text-lg">
            Booking request
          </h2>
          {record ? <StatusBadge status={record.status} /> : null}
          {loading ? <Spinner /> : null}
        </div>

        {loadError ? (
          <div className="mt-4">
            <ErrorNotice body={loadError} />
          </div>
        ) : null}

        {record ? (
          <dl className="mt-4">
            <Row label="Full name">{record.name}</Row>
            <Row label="Email">
              <a
                href={`mailto:${record.email}`}
                className="break-all text-brand hover:underline"
              >
                {record.email}
              </a>
            </Row>
            <Row label="Phone">
              <a
                href={`tel:${record.phone.replace(/\D/g, "")}`}
                className="text-brand hover:underline"
              >
                {record.phone}
              </a>
            </Row>
            <Row label="Service">{record.service}</Row>
            <Row label="Preferred date">{record.preferredDate}</Row>
            <Row label="Preferred time">
              {TIME_WINDOW_LABELS[record.preferredTime] ?? record.preferredTime}
            </Row>
            <Row label="Message">
              {record.message ? (
                <span className="whitespace-pre-wrap">{record.message}</span>
              ) : (
                <span className="text-muted">None provided</span>
              )}
            </Row>
            <Row label="Submitted">{formatDateTime(record.createdAt)}</Row>
          </dl>
        ) : null}

        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </dialog>
  );
}
