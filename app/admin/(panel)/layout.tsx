import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { adminReady } from "@/lib/sanity-admin";
import { logout } from "../login/actions";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/settings", label: "Site settings" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const ready = adminReady();
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-line p-5 md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <Link href="/admin"><Image src="/logo-full.png" alt="Alvin Shot It admin" width={980} height={320} className="h-9 w-auto" /></Link>
        <nav className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm md:flex-col md:gap-1" aria-label="Admin">
          {nav.map((n) => <Link key={n.href} href={n.href} className="rounded-lg py-1.5 text-paper/80 hover:text-white md:px-3 md:hover:bg-panel">{n.label}</Link>)}
        </nav>
        <div className="mt-5 flex gap-4 text-xs text-mute md:mt-10 md:flex-col md:gap-2">
          <a href="/" target="_blank" rel="noreferrer" className="hover:text-paper">View site ↗</a>
          <form action={logout}><button className="hover:text-paper">Sign out</button></form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 md:p-10">
        {!ready && (
          <div role="alert" className="mb-8 rounded-xl border border-line bg-panel p-5 text-sm">
            <p className="font-medium">Sanity isn&apos;t connected yet.</p>
            <p className="mt-1 text-mute">Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>SANITY_WRITE_TOKEN</code> in your environment, then restart. Saving is disabled until then.</p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
