"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/client-upload";
import type { ImageVal } from "@/lib/admin-schema";

export function SingleImage({ value, onChange, id }: { value: ImageVal | null; onChange: (v: ImageVal | null) => void; id: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function pick(files: FileList | null) {
    if (!files?.[0]) return;
    setBusy(true);
    setErr("");
    try {
      onChange(await uploadImage(files[0]));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex items-start gap-4">
      <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-line bg-panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value ? <img src={value.url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-2 text-center text-xs text-mute">No photo</div>}
      </div>
      <div className="space-y-2">
        <input ref={input} id={id} type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files)} />
        <label htmlFor={id} className="btn-ghost cursor-pointer !py-2 text-xs">{busy ? "Uploading…" : value ? "Replace" : "Choose photo"}</label>
        {value && <button type="button" onClick={() => onChange(null)} className="ml-2 text-xs text-mute underline underline-offset-4 hover:text-paper">Remove</button>}
        {err && <p className="text-xs text-red-400">{err}</p>}
      </div>
    </div>
  );
}

export function MultiImage({ value, onChange, id }: { value: ImageVal[]; onChange: (v: ImageVal[]) => void; id: string }) {
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function pick(files: FileList | null) {
    if (!files?.length) return;
    setErr("");
    const list = Array.from(files);
    setBusy(list.length);
    let next = [...value];
    for (const f of list) {
      try {
        next = [...next, await uploadImage(f)];
        onChange(next);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Upload failed");
      }
      setBusy((n) => n - 1);
    }
    if (input.current) input.current.value = "";
  }

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const n = [...value];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {value.map((img, i) => (
          <div key={img.id + i} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/70 p-1 text-xs">
              <button type="button" aria-label="Move earlier" onClick={() => move(i, -1)} className="px-2 py-1">←</button>
              <button type="button" aria-label="Remove" onClick={() => onChange(value.filter((_, k) => k !== i))} className="px-2 py-1">✕</button>
              <button type="button" aria-label="Move later" onClick={() => move(i, 1)} className="px-2 py-1">→</button>
            </div>
          </div>
        ))}
      </div>
      <input ref={input} id={id} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => pick(e.target.files)} />
      <label htmlFor={id} className="btn-ghost mt-4 cursor-pointer !py-2 text-xs">{busy ? `Uploading ${busy} left…` : "Add photos"}</label>
      {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
    </div>
  );
}
