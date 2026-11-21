import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { writeClient, adminReady } from "@/lib/sanity-admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!adminReady()) return NextResponse.json({ error: "Sanity is not configured." }, { status: 500 });
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)) return NextResponse.json({ error: "Use a JPG, PNG or WebP image." }, { status: 400 });
    const asset = await writeClient.assets.upload("image", Buffer.from(await file.arrayBuffer()), { filename: file.name, contentType: file.type });
    return NextResponse.json({ id: asset._id, url: `${asset.url}?w=600&auto=format` });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status: 500 });
  }
}
