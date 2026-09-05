import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/primitives";
import { FaqsManager } from "@/components/admin/FaqsManager";
import { ErrorNotice } from "@/components/ui/States";
import { listFaqs } from "@/lib/admin-data";
import type { AdminFaq } from "@/lib/admin-data";

export const metadata: Metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  let faqs: AdminFaq[] = [];
  let loadError = false;

  try {
    faqs = await listFaqs();
  } catch (error) {
    console.error("[admin.faqs]", error);
    loadError = true;
  }

  return (
    <>
      <AdminPageHeader
        title="Questions and answers"
        description="These appear on the FAQ page and in the homepage FAQ section, in the order shown here."
      />
      {loadError ? (
        <ErrorNotice body="We could not reach the database. Check MONGODB_URI and your MongoDB Atlas network access list." />
      ) : (
        <FaqsManager faqs={faqs} />
      )}
    </>
  );
}
