import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/admin/Toast";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Ropana Dashboard" },
  robots: { index: false, follow: false },
};

// The dashboard always reflects live database state.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already redirects unauthenticated visitors. This is the
  // server-side backstop, so no admin page can render without a session.
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <ToastProvider>
      <AdminShell user={{ name: session.name, email: session.email }}>
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
