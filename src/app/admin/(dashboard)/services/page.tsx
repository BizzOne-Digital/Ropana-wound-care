import type { Metadata } from "next";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/primitives";
import { ServicesList } from "@/components/admin/ServicesList";
import { ErrorNotice } from "@/components/ui/States";
import { listServices } from "@/lib/admin-data";
import type { AdminService } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  let services: AdminService[] = [];
  let loadError = false;

  try {
    services = await listServices();
  } catch (error) {
    console.error("[admin.services]", error);
    loadError = true;
  }

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="Published services appear on the website services page, the homepage grid and the booking form."
        action={
          <ButtonLink href="/admin/services/new">
            <Plus size={16} aria-hidden />
            New service
          </ButtonLink>
        }
      />
      {loadError ? (
        <ErrorNotice body="We could not reach the database. Check MONGODB_URI and your MongoDB Atlas network access list." />
      ) : (
        <ServicesList services={services} />
      )}
    </>
  );
}
