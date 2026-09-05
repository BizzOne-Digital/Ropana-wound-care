import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import {
  AdminPageHeader,
  Panel,
  StatCard,
  StatusBadge,
} from "@/components/admin/primitives";
import { ErrorNotice, EmptyState } from "@/components/ui/States";
import { formatDate } from "@/lib/format";
import { getDashboardStats, listBookings, listContacts } from "@/lib/admin-data";
import type { AdminBooking, AdminContact, DashboardStats } from "@/lib/admin-data";

export default async function AdminOverviewPage() {
  let stats: DashboardStats | null = null;
  let bookings: AdminBooking[] = [];
  let contacts: AdminContact[] = [];
  let loadError = false;

  try {
    [stats, bookings, contacts] = await Promise.all([
      getDashboardStats(),
      listBookings(),
      listContacts(),
    ]);
  } catch (error) {
    console.error("[admin.overview]", error);
    loadError = true;
  }

  if (loadError || !stats) {
    return (
      <>
        <AdminPageHeader title="Overview" />
        <ErrorNotice body="We could not reach the database. Check that MONGODB_URI is set correctly and that this server's IP is allowed in MongoDB Atlas." />
      </>
    );
  }

  const recentBookings = bookings.slice(0, 5);
  const recentContacts = contacts.slice(0, 5);

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="Everything waiting on you, and what is currently live on the public website."
      />

      <section aria-labelledby="needs-attention">
        <h2
          id="needs-attention"
          className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-body"
        >
          Needs attention
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Pending booking requests"
            value={stats.bookingsPending}
            detail={`${stats.bookingsTotal} requests in total`}
            emphasis={stats.bookingsPending > 0}
          />
          <StatCard
            label="New contact submissions"
            value={stats.contactsNew}
            detail={`${stats.contactsTotal} submissions in total`}
            emphasis={stats.contactsNew > 0}
          />
        </div>
      </section>

      <section aria-labelledby="live-now" className="mt-10">
        <h2
          id="live-now"
          className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-body"
        >
          Live on the website
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Published services"
            value={stats.servicesPublished}
            detail={`${stats.servicesTotal} created`}
          />
          <StatCard
            label="Published testimonials"
            value={stats.testimonialsPublished}
            detail={`${stats.testimonialsTotal} created`}
          />
          <StatCard
            label="Published FAQs"
            value={stats.faqsPublished}
            detail={`${stats.faqsTotal} created`}
          />
          <StatCard
            label="Published results"
            value={stats.resultsPublished}
            detail={`${stats.resultsTotal} created`}
          />
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-lg">Latest booking requests</h2>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-brand hover:text-brand-hover"
            >
              All <ArrowRight size={14} aria-hidden />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <EmptyState
              className="mt-5 py-10"
              title="No booking requests yet"
              body="Requests submitted through the website booking form will appear here."
            />
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {recentBookings.map((b) => (
                <li key={b._id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-strong">
                      {b.name}
                    </p>
                    <p className="truncate text-[13px] text-muted">
                      {b.service} &middot; {b.preferredDate}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-lg">Latest contact messages</h2>
            <Link
              href="/admin/contacts"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-brand hover:text-brand-hover"
            >
              All <ArrowRight size={14} aria-hidden />
            </Link>
          </div>

          {recentContacts.length === 0 ? (
            <EmptyState
              className="mt-5 py-10"
              title="No messages yet"
              body="Messages sent through the website contact form will appear here."
            />
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {recentContacts.map((c) => (
                <li key={c._id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-strong">
                      {c.name}
                    </p>
                    <p className="truncate text-[13px] text-muted">
                      {formatDate(c.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
