"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/work", label: "Projects" },
  { href: "/videos", label: "Videos" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/80 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label="Alvin Shot It, home">
          <Image src="/logo-full.png" alt="Alvin Shot It Photography & Video" width={980} height={320} className="h-9 w-auto md:h-11" priority />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`text-sm transition hover:text-white ${path.startsWith(l.href) ? "text-white" : "text-mute"}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn !py-2">Book a shoot</Link>
        </nav>
        <button className="lg:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span className="block h-px w-7 bg-paper" />
          <span className="mt-2 block h-px w-7 bg-paper" />
        </button>
      </div>
      {open && (
        <nav className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col gap-1 bg-ink px-5 pt-8 lg:hidden" aria-label="Mobile">
          {[...links, { href: "/contact", label: "Contact" }].map((l) => (
            <Link key={l.href} href={l.href} className="border-b border-line py-4 font-display text-3xl">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
