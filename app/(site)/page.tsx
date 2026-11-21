import Link from "next/link";
import Pic from "@/components/Pic";
import { ProjectTile, SectionHead } from "@/components/ui";
import { parseVideo } from "@/lib/video";
import { getPhotos, getProjects, getServices, getSettings, getVideos } from "@/lib/data";

export default async function Home() {
  const [photos, projects, videos, services, settings] = await Promise.all([
    getPhotos(true), getProjects(3), getVideos(), getServices(), getSettings(),
  ]);
  const cols = [0, 1, 2].map((c) => photos.filter((_, i) => i % 3 === c).slice(0, 3));
  const reel = videos[0];
  const reelThumb = reel?.thumb?.url || (reel ? parseVideo(reel.url)?.thumb : undefined);

  return (
    <>
      {/* Hero: Noir-style staggered tiles on a cinematic dark canvas */}
      <section className="container-x grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow">Photography &amp; Video</p>
          <h1 className="h-display mt-5 text-[3.2rem] md:text-7xl xl:text-8xl">
            {settings?.heroTitle || "Frames that hold the moment."}
          </h1>
          <p className="mt-6 max-w-md text-mute">
            {settings?.heroSubtitle || "Portraits, weddings, events and brand stories, photographed first and filmed when the moment moves."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/portfolio" className="btn">See the portfolio</Link>
            <Link href="/contact" className="btn-ghost">Book a shoot</Link>
          </div>
          <ul className="mt-12 hidden gap-x-8 gap-y-2 text-sm text-paper/80 sm:grid sm:grid-cols-2">
            {["Honest frames.", "Quiet light.", "Real emotion.", "Made to keep."].map((t) => <li key={t}>↗ {t}</li>)}
          </ul>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4" aria-hidden={false}>
          {cols.map((col, ci) => (
            <div key={ci} className={`flex flex-col gap-3 md:gap-4 ${ci === 1 ? "mt-10 md:mt-16" : ci === 2 ? "mt-4 md:mt-6" : ""}`}>
              {col.length > 0
                ? col.map((p) => <div key={p._id} className="tile"><Pic img={p.img} sizes="(min-width:1024px) 16vw, 30vw" /></div>)
                : [0, 1].map((n) => <div key={n} className={`tile ${(ci + n) % 2 ? "h-56" : "h-72"} bg-[radial-gradient(110%_80%_at_40%_20%,#7a7a7a_0%,#262626_55%,#0e0e0e_100%)]`} />)}
            </div>
          ))}
        </div>
      </section>

      {/* Selected projects */}
      <section className="container-x mt-20">
        <SectionHead title="Selected stories" href="/work" label="All projects" />
        <div className="grid gap-8 md:grid-cols-3">{projects.map((p) => <ProjectTile key={p._id} p={p} />)}</div>
      </section>

      {/* Photos strip */}
      {photos.length > 0 && <section className="container-x mt-28">
        <SectionHead title="Latest frames" href="/portfolio" label="Full portfolio" />
        <div className="columns-2 gap-3 md:columns-4 md:gap-4">
          {photos.slice(0, 8).map((p) => (
            <Link key={p._id} href="/portfolio" className="tile mb-3 block break-inside-avoid md:mb-4"><Pic img={p.img} sizes="(min-width:768px) 25vw, 50vw" /></Link>
          ))}
        </div>
      </section>}

      {/* Video teaser */}
      {reel && (
        <section className="mt-28 border-y border-line bg-panel py-20">
          <div className="container-x grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="eyebrow">Motion</p>
              <h2 className="h-display mt-4 text-4xl md:text-6xl">Then we press record.</h2>
              <p className="mt-5 max-w-md text-mute">Weddings, events and brand films, edited with the same eye as the stills.</p>
              <Link href="/videos" className="btn mt-8">Watch the films</Link>
            </div>
            <Link href="/videos" className="tile aspect-video block">
              {reel.thumb ? <Pic img={reel.thumb} className="!h-full object-cover" /> : reelThumb ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={reelThumb} alt="" className="h-full w-full object-cover opacity-80" /> : null}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper text-ink"><svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 fill-current"><path d="M5 3l16 9-16 9z" /></svg></span>
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="container-x mt-28">
        <SectionHead title="What I shoot" href="/services" label="Services" />
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((s) => (
            <div key={s._id} className="rounded-2xl border border-line p-7">
              <h3 className="font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm text-mute">{s.description}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="container-x mt-28 text-center">
        <h2 className="h-display text-4xl md:text-7xl">Let&apos;s make something worth keeping.</h2>
        <Link href="/contact" className="btn mt-10">Start a conversation</Link>
      </section>
    </>
  );
}
