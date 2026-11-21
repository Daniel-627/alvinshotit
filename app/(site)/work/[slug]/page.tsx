import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import Pic from "@/components/Pic";
import Gallery from "@/components/Gallery";
import { getProject } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).slug);
  return p ? { title: p.title, description: p.summary, openGraph: { images: [p.cover.url] } } : {};
}

export default async function ProjectPage({ params }: Props) {
  const p = await getProject((await params).slug);
  if (!p) notFound();
  const photos = p.gallery.map((img, i) => ({ _id: `${p._id}-${i}`, img }));

  return (
    <>
      <section className="container-x pt-16 md:pt-24">
        <p className="eyebrow">{[p.category, p.client].filter(Boolean).join(" · ")}</p>
        <h1 className="h-display mt-4 text-5xl md:text-8xl">{p.title}</h1>
        <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-3 text-sm">
          {p.date && <div><dt className="eyebrow">Date</dt><dd className="mt-1">{new Date(p.date).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</dd></div>}
          {p.location && <div><dt className="eyebrow">Location</dt><dd className="mt-1">{p.location}</dd></div>}
          {p.client && <div><dt className="eyebrow">Client</dt><dd className="mt-1">{p.client}</dd></div>}
        </dl>
      </section>
      <section className="container-x mt-12"><div className="tile"><Pic img={p.cover} priority sizes="100vw" /></div></section>
      {(p.summary || p.story) && (
        <section className="container-x mt-16 grid gap-10 md:grid-cols-[1fr_2fr]">
          <p className="eyebrow">The story</p>
          <div className="prose-asi max-w-2xl">
            {p.story ? <PortableText value={p.story} /> : <p>{p.summary}</p>}
          </div>
        </section>
      )}
      <section className="container-x mt-16"><Gallery photos={photos} categories={[]} /></section>
    </>
  );
}
