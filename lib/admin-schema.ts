// Shared by the admin forms (client) and the save/load code (server).
export type Kind =
  | "text" | "textarea" | "number" | "bool" | "image" | "images" | "ref"
  | "slug" | "blocks" | "lines" | "date" | "datetime" | "url" | "select";

export type Field = {
  name: string;
  label: string;
  kind: Kind;
  required?: boolean;
  help?: string;
  options?: string[];
  refType?: string; // key in TYPES
  slugFrom?: string;
};

export type TypeConfig = {
  doc: string;
  label: string;
  plural: string;
  titleField: string;
  subField?: string;
  thumbField?: string;
  orderBy: string;
  singleton?: boolean;
  fields: Field[];
};

export const TYPES: Record<string, TypeConfig> = {
  photos: {
    doc: "photo", label: "Photo", plural: "Photos", titleField: "title", subField: "category", thumbField: "image", orderBy: "_createdAt desc",
    fields: [
      { name: "image", label: "Photo", kind: "image", required: true },
      { name: "title", label: "Title", kind: "text" },
      { name: "alt", label: "Alt text", kind: "text", help: "Short description for accessibility and search." },
      { name: "category", label: "Category", kind: "ref", refType: "categories" },
      { name: "featured", label: "Show on the home page", kind: "bool" },
    ],
  },
  categories: {
    doc: "category", label: "Category", plural: "Categories", titleField: "title", orderBy: "order asc",
    fields: [
      { name: "title", label: "Name", kind: "text", required: true },
      { name: "slug", label: "URL slug", kind: "slug", slugFrom: "title" },
      { name: "order", label: "Order", kind: "number", help: "Lower numbers appear first in the filter bar." },
    ],
  },
  projects: {
    doc: "project", label: "Project", plural: "Projects", titleField: "title", subField: "client", thumbField: "cover", orderBy: "date desc",
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "slug", label: "URL slug", kind: "slug", slugFrom: "title" },
      { name: "cover", label: "Cover photo", kind: "image", required: true },
      { name: "client", label: "Client", kind: "text" },
      { name: "date", label: "Date", kind: "date" },
      { name: "location", label: "Location", kind: "text" },
      { name: "category", label: "Category", kind: "ref", refType: "categories" },
      { name: "summary", label: "Short summary", kind: "textarea" },
      { name: "story", label: "The story", kind: "blocks", help: "Separate paragraphs with a blank line." },
      { name: "gallery", label: "Gallery", kind: "images" },
      { name: "featured", label: "Featured", kind: "bool" },
    ],
  },
  videos: {
    doc: "video", label: "Video", plural: "Videos", titleField: "title", subField: "kind", thumbField: "thumbnail", orderBy: "featured desc, publishedAt desc",
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "url", label: "YouTube or Vimeo link", kind: "url", required: true },
      { name: "kind", label: "Type", kind: "select", options: ["Event", "Commercial", "Music video", "Documentary", "Reel"] },
      { name: "client", label: "Client", kind: "text" },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "thumbnail", label: "Custom thumbnail", kind: "image", help: "Optional. YouTube thumbnails are used if empty." },
      { name: "featured", label: "Pin to top of Videos page", kind: "bool" },
    ],
  },
  services: {
    doc: "service", label: "Service", plural: "Services", titleField: "title", orderBy: "order asc",
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "startingFrom", label: "Price note", kind: "text", help: "For example: From KES 15,000. Leave empty to hide." },
      { name: "includes", label: "What's included", kind: "lines", help: "One item per line." },
      { name: "order", label: "Order", kind: "number" },
    ],
  },
  settings: {
    doc: "siteSettings", label: "Site settings", plural: "Site settings", titleField: "heroTitle", orderBy: "_createdAt asc", singleton: true,
    fields: [
      { name: "heroTitle", label: "Home headline", kind: "text" },
      { name: "heroSubtitle", label: "Home subtitle", kind: "textarea" },
      { name: "aboutPortrait", label: "About page portrait", kind: "image" },
      { name: "aboutBody", label: "About page story", kind: "blocks", help: "Separate paragraphs with a blank line." },
      { name: "email", label: "Email", kind: "text" },
      { name: "phone", label: "Phone", kind: "text" },
      { name: "whatsapp", label: "WhatsApp number", kind: "text", help: "Digits only with country code, e.g. 2547XXXXXXXX." },
      { name: "location", label: "Based in", kind: "text" },
      { name: "instagram", label: "Instagram link", kind: "url" },
      { name: "youtube", label: "YouTube link", kind: "url" },
      { name: "tiktok", label: "TikTok link", kind: "url" },
    ],
  },
};

export const LIST_KEYS = ["photos", "projects", "videos", "services", "categories"] as const;

export type ImageVal = { id: string; url: string };
export type FormValue = string | number | boolean | ImageVal | ImageVal[] | null | undefined;
export type Values = Record<string, FormValue>;
