import type { Metadata } from "next";
import { PageHead, PostTile } from "@/components/ui";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = { title: "Journal" };

export default async function Journal() {
  const posts = await getPosts();
  return (
    <>
      <PageHead eyebrow="Journal" title="Notes from behind the lens." />
      <div className="container-x grid gap-10 md:grid-cols-2 xl:grid-cols-3">{posts.map((p) => <PostTile key={p._id} p={p} />)}</div>
    </>
  );
}
