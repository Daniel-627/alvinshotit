import "server-only";
import { createClient } from "next-sanity";
import { dataset, projectId } from "./sanity";

export const adminReady = () => Boolean(projectId) && Boolean(process.env.SANITY_WRITE_TOKEN);

export const writeClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});
