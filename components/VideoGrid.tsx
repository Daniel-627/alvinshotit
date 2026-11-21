"use client";

import { useState } from "react";
import type { VideoItem } from "@/lib/types";
import { parseVideo as parse } from "@/lib/video";

function Card({ v, big }: { v: VideoItem; big?: boolean }) {
  const [play, setPlay] = useState(false);
  const info = parse(v.url);
  const thumb = v.thumb?.url || info?.thumb;
  return (
    <article>
      <div className="tile aspect-video">
        {play && info ? (
          <iframe src={info.embed} title={v.title} className="absolute inset-0 h-full w-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        ) : (
          <button onClick={() => (info ? setPlay(true) : window.open(v.url, "_blank"))} className="group absolute inset-0 block w-full" aria-label={`Play ${v.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {thumb && <img src={thumb} alt="" className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />}
            <span className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink transition group-hover:scale-110 ${big ? "h-20 w-20" : "h-14 w-14"}`}>
              <svg viewBox="0 0 24 24" className="ml-1 h-1/3 w-1/3 fill-current"><path d="M5 3l16 9-16 9z" /></svg>
            </span>
          </button>
        )}
      </div>
      <div className="mt-4">
        <p className="eyebrow">{[v.kind, v.client].filter(Boolean).join(" · ")}</p>
        <h3 className={`mt-1 font-display ${big ? "text-3xl" : "text-xl"}`}>{v.title}</h3>
        {v.description && <p className="mt-2 max-w-xl text-sm text-mute">{v.description}</p>}
      </div>
    </article>
  );
}

export default function VideoGrid({ videos }: { videos: VideoItem[] }) {
  const [first, ...rest] = videos;
  if (!first) return <p className="text-mute">No videos yet.</p>;
  return (
    <div className="space-y-16">
      <Card v={first} big />
      {rest.length > 0 && (
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((v) => <Card key={v._id} v={v} />)}
        </div>
      )}
    </div>
  );
}
