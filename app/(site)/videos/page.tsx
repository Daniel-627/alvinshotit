import type { Metadata } from "next";
import VideoGrid from "@/components/VideoGrid";
import { PageHead } from "@/components/ui";
import { getVideos } from "@/lib/data";

export const metadata: Metadata = { title: "Videos" };

export default async function Videos() {
  const videos = await getVideos();
  return (
    <>
      <PageHead eyebrow="Videos" title="Motion, with the same eye." intro="Highlight films, brand stories and event coverage." />
      <div className="container-x"><VideoGrid videos={videos} /></div>
    </>
  );
}
