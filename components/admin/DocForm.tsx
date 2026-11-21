"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteDoc, saveDoc } from "@/app/admin/actions";
import { TYPES, type Field, type ImageVal, type Values } from "@/lib/admin-schema";
import { MultiImage, SingleImage } from "./ImageField";

type Opts = Record<string, { id: string; title: string }[]>;

export default function DocForm({ typeKey, id, initial, options }: { typeKey: string; id: string | null; initial: Values; options: Opts }) {
  const cfg = TYPES[typeKey];
  const router = useRouter();
  const [v, setV] = useState<Values>(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [pending, start] = useTransition();
  const set = (name: string, val: Values[string]) => setV((p) => ({ ...p, [name]: val }));

  function save() {
    setMsg(null);
    start(async () => {
      const r = await saveDoc(typeKey, id, v);
      if (!r.ok) return setMsg({ ok: false, text: r.error });
      if (cfg.singleton) return setMsg({ ok: true, text: "Saved. The site is updated." });
      router.push(`/admin/${typeKey}`);
      router.refresh();
    });
  }

  function remove() {
    start(async () => {
      const r = await deleteDoc(typeKey, id!);
      if (!r.ok) { setConfirm(false); return setMsg({ ok: false, text: r.error }); }
      router.push(`/admin/${typeKey}`);
      router.refresh();
    });
  }

  const input = "field";

  function control(f: Field) {
    const fid = `f-${f.name}`;
    const val = v[f.name];
    switch (f.kind) {
      case "image": return <SingleImage id={fid} value={(val as ImageVal) ?? null} onChange={(x) => set(f.name, x)} />;
      case "images": return <MultiImage id={fid} value={(val as ImageVal[]) ?? []} onChange={(x) => set(f.name, x)} />;
      case "textarea": return <textarea id={fid} className={`${input} min-h-28`} value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
      case "blocks": return <textarea id={fid} className={`${input} min-h-56`} value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
      case "lines": return <textarea id={fid} className={`${input} min-h-28`} value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
      case "bool":
        return (
          <label htmlFor={fid} className="flex cursor-pointer items-center gap-3 text-sm">
            <input id={fid} type="checkbox" className="h-5 w-5 accent-white" checked={Boolean(val)} onChange={(e) => set(f.name, e.target.checked)} />
            Yes
          </label>
        );
      case "select":
        return (
          <select id={fid} className={input} value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)}>
            <option value="">None</option>
            {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        );
      case "ref":
        return (
          <select id={fid} className={input} value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)}>
            <option value="">None</option>
            {(options[f.refType ?? ""] ?? []).map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
          </select>
        );
      case "number": return <input id={fid} type="number" className={input} value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
      case "date": return <input id={fid} type="date" className={input} value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
      case "url": return <input id={fid} type="url" inputMode="url" placeholder="https://" className={input} value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
      case "slug": return <input id={fid} className={input} placeholder="Leave empty to create from the title" value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
      default: return <input id={fid} className={input} value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
    }
  }

  return (
    <form className="max-w-3xl space-y-7" onSubmit={(e) => { e.preventDefault(); save(); }}>
      {cfg.fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={`f-${f.name}`} className="mb-2 block text-sm font-medium">
            {f.label}{f.required && <span className="text-mute"> *</span>}
          </label>
          {control(f)}
          {f.help && <p className="mt-2 text-xs text-mute">{f.help}</p>}
        </div>
      ))}

      {msg && <p role="status" className={`text-sm ${msg.ok ? "text-emerald-400" : "text-red-400"}`}>{msg.text}</p>}

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <button type="submit" disabled={pending} className="btn disabled:opacity-60">{pending ? "Saving…" : cfg.singleton ? "Save settings" : id ? "Save changes" : `Create ${cfg.label.toLowerCase()}`}</button>
        {!cfg.singleton && <button type="button" className="btn-ghost" onClick={() => router.push(`/admin/${typeKey}`)}>Cancel</button>}
        {id && !cfg.singleton && (
          confirm ? (
            <span className="ml-auto flex items-center gap-3 text-sm">
              Delete this {cfg.label.toLowerCase()}?
              <button type="button" onClick={remove} disabled={pending} className="rounded-full bg-red-500 px-4 py-2 text-white">Yes, delete</button>
              <button type="button" onClick={() => setConfirm(false)} className="text-mute underline underline-offset-4">Keep</button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirm(true)} className="ml-auto text-sm text-mute underline underline-offset-4 hover:text-red-400">Delete</button>
          )
        )}
      </div>
    </form>
  );
}
