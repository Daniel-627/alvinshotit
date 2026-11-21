import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import { PageHead } from "@/components/ui";
import { getCategories, getPhotos } from "@/lib/data";

export const metadata: Metadata = { title: "Portfolio" };

export default async function Portfolio() {
  const [photos, categories] = await Promise.all([getPhotos(), getCategories()]);
  return (
    <>
      <PageHead eyebrow="Portfolio" title="Beyond colour. Pure emotion." intro="A growing collection of frames. Filter by category and tap any photo to view it large." />
      <div className="container-x"><Gallery photos={photos} categories={categories} /></div>
    </>
  );
}
