// Seeds Sanity with dummy content (everything except images/media).
//   npm run seed          add the dummy content (safe to re-run, never overwrites edits)
//   npm run seed:reset    remove only the dummy content (ids starting with "seed-")
//   node scripts/seed.mjs --dry   print what would be created
// Reads NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_WRITE_TOKEN from .env.local.

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;
const version = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const reset = process.argv.includes("--reset");
const dry = process.argv.includes("--dry");

// Note: ids must not contain dots, or Sanity treats the document as private.
const block = (key, text) => ({
  _type: "block", _key: key, style: "normal", markDefs: [],
  children: [{ _type: "span", _key: key + "s", text, marks: [] }],
});
const blocks = (prefix, paragraphs) => paragraphs.map((t, i) => block(`${prefix}${i}`, t));
const ref = (id) => ({ _type: "reference", _ref: id });

const categories = [
  { id: "seed-cat-portraits", title: "Portraits", slug: "portraits", order: 1 },
  { id: "seed-cat-weddings", title: "Weddings", slug: "weddings", order: 2 },
  { id: "seed-cat-events", title: "Events", slug: "events", order: 3 },
  { id: "seed-cat-street", title: "Street", slug: "street", order: 4 },
  { id: "seed-cat-nature", title: "Nature", slug: "nature", order: 5 },
].map((c) => ({ _id: c.id, _type: "category", title: c.title, slug: { _type: "slug", current: c.slug }, order: c.order }));

const projects = [
  {
    id: "seed-project-golden-hour", title: "Golden Hour, Kisumu", slug: "golden-hour-kisumu", client: "Private session", date: "2026-09-12",
    location: "Kisumu", cat: "seed-cat-portraits", featured: true,
    summary: "A portrait session along the lakeshore, chasing the last light of the day.",
    story: [
      "We met an hour before sunset at the lakeshore. The plan was simple: no stiff poses, just conversation and patience while the light changed.",
      "As the sun dropped, the water turned to copper and the shadows softened. The best frames came in the last ten minutes, when everyone had stopped thinking about the camera.",
    ],
  },
  {
    id: "seed-project-mwangi-wedding", title: "The Mwangi Wedding", slug: "the-mwangi-wedding", client: "Mwangi & Achieng", date: "2026-08-02",
    location: "Nairobi", cat: "seed-cat-weddings", featured: true,
    summary: "Two families, one long day, and a lot of dancing.",
    story: [
      "From the first look in the morning to the last song at night, this wedding was about family. The brief was to document the day as it happened.",
      "We covered the preparations, the ceremony, the speeches and the dance floor, with a short highlight film to follow.",
    ],
  },
  {
    id: "seed-project-lakeside-conference", title: "Lakeside Conference", slug: "lakeside-conference", client: "Corporate client", date: "2026-06-20",
    location: "Kisumu", cat: "seed-cat-events", featured: true,
    summary: "Two days of keynotes, candid moments and brand coverage.",
    story: [
      "Two days, three halls and more than four hundred guests. We delivered speaker portraits, candid networking shots and detail images for the client's social channels.",
      "Same-day selects went out each evening so the team could post while the event was still trending.",
    ],
  },
  {
    id: "seed-project-city-lines", title: "City Lines", slug: "city-lines", client: "Personal project", date: "2026-04-05",
    location: "Nairobi CBD", cat: "seed-cat-street", featured: false,
    summary: "A black-and-white walk through the city at first light.",
    story: ["An early-morning series on the shapes, shadows and quiet moments of the city before it wakes up. Shot entirely in monochrome."],
  },
].map((p) => ({
  _id: p.id, _type: "project", title: p.title, slug: { _type: "slug", current: p.slug }, client: p.client, date: p.date,
  location: p.location, category: ref(p.cat), summary: p.summary, story: blocks(p.id.slice(-6), p.story), featured: p.featured,
}));

const SAMPLE = "https://www.youtube.com/watch?v=aqz-KE-bpKQ"; // placeholder sample video; replace in the admin
const videos = [
  { id: "seed-video-showreel", title: "Showreel 2026", kind: "Reel", client: "", featured: true, description: "A cut of this year's best work." },
  { id: "seed-video-wedding", title: "Mwangi Wedding Highlights", kind: "Event", client: "Mwangi & Achieng", featured: false, description: "The day in four minutes." },
  { id: "seed-video-brand", title: "Brand Film: Lakeside Coffee", kind: "Commercial", client: "Lakeside Coffee", featured: false, description: "A short film about a family-run roastery." },
  { id: "seed-video-conference", title: "Lakeside Conference Recap", kind: "Event", client: "Corporate client", featured: false, description: "Two days of keynotes in ninety seconds." },
  { id: "seed-video-music", title: "Live Session", kind: "Music video", client: "Local artist", featured: false, description: "One take, one room, one song." },
].map((v, i) => ({
  _id: v.id, _type: "video", title: v.title, url: SAMPLE, kind: v.kind, client: v.client || undefined,
  description: v.description, featured: v.featured, publishedAt: new Date(Date.UTC(2026, 10 - i, 1)).toISOString(),
}));

const services = [
  { id: "seed-service-portraits", title: "Portraits", order: 1, description: "Personal, family and professional portraits, on location or outdoors.", startingFrom: "From KES 8,000", includes: ["1 to 2 hour session", "20 edited photos", "Online gallery"] },
  { id: "seed-service-weddings", title: "Weddings & Events", order: 2, description: "Full-day coverage with photo and video options.", startingFrom: "From KES 60,000", includes: ["Full-day coverage", "Second shooter option", "Highlight film", "Online gallery"] },
  { id: "seed-service-commercial", title: "Commercial & Brand", order: 3, description: "Product, team and brand storytelling for businesses.", startingFrom: "From KES 25,000", includes: ["Shot list planning", "Licensed usage", "Fast turnaround"] },
  { id: "seed-service-video", title: "Video Production", order: 4, description: "Short films, event recaps and social content.", startingFrom: "From KES 35,000", includes: ["Scripting and planning", "Shoot and edit", "Colour grade", "Social cuts"] },
].map((s) => ({ _id: s.id, _type: "service", title: s.title, order: s.order, description: s.description, startingFrom: s.startingFrom, includes: s.includes }));

const settings = {
  _id: "siteSettings", _type: "siteSettings",
  heroTitle: "Frames that hold the moment.",
  heroSubtitle: "Portraits, weddings, events and brand stories. Photographed first, filmed when the moment moves.",
  aboutBody: blocks("about", [
    "I'm Alvin, a photographer and videographer who believes the best images are quiet ones: honest light, real emotion, nothing staged for show.",
    "I shoot portraits, weddings, events and brand stories. Photography comes first, and I bring film in when the moment calls for motion.",
    "Tell me about the day you have in mind and I'll tell you how I'd shoot it.",
  ]),
  email: "hello@example.com", phone: "+254 700 000 000", whatsapp: "254700000000", location: "Kenya",
  instagram: "https://instagram.com/yourhandle", youtube: "https://youtube.com/@yourhandle", tiktok: "https://tiktok.com/@yourhandle",
};

const docs = [...categories, ...projects, ...videos, ...services, settings];

async function mutate(mutations) {
  const res = await fetch(`https://${projectId}.api.sanity.io/v${version}/data/mutate/${dataset}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${body?.error?.description || body?.message || "Request failed"}`);
  return body;
}

async function query(groq) {
  const res = await fetch(`https://${projectId}.api.sanity.io/v${version}/data/query/${dataset}?query=${encodeURIComponent(groq)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error?.description || "Query failed");
  return body.result;
}

async function main() {
  if (dry) {
    const counts = docs.reduce((a, d) => ((a[d._type] = (a[d._type] || 0) + 1), a), {});
    console.log("Dry run. Would create (if missing):", counts);
    return;
  }
  if (!projectId || !token) {
    console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local");
    process.exit(1);
  }
  if (reset) {
    const ids = await query(`*[_id match "seed-*"]._id`);
    if (!ids.length) return console.log("Nothing to remove.");
    await mutate(ids.map((id) => ({ delete: { id } })));
    console.log(`Removed ${ids.length} dummy documents.`);
    return;
  }
  // createIfNotExists: re-running never overwrites anything you have edited.
  await mutate(docs.map((d) => ({ createIfNotExists: d })));
  console.log(`Seeded ${docs.length} documents: ${categories.length} categories, ${projects.length} projects, ${videos.length} videos, ${services.length} services, site settings.`);
  console.log("Photos and images are left for you to upload in /admin.");
}

main().catch((e) => { console.error("Seed failed:", e.message); process.exit(1); });
