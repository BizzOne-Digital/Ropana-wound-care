"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { EmptyState } from "@/components/ui/States";
import { ConfirmDialog } from "@/components/admin/Confirm";
import { StatusBadge } from "@/components/admin/primitives";
import { useToast } from "@/components/admin/Toast";
import { apiRequest } from "@/lib/client-api";
import type { AdminService } from "@/lib/admin-data";

export function ServicesList({ services }: { services: AdminService[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [, startTransition] = useTransition();

  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminService | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function togglePublished(service: AdminService) {
    setBusyId(service._id);
    const result = await apiRequest(`/api/services/${service._id}`, {
      method: "PATCH",
      body: JSON.stringify({ published: !service.published }),
    });
    setBusyId(null);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    notify(service.published ? "Service unpublished." : "Service published.");
    startTransition(() => router.refresh());
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const result = await apiRequest(`/api/services/${pendingDelete._id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setPendingDelete(null);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    notify("Service deleted.");
    startTransition(() => router.refresh());
  }

  if (services.length === 0) {
    return (
      <EmptyState
        title="No services created yet"
        body="Services you create here appear on the public website's services page and in the homepage grid."
        action={
          <ButtonLink href="/admin/services/new" size="sm">
            Create the first service
          </ButtonLink>
        }
      />
    );
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {services.map((service) => (
          <li
            key={service._id}
            className="flex flex-col gap-4 rounded-card border border-line bg-surface p-4 sm:flex-row sm:items-center"
          >
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-control bg-surface-3 sm:w-32">
              {service.image ? (
                <SafeImage
                  src={service.image}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-[12px] text-muted">
                  No image
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[16px] font-semibold text-strong">
                  {service.title}
                </h2>
                <StatusBadge status={service.published ? "published" : "draft"} />
                <span className="text-[13px] text-muted">
                  Order {service.order}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-[14px] text-body">
                {service.shortDescription}
              </p>
              <p className="mt-1 text-[13px] text-muted">/services/{service.slug}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => togglePublished(service)}
                disabled={busyId === service._id}
                className="h-10 rounded-control border border-line-strong px-3 text-[14px] text-strong transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
              >
                {service.published ? "Unpublish" : "Publish"}
              </button>

              <Link
                href={`/admin/services/${service._id}`}
                aria-label={`Edit ${service.title}`}
                className="inline-flex size-10 items-center justify-center rounded-control border border-line-strong text-muted transition-colors hover:border-brand hover:text-brand"
              >
                <PencilSimple size={16} aria-hidden />
              </Link>

              <button
                type="button"
                onClick={() => setPendingDelete(service)}
                aria-label={`Delete ${service.title}`}
                className="inline-flex size-10 items-center justify-center rounded-control border border-line-strong text-muted transition-colors hover:border-danger hover:text-danger"
              >
                <Trash size={16} aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={pendingDelete !== null}
        busy={deleting}
        title="Delete this service?"
        body={
          pendingDelete
            ? `"${pendingDelete.title}" and its image will be permanently removed, and /services/${pendingDelete.slug} will stop working. This cannot be undone.`
            : ""
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
