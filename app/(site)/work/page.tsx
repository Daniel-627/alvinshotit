import type { Metadata } from "next";
import { PageHead, ProjectTile } from "@/components/ui";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = { title: "Projects" };

export default async function Work() {
  const projects = await getProjects();
  return (
    <>
      <PageHead eyebrow="Projects" title="Stories, shoot by shoot." intro="Each project is a full story: the brief, the day and the final frames." />
      <div className="container-x grid gap-8 md:grid-cols-2 xl:grid-cols-3">{projects.map((p) => <ProjectTile key={p._id} p={p} />)}</div>
    </>
  );
}
