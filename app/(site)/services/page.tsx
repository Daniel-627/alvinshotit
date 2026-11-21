import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/ui";
import { getServices } from "@/lib/data";

export const metadata: Metadata = { title: "Services" };

export default async function Services() {
  const services = await getServices();
  return (
    <>
      <PageHead eyebrow="Services" title="How we can work together." intro="Every shoot is tailored. These are starting points, so tell me what you have in mind." />
      <div className="container-x grid gap-4 md:grid-cols-3">
        {services.map((s) => (
          <div key={s._id} className="flex flex-col rounded-2xl border border-line p-8">
            <h2 className="font-display text-3xl">{s.title}</h2>
            {s.startingFrom && <p className="eyebrow mt-3">{s.startingFrom}</p>}
            <p className="mt-4 text-sm text-mute">{s.description}</p>
            <ul className="mt-6 space-y-2 text-sm text-paper/80">{s.includes?.map((i) => <li key={i}>↗ {i}</li>)}</ul>
            <Link href={`/contact?service=${encodeURIComponent(s.title)}`} className="btn-ghost mt-8 self-start">Enquire</Link>
          </div>
        ))}
      </div>
    </>
  );
}
