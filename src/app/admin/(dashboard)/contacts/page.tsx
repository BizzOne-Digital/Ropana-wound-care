import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/primitives";
import { ContactsManager } from "@/components/admin/ContactsManager";
import { ErrorNotice } from "@/components/ui/States";
import { listContacts } from "@/lib/admin-data";
import type { AdminContact } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Contacts" };

export default async function AdminContactsPage() {
  let contacts: AdminContact[] = [];
  let loadError = false;

  try {
    contacts = await listContacts();
  } catch (error) {
    console.error("[admin.contacts]", error);
    loadError = true;
  }

  return (
    <>
      <AdminPageHeader
        title="Contact submissions"
        description="Messages sent through the website contact form. Mark each one as you work through it."
      />
      {loadError ? (
        <ErrorNotice body="We could not reach the database. Check MONGODB_URI and your MongoDB Atlas network access list." />
      ) : (
        <ContactsManager contacts={contacts} />
      )}
    </>
  );
}
