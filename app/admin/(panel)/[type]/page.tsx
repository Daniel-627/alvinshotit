import Link from "next/link";
import { notFound } from "next/navigation";
import BulkUpload from "@/components/admin/BulkUpload";
import { listDocs, refOptions } from "@/lib/admin-data";
import { adminReady } from "@/lib/sanity-admin";
import { LIST_KEYS, TYPES, type ImageVal } from "@/lib/admin-schema";

export default async function ListPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!(LIST_KEYS as readonly string[]).includes(type)) notFound();
  const cfg = TYPES[type];
  const ready = adminReady();
  const [docs, opts] = ready ? await Promise.all([listDocs(type), refOptions()]) : [[], { categories: [] }];
  const catName = (id: unknown) => opts.categories.find((c) => c.id === id)?.title;
  const sub = (d: (typeof docs)[number]) => {
    if (!cfg.subField) return "";
    const raw = d[cfg.subField];
    return cfg.subField === "category" ? catName(raw) ?? "" : String(raw ?? "");
  };
  const thumb = (d: (typeof docs)[number]) => (cfg.thumbField ? (d[cfg.thumbField] as ImageVal | null)?.url : undefined);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="h-display text-4xl">{cfg.plural}</h1>
        {type !== "photos" && <Link href={`/admin/${type}/new`} className="btn">Add {cfg.label.toLowerCase()}</Link>}
      </div>

      {type === "photos" && ready && <BulkUpload categories={opts.categories} />}

      {docs.length === 0 ? (
        <p className="text-mute">Nothing here yet.</p>
      ) : type === "photos" ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {docs.map((d) => (
            <li key={String(d._id)}>
              <Link href={`/admin/photos/${d._id}`} className="tile block aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {thumb(d) && <img src={thumb(d)} alt={String(d.alt || d.title || "")} className="h-full w-full object-cover" />}
                {d.featured && <span className="absolute left-2 top-2 rounded-full bg-paper px-2 py-0.5 text-[10px] font-medium text-ink">Featured</span>}
              </Link>
              <p className="mt-2 truncate text-xs text-mute">{sub(d) || "No category"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {docs.map((d) => (
            <li key={String(d._id)}>
              <Link href={`/admin/${type}/${d._id}`} className="flex items-center gap-4 p-4 transition hover:bg-panel">
                {cfg.thumbField && (
                  <span className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-panel">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {thumb(d) && <img src={thumb(d)} alt="" className="h-full w-full object-cover" />}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate font-medium">{String(d[cfg.titleField] || "Untitled")}</span>
                  {sub(d) && <span className="block truncate text-sm text-mute">{sub(d)}</span>}
                </span>
                <span className="ml-auto text-sm text-mute">Edit →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
