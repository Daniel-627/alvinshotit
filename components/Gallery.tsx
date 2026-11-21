"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Pic from "./Pic";
import type { Category, Photo } from "@/lib/types";

export default function Gallery({ photos, categories }: { photos: Photo[]; categories: Category[] }) {
  const [active, setActive] = useState("all");
  const [open, setOpen] = useState<number | null>(null);

  const shown = useMemo(() => (active === "all" ? photos : photos.filter((p) => p.category?.slug === active)), [photos, active]);
  const used = categories.filter((c) => photos.some((p) => p.category?.slug === c.slug));

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + shown.length) % shown.length)), [shown.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const current = open !== null ? shown[open] : null;

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter photos">
        {[{ slug: "all", title: "All" }, ...used].map((c) => (
          <button
            key={c.slug}
            role="tab"
            aria-selected={active === c.slug}
            onClick={() => setActive(c.slug)}
            className={`rounded-full border px-5 py-2 text-xs uppercase tracking-widest transition ${active === c.slug ? "border-paper bg-paper text-ink" : "border-line text-mute hover:border-paper hover:text-paper"}`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {shown.length === 0 && <p className="py-20 text-center text-mute">No photos here yet.</p>}
      <div className="columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
        {shown.map((p, i) => (
          <button key={p._id} onClick={() => setOpen(i)} className="tile mb-3 block w-full break-inside-avoid md:mb-4" aria-label={`Open ${p.title || "photo"}`}>
            <Pic img={p.img} sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw" />
          </button>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" onClick={close}>
          <button className="absolute right-5 top-5 text-3xl text-paper" onClick={close} aria-label="Close">×</button>
          <button className="absolute left-3 top-1/2 -translate-y-1/2 p-3 text-4xl text-paper/70 hover:text-paper" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous">‹</button>
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-4xl text-paper/70 hover:text-paper" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next">›</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.img.url} alt={current.img.alt || current.title || ""} className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
