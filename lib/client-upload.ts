import type { ImageVal } from "./admin-schema";

const MAX_EDGE = 2400;
const MAX_BYTES = 4 * 1024 * 1024; // keeps requests under Netlify's ~6 MB function limit

async function shrink(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  for (const q of [0.88, 0.8, 0.7, 0.6]) {
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/jpeg", q));
    if (blob && blob.size <= MAX_BYTES) return blob;
  }
  throw new Error("Image is too large even after shrinking.");
}

export async function uploadImage(file: File): Promise<ImageVal> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image.`);
  const blob = await shrink(file);
  const fd = new FormData();
  fd.append("file", blob, file.name.replace(/\.[^.]+$/, "") + (file.type === "image/gif" ? ".gif" : ".jpg"));
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data as ImageVal;
}
