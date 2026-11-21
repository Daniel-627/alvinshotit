import type { Metadata } from "next";
import Link from "next/link";
import { PortableText } from "next-sanity";
import Pic from "@/components/Pic";
import { PageHead } from "@/components/ui";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

export default async function About() {
  const s = await getSettings();
  return (
    <>
      <PageHead eyebrow="About" title="Hello, I'm Alvin." />
      <section className="container-x grid gap-12 md:grid-cols-[1fr_1.2fr]">
        {s?.aboutPortrait ? <div className="tile"><Pic img={s.aboutPortrait} sizes="(min-width:768px) 40vw, 100vw" priority /></div> : <div className="tile aspect-[4/5]" />}
        <div className="prose-asi max-w-xl">
          {s?.aboutBody ? <PortableText value={s.aboutBody} /> : (
            <>
              <p>I&apos;m a photographer and videographer who believes the best images are quiet ones: honest light, real emotion, nothing staged for show.</p>
              <p>I shoot portraits, weddings, events and brand stories, photography first, with film when the moment calls for motion. Add your own story in Sanity Studio under Site settings.</p>
            </>
          )}
          <Link href="/contact" className="btn mt-4">Work with me</Link>
        </div>
      </section>
    </>
  );
}
