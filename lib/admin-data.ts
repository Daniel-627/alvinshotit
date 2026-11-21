import "server-only";
import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./sanity";
import { writeClient } from "./sanity-admin";
import { TYPES, type ImageVal, type Values } from "./admin-schema";

const builder = createImageUrlBuilder({ projectId: projectId || "placeholder", dataset });
const thumb = (img: { asset?: { _ref: string } }) => builder.image(img).width(600).auto("format").url();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toValues(key: string, doc: any): Values {
  const cfg = TYPES[key];
  const v: Values = { _id: doc._id };
  for (const f of cfg.fields) {
    const raw = doc[f.name];
    switch (f.kind) {
      case "image":
        v[f.name] = raw?.asset?._ref ? { id: raw.asset._ref, url: thumb(raw) } : null;
        break;
      case "images":
        v[f.name] = (raw ?? []).filter((i: any) => i?.asset?._ref).map((i: any): ImageVal => ({ id: i.asset._ref, url: thumb(i) }));
        break;
      case "ref":
        v[f.name] = raw?._ref ?? "";
        break;
      case "slug":
        v[f.name] = raw?.current ?? "";
        break;
      case "blocks":
        v[f.name] = (raw ?? []).filter((b: any) => b._type === "block").map((b: any) => (b.children ?? []).map((c: any) => c.text).join("")).join("\n\n");
        break;
      case "lines":
        v[f.name] = (raw ?? []).join("\n");
        break;
      case "bool":
        v[f.name] = Boolean(raw);
        break;
      default:
        v[f.name] = raw ?? "";
    }
  }
  return v;
}

export async function listDocs(key: string): Promise<Values[]> {
  const cfg = TYPES[key];
  const docs = await writeClient.fetch(`*[_type==$t]|order(${cfg.orderBy})`, { t: cfg.doc });
  return docs.map((d: unknown) => toValues(key, d));
}

export async function getDoc(key: string, id: string): Promise<Values | null> {
  const doc = await writeClient.fetch(`*[_id==$id && _type==$t][0]`, { id, t: TYPES[key].doc });
  return doc ? toValues(key, doc) : null;
}

export async function getSingleton(key: string): Promise<Values> {
  const cfg = TYPES[key];
  const doc = await writeClient.fetch(`*[_id==$id][0]`, { id: cfg.doc });
  return toValues(key, doc ?? { _id: cfg.doc });
}

export async function refOptions(): Promise<Record<string, { id: string; title: string }[]>> {
  const cats = await writeClient.fetch<{ _id: string; title: string }[]>(`*[_type=="category"]|order(order asc){_id,title}`);
  return { categories: cats.map((c) => ({ id: c._id, title: c.title })) };
}

export async function counts() {
  return writeClient.fetch<Record<string, number>>(
    `{"photos":count(*[_type=="photo"]),"projects":count(*[_type=="project"]),"videos":count(*[_type=="video"]),"services":count(*[_type=="service"]),"categories":count(*[_type=="category"])}`
  );
}
