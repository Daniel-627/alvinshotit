import Link from "next/link";
import Pic from "./Pic";
import type { ProjectCard, PostCard } from "@/lib/types";

export function PageHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="container-x pb-12 pt-16 md:pb-16 md:pt-24">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="h-display mt-4 text-5xl md:text-7xl">{title}</h1>
      {intro && <p className="mt-6 max-w-xl text-mute">{intro}</p>}
    </section>
  );
}

export function SectionHead({ title, href, label = "View all" }: { title: string; href?: string; label?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <h2 className="h-display text-3xl md:text-4xl">{title}</h2>
      {href && <Link href={href} className="text-sm text-mute transition hover:text-paper">{label} →</Link>}
    </div>
  );
}

export function ProjectTile({ p }: { p: ProjectCard }) {
  return (
    <Link href={`/work/${p.slug}`} className="group block">
      <div className="tile aspect-[4/5]">
        <Pic img={p.cover} className="!h-full object-cover" sizes="(min-width:1024px) 33vw, 100vw" />
      </div>
      <p className="eyebrow mt-4">{[p.category, p.date?.slice(0, 4)].filter(Boolean).join(" · ")}</p>
      <h3 className="mt-1 font-display text-2xl">{p.title}</h3>
    </Link>
  );
}

export function PostTile({ p }: { p: PostCard }) {
  return (
    <Link href={`/journal/${p.slug}`} className="group block">
      {p.cover && <div className="tile aspect-[3/2]"><Pic img={p.cover} className="!h-full object-cover" sizes="(min-width:768px) 50vw, 100vw" /></div>}
      <p className="eyebrow mt-4">{p.publishedAt && new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
      <h3 className="mt-1 font-display text-2xl">{p.title}</h3>
      {p.excerpt && <p className="mt-2 text-sm text-mute">{p.excerpt}</p>}
    </Link>
  );
}
