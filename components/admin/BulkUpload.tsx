"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveDoc } from "@/app/admin/actions";
import { uploadImage } from "@/lib/client-upload";

export default function BulkUpload({ categories }: { categories: { id: string; title: string }[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [drag, setDrag] = useState(false);
  const [state, setState] = useState<{ total: number; done: number; errors: string[] } | null>(null);

  async function run(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setState({ total: list.length, done: 0, errors: [] });
    for (const f of list) {
      try {
        const img = await uploadImage(f);
        const r = await saveDoc("photos", null, { image: img, title: f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "), category, featured });
        if (!r.ok) throw new Error(r.error);
      } catch (e) {
        const m = `${f.name}: ${e instanceof Error ? e.message : "failed"}`;
        setState((s) => s && { ...s, errors: [...s.errors, m] });
      }
      setState((s) => s && { ...s, done: s.done + 1 });
    }
    if (input.current) input.current.value = "";
    router.refresh();
  }

  const busy = state && state.done < state.total;

  return (
    <section className="mb-10 rounded-2xl border border-line p-6">
      <h2 className="font-display text-xl">Upload photos</h2>
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="bulk-cat" className="mb-2 block text-xs text-mute">Category for this batch</label>
          <select id="bulk-cat" className="field !w-56" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">None</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <label htmlFor="bulk-feat" className="flex cursor-pointer items-center gap-2 pb-3 text-sm">
          <input id="bulk-feat" type="checkbox" className="h-5 w-5 accent-white" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Feature on home page
        </label>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); run(e.dataTransfer.files); }}
        className={`mt-5 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-10 text-center text-sm transition ${drag ? "border-paper bg-panel" : "border-line"}`}
      >
        <p className="text-mute">Drop photos here, or choose them from your device. Large files are resized automatically.</p>
        <input ref={input} id="bulk-files" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => e.target.files && run(e.target.files)} />
        <label htmlFor="bulk-files" className="btn cursor-pointer !py-2.5">{busy ? "Uploading…" : "Choose photos"}</label>
      </div>

      {state && (
        <div role="status" className="mt-4 text-sm">
          <p>{state.done} of {state.total} uploaded</p>
          <div className="mt-2 h-1 overflow-hidden rounded bg-line"><div className="h-full bg-paper transition-all" style={{ width: `${(state.done / state.total) * 100}%` }} /></div>
          {state.errors.map((e) => <p key={e} className="mt-2 text-red-400">{e}</p>)}
        </div>
      )}
    </section>
  );
}
