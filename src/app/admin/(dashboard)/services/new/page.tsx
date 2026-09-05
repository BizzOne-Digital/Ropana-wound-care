import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/primitives";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const metadata: Metadata = { title: "New service" };

export default function NewServicePage() {
  return (
    <>
      <AdminPageHeader
        title="New service"
        description="This becomes a card on the services page and its own page at /services/your-slug."
      />
      <ServiceForm />
    </>
  );
}
