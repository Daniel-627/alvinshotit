"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { writeClient, adminReady } from "@/lib/sanity-admin";
import { TYPES, type Values, type ImageVal } from "@/lib/admin-schema";

type Result = { ok: true; id: string } | { ok: false; error: string };

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

const imgRef = (id: string) => ({ _type: "image", asset: { _type: "reference", _ref: id } });

function toBlocks(text: string) {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => ({
      _type: "block",
      _key: randomUUID().slice(0, 12),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: randomUUID().slice(0, 12), text: p, marks: [] }],
    }));
}

function refresh() {
  updateTag("sanity");
  revalidatePath("/", "layout");
}

export async function saveDoc(key: string, id: string | null, values: Values): Promise<Result> {
  try {
    await requireAdmin();
    if (!adminReady()) return { ok: false, error: "Sanity project ID or write token is missing in the environment." };
    const cfg = TYPES[key];
    if (!cfg) return { ok: false, error: "Unknown content type." };

    const set: Record<string, unknown> = {};
    const unset: string[] = [];

    for (const f of cfg.fields) {
      let v = values[f.name];
      if (f.kind === "slug") {
        const src = String(values[f.slugFrom ?? "title"] ?? "");
        v = slugify(String(v || src));
      }
      const empty = v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
      if (f.required && empty) return { ok: false, error: `${f.label} is required.` };
      if (empty && f.kind !== "bool") { unset.push(f.name); continue; }

      switch (f.kind) {
        case "bool": set[f.name] = Boolean(v); break;
        case "number": { const n = Number(v); if (Number.isNaN(n)) return { ok: false, error: `${f.label} must be a number.` }; set[f.name] = n; break; }
        case "image": set[f.name] = imgRef((v as ImageVal).id); break;
        case "images": set[f.name] = (v as ImageVal[]).map((i) => ({ ...imgRef(i.id), _key: randomUUID().slice(0, 12) })); break;
        case "ref": set[f.name] = { _type: "reference", _ref: String(v) }; break;
        case "slug": set[f.name] = { _type: "slug", current: String(v) }; break;
        case "blocks": set[f.name] = toBlocks(String(v)); break;
        case "lines": set[f.name] = String(v).split("\n").map((l) => l.trim()).filter(Boolean); break;
        case "url": {
          const s = String(v).trim();
          if (!/^https:\/\//i.test(s)) return { ok: false, error: `${f.label} must start with https://` };
          set[f.name] = s; break;
        }
        default: set[f.name] = String(v).trim();
      }
    }

    const docId = cfg.singleton ? cfg.doc : id;
    if (docId) {
      await writeClient.createIfNotExists({ _id: docId, _type: cfg.doc });
      await writeClient.patch(docId).set(set).unset(unset).commit();
      refresh();
      return { ok: true, id: docId };
    }

    const extra: Record<string, unknown> = {};
    if (cfg.doc === "photo" || cfg.doc === "video") extra.publishedAt = new Date().toISOString();
    const created = await writeClient.create({ _type: cfg.doc, ...set, ...extra });
    refresh();
    return { ok: true, id: created._id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteDoc(key: string, id: string): Promise<Result> {
  try {
    await requireAdmin();
    const cfg = TYPES[key];
    if (!cfg || cfg.singleton) return { ok: false, error: "This item can't be deleted." };
    await writeClient.delete(id);
    refresh();
    return { ok: true, id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (/referenc/i.test(msg)) return { ok: false, error: "Other items still use this. Remove it from them first (for example, reassign photos to another category)." };
    return { ok: false, error: msg || "Could not delete." };
  }
}
