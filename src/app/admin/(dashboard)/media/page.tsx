import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/primitives";
import { MediaManager } from "@/components/admin/MediaManager";
import { ErrorNotice } from "@/components/ui/States";
import { listSettings } from "@/lib/admin-data";
import type { AdminSetting } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Media" };

export default async function AdminMediaPage() {
  let settings: AdminSetting[] = [];
  let loadError = false;

  try {
    settings = await listSettings();
  } catch (error) {
    console.error("[admin.media]", error);
    loadError = true;
  }

  return (
    <>
      <AdminPageHeader
        title="Site imagery"
        description="Replace the logo and the main photographs used across the public website. Changes go live as soon as an image is saved."
      />
      {loadError ? (
        <ErrorNotice body="We could not reach the database. Check MONGODB_URI and your MongoDB Atlas network access list." />
      ) : (
        <MediaManager settings={settings} />
      )}
    </>
  );
}
