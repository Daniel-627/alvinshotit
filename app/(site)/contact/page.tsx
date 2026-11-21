import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { PageHead } from "@/components/ui";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Contact" };

export default async function Contact({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const [s, sp] = await Promise.all([getSettings(), searchParams]);
  return (
    <>
      <PageHead eyebrow="Contact" title="Book a shoot." intro="Tell me about the day, the place and the feeling you want. I reply within a day." />
      <div className="container-x grid gap-12 md:grid-cols-[1.3fr_1fr]">
        <ContactForm email={s?.email} whatsapp={s?.whatsapp} service={sp.service} />
        <div className="space-y-6 text-sm">
          {s?.location && <div><p className="eyebrow">Based in</p><p className="mt-1">{s.location}</p></div>}
          {s?.email && <div><p className="eyebrow">Email</p><a className="mt-1 block" href={`mailto:${s.email}`}>{s.email}</a></div>}
          {s?.phone && <div><p className="eyebrow">Phone</p><a className="mt-1 block" href={`tel:${s.phone}`}>{s.phone}</a></div>}
        </div>
      </div>
    </>
  );
}
