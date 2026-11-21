import type { Category, Photo, ProjectCard, Project, VideoItem, Service } from "./types";

const demoImg = (seed: string, w = 1200, h = 1500, alt = "Demo image") => ({
  url: `https://picsum.photos/seed/${seed}/${w}/${h}?grayscale`,
  width: w,
  height: h,
  alt,
});

export const demoCategories: Category[] = [
  { _id: "c1", title: "Portraits", slug: "portraits" },
  { _id: "c2", title: "Events", slug: "events" },
  { _id: "c3", title: "Weddings", slug: "weddings" },
  { _id: "c4", title: "Street", slug: "street" },
  { _id: "c5", title: "Nature", slug: "nature" },
];

const sizes: [number, number][] = [[1200, 1500], [1500, 1000], [1200, 1200], [1000, 1500], [1500, 1125], [1200, 1600]];
export const demoPhotos: Photo[] = Array.from({ length: 18 }, (_, i) => {
  const [w, h] = sizes[i % sizes.length];
  return { _id: `p${i}`, title: `Frame ${i + 1}`, img: demoImg(`asi${i}`, w, h), category: demoCategories[i % demoCategories.length] };
});

export const demoProjects: Project[] = [
  { _id: "j1", title: "Golden Hour, Kisumu", slug: "golden-hour-kisumu", client: "Private", date: "2026-09-12", location: "Kisumu", summary: "A portrait session along the lakeshore, chasing the last light of the day.", cover: demoImg("proj1", 1500, 1000), category: "Portraits", gallery: [0, 1, 2, 3, 4, 5].map((n) => demoImg(`proj1-${n}`, sizes[n][0], sizes[n][1])) },
  { _id: "j2", title: "The Mwangi Wedding", slug: "the-mwangi-wedding", client: "Mwangi & Achieng", date: "2026-08-02", location: "Nairobi", summary: "Two families, one long day, and a lot of dancing.", cover: demoImg("proj2", 1200, 1600), category: "Weddings", gallery: [0, 1, 2, 3, 4, 5].map((n) => demoImg(`proj2-${n}`, sizes[n][0], sizes[n][1])) },
  { _id: "j3", title: "Lakeside Conference", slug: "lakeside-conference", client: "Corporate", date: "2026-06-20", location: "Kisumu", summary: "Two days of keynotes, candid moments and brand coverage.", cover: demoImg("proj3", 1500, 1125), category: "Events", gallery: [0, 1, 2, 3].map((n) => demoImg(`proj3-${n}`, sizes[n][0], sizes[n][1])) },
];

export const demoVideos: VideoItem[] = [
  { _id: "v1", title: "Showreel 2026", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", kind: "Reel", description: "A cut of this year's best work.", featured: true },
  { _id: "v2", title: "Wedding Highlight", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", kind: "Event", client: "Mwangi & Achieng" },
  { _id: "v3", title: "Brand Film", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", kind: "Commercial" },
];

export const demoServices: Service[] = [
  { _id: "s1", title: "Portraits", description: "Personal, family and professional portraits, on location or outdoors.", startingFrom: "", includes: ["1–2 hour session", "Edited gallery", "Online delivery"] },
  { _id: "s2", title: "Weddings & Events", description: "Full-day coverage with photo and video options.", startingFrom: "", includes: ["Full-day coverage", "Second shooter option", "Highlight film"] },
  { _id: "s3", title: "Commercial & Brand", description: "Product, team and brand storytelling for businesses.", startingFrom: "", includes: ["Shot list planning", "Licensed usage", "Fast turnaround"] },
];

export const demoProjectCards: ProjectCard[] = demoProjects;
