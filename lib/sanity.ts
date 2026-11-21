import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

const rawId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const projectId = /^[a-z0-9-]+$/.test(rawId) && rawId !== "yourprojectid" ? rawId : "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const isConfigured = Boolean(projectId) ;

export const client = createClient({ projectId: projectId || "placeholder", dataset, apiVersion, useCdn: false });

const builder = createImageUrlBuilder({ projectId: projectId || "placeholder", dataset });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => builder.image(source).auto("format");

export async function fetchQuery<T>(query: string, params: Record<string, unknown> = {}, fallback: T): Promise<T> {
  if (!isConfigured) return fallback;
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: 3600, tags: ["sanity"] } });
  } catch (e) {
    console.error("Sanity fetch failed", e);
    return fallback;
  }
}
