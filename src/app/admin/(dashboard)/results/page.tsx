import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/primitives";
import { WoundCasesManager } from "@/components/admin/WoundCasesManager";
import { ErrorNotice } from "@/components/ui/States";
import { listWoundCases } from "@/lib/admin-data";
import type { AdminWoundCase } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Before & After" };

export default async function AdminResultsPage() {
  let cases: AdminWoundCase[] = [];
  let loadError = false;

  try {
    cases = await listWoundCases();
  } catch (error) {
    console.error("[admin.results]", error);
    loadError = true;
  }

  return (
    <>
      <AdminPageHeader
        title="Before & After"
        description="Upload before and after wound images. A result is only published once you have confirmed written patient consent, and nothing appears on the website until it is published."
      />
      {loadError ? (
        <ErrorNotice body="We could not reach the database. Check MONGODB_URI and your MongoDB Atlas network access list." />
      ) : (
        <WoundCasesManager cases={cases} />
      )}
    </>
  );
}
