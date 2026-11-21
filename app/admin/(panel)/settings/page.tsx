import DocForm from "@/components/admin/DocForm";
import { getSingleton } from "@/lib/admin-data";
import { adminReady } from "@/lib/sanity-admin";

export default async function SettingsPage() {
  const initial = adminReady() ? await getSingleton("settings") : { _id: "siteSettings" };
  return (
    <>
      <h1 className="h-display mb-10 text-4xl">Site settings</h1>
      <DocForm typeKey="settings" id="siteSettings" initial={initial} options={{}} />
    </>
  );
}
