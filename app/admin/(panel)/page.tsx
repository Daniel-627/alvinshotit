import Link from "next/link";
import { counts } from "@/lib/admin-data";
import { adminReady } from "@/lib/sanity-admin";
import { LIST_KEYS, TYPES } from "@/lib/admin-schema";

export default async function Dashboard() {
  const c = adminReady() ? await counts().catch(() => null) : null;
  return (
    <>
      <h1 className="h-display text-4xl">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {LIST_KEYS.map((k) => (
          <Link key={k} href={`/admin/${k}`} className="rounded-2xl border border-line p-6 transition hover:border-paper">
            <p className="eyebrow">{TYPES[k].plural}</p>
            <p className="mt-3 font-display text-5xl">{c ? c[k] : "–"}</p>
            <p className="mt-4 text-sm text-mute">Manage →</p>
          </Link>
        ))}
        <Link href="/admin/settings" className="rounded-2xl border border-line p-6 transition hover:border-paper">
          <p className="eyebrow">Site settings</p>
          <p className="mt-3 font-display text-2xl">Headline, about, contact</p>
          <p className="mt-4 text-sm text-mute">Edit →</p>
        </Link>
      </div>
      <p className="mt-10 max-w-xl text-sm text-mute">Changes go live on the website as soon as you save.</p>
    </>
  );
}
