import { notFound } from "next/navigation";
import Link from "next/link";
import DocForm from "@/components/admin/DocForm";
import { getDoc, refOptions } from "@/lib/admin-data";
import { adminReady } from "@/lib/sanity-admin";
import { LIST_KEYS, TYPES, type Values } from "@/lib/admin-schema";

export default async function EditPage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  if (!(LIST_KEYS as readonly string[]).includes(type)) notFound();
  const cfg = TYPES[type];
  const isNew = id === "new";
  const ready = adminReady();

  let initial: Values = { featured: false };
  if (!isNew) {
    const doc = ready ? await getDoc(type, id) : null;
    if (!doc) notFound();
    initial = doc;
  }
  const options = ready ? await refOptions() : { categories: [] };

  return (
    <>
      <Link href={`/admin/${type}`} className="text-sm text-mute hover:text-paper">← {cfg.plural}</Link>
      <h1 className="h-display mb-10 mt-3 text-4xl">{isNew ? `New ${cfg.label.toLowerCase()}` : `Edit ${cfg.label.toLowerCase()}`}</h1>
      <DocForm typeKey={type} id={isNew ? null : id} initial={initial} options={options} />
    </>
  );
}
