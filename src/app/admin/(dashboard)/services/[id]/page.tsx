import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/primitives";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { ErrorNotice } from "@/components/ui/States";
import { getServiceById } from "@/lib/admin-data";
import type { AdminService } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Edit service" };

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;

  if (!/^[a-f\d]{24}$/i.test(id)) notFound();

  let service: AdminService | null = null;
  let loadError = false;

  try {
    service = await getServiceById(id);
  } catch (error) {
    console.error("[admin.services.edit]", error);
    loadError = true;
  }

  if (loadError) {
    return (
      <>
        <AdminPageHeader title="Edit service" />
        <ErrorNotice body="We could not reach the database. Check MONGODB_URI and your MongoDB Atlas network access list." />
      </>
    );
  }

  if (!service) notFound();

  return (
    <>
      <AdminPageHeader
        title="Edit service"
        description={`Public address: /services/${service.slug}`}
      />
      <ServiceForm service={service} />
    </>
  );
}
