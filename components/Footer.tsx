import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/data";

export default async function Footer() {
  const s = await getSettings();
  return (
    <footer className="mt-32 border-t border-line">
      <div className="container-x grid gap-12 py-16 md:grid-cols-3">
        <div>
          <Image src="/logo-full.png" alt="Alvin Shot It" width={980} height={320} className="h-10 w-auto" />
          <p className="mt-5 max-w-xs text-sm text-mute">Photography first. Film when the moment moves.</p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2 text-paper/80">
            <li><Link href="/portfolio">Portfolio</Link></li>
            <li><Link href="/videos">Videos</Link></li>
            <li><Link href="/services">Services</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-4">Say hello</p>
          <ul className="space-y-2 text-paper/80">
            {s?.email && <li><a href={`mailto:${s.email}`}>{s.email}</a></li>}
            {s?.whatsapp && <li><a href={`https://wa.me/${s.whatsapp}`}>WhatsApp</a></li>}
            {s?.instagram && <li><a href={s.instagram}>Instagram</a></li>}
            {s?.youtube && <li><a href={s.youtube}>YouTube</a></li>}
            {s?.tiktok && <li><a href={s.tiktok}>TikTok</a></li>}
            {!s && <li><Link href="/contact">Contact</Link></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-mute">© {new Date().getFullYear()} Alvin Shot It. All rights reserved.</div>
    </footer>
  );
}
