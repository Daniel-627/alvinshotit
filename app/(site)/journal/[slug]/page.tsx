import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import Pic from "@/components/Pic";
import { getPost } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost((await params).slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

export default async function PostPage({ params }: Props) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  return (
    <article className="container-x max-w-3xl pt-16 md:pt-24">
      <p className="eyebrow">{p.publishedAt && new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
      <h1 className="h-display mt-4 text-4xl md:text-6xl">{p.title}</h1>
      {p.cover && <div className="tile mt-10"><Pic img={p.cover} priority sizes="100vw" /></div>}
      <div className="prose-asi mt-10">{p.body && <PortableText value={p.body} />}</div>
    </article>
  );
}
