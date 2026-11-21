export type Img = { url: string; width: number; height: number; alt?: string; lqip?: string };
export type Category = { _id: string; title: string; slug: string };
export type Photo = { _id: string; title?: string; img: Img; category?: Category };
export type ProjectCard = { _id: string; title: string; slug: string; client?: string; date?: string; summary?: string; cover: Img; category?: string };
export type Project = ProjectCard & { location?: string; story?: any[]; gallery: Img[] };
export type VideoItem = { _id: string; title: string; url: string; thumb?: Img; client?: string; kind?: string; description?: string; featured?: boolean };
export type Service = { _id: string; title: string; description?: string; startingFrom?: string; includes?: string[] };
export type Settings = {
  heroImage?: Img; heroTitle?: string; heroSubtitle?: string; aboutPortrait?: Img; aboutBody?: any[];
  email?: string; phone?: string; whatsapp?: string; location?: string; instagram?: string; youtube?: string; tiktok?: string;
};
