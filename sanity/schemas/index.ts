import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "order", type: "number", description: "Lower numbers appear first in the filter bar" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
});

export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "alt", type: "string", description: "Short description for accessibility" }),
    defineField({ name: "category", type: "reference", to: [{ type: "category" }] }),
    defineField({ name: "featured", type: "boolean", initialValue: false, description: "Show on the home page" }),
    defineField({ name: "publishedAt", type: "datetime", initialValue: () => new Date().toISOString() }),
  ],
  preview: { select: { title: "title", media: "image", subtitle: "category.title" } },
});

export const project = defineType({
  name: "project",
  title: "Project (shoot)",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "client", type: "string" }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "category", type: "reference", to: [{ type: "category" }] }),
    defineField({ name: "cover", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({ name: "story", type: "array", of: [{ type: "block" }], description: "The story behind the shoot" }),
    defineField({
      name: "gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string", title: "Alt text" }] }],
      options: { layout: "grid" },
    }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
  ],
  orderings: [{ title: "Newest", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", media: "cover", subtitle: "client" } },
});

export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "url",
      type: "url",
      title: "YouTube or Vimeo URL",
      validation: (r) => r.required().uri({ scheme: ["https"] }),
    }),
    defineField({ name: "thumbnail", type: "image", options: { hotspot: true }, description: "Optional. Falls back to the platform thumbnail." }),
    defineField({ name: "client", type: "string" }),
    defineField({ name: "kind", type: "string", title: "Type", options: { list: ["Event", "Commercial", "Music video", "Documentary", "Reel"] } }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "featured", type: "boolean", initialValue: false, description: "Pinned to the top of the Videos page" }),
    defineField({ name: "publishedAt", type: "datetime", initialValue: () => new Date().toISOString() }),
  ],
  preview: { select: { title: "title", media: "thumbnail", subtitle: "kind" } },
});

export const post = defineType({
  name: "post",
  title: "Journal post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "publishedAt", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({ name: "cover", type: "image", options: { hotspot: true } }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] }],
    }),
  ],
  orderings: [{ title: "Newest", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", media: "cover" } },
});

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "startingFrom", type: "string", description: "e.g. From KES 15,000. Leave empty to hide." }),
    defineField({ name: "includes", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "order", type: "number" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroTitle", type: "string", initialValue: "Frames that hold the moment." }),
    defineField({ name: "heroSubtitle", type: "text", rows: 2 }),
    defineField({ name: "aboutPortrait", type: "image", options: { hotspot: true } }),
    defineField({ name: "aboutBody", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "whatsapp", type: "string", description: "Number with country code, digits only, e.g. 2547XXXXXXXX" }),
    defineField({ name: "location", type: "string", initialValue: "Kenya" }),
    defineField({ name: "instagram", type: "url" }),
    defineField({ name: "youtube", type: "url" }),
    defineField({ name: "tiktok", type: "url" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const schemaTypes = [category, photo, project, video, post, service, siteSettings];
