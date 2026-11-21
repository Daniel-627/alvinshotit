import { fetchQuery } from "./sanity";
import * as demo from "./demo";
import type { Category, Photo, ProjectCard, Project, VideoItem, PostCard, Post, Service, Settings } from "./types";

const IMG = `{ "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "lqip": asset->metadata.lqip, alt }`;

export const getSettings = () =>
  fetchQuery<Settings | null>(
    `*[_type=="siteSettings"][0]{ heroTitle, heroSubtitle, email, phone, whatsapp, location, instagram, youtube, tiktok, aboutBody,
      "heroImage": heroImage${IMG}, "aboutPortrait": aboutPortrait${IMG} }`,
    {},
    null
  );

export const getCategories = () =>
  fetchQuery<Category[]>(`*[_type=="category"]|order(order asc){_id,title,"slug":slug.current}`, {}, demo.demoCategories);

export const getPhotos = (onlyFeatured = false) =>
  fetchQuery<Photo[]>(
    `*[_type=="photo"${onlyFeatured ? " && featured==true" : ""}]|order(publishedAt desc){_id,title,"img":image${IMG},"category":category->{_id,title,"slug":slug.current}}`,
    {},
    onlyFeatured ? demo.demoPhotos.slice(0, 8) : demo.demoPhotos
  );

const CARD = `{_id,title,"slug":slug.current,client,date,summary,"cover":cover${IMG},"category":category->title}`;

export const getProjects = (limit = 100) =>
  fetchQuery<ProjectCard[]>(`*[_type=="project"]|order(date desc)[0...${limit}]${CARD}`, {}, demo.demoProjectCards.slice(0, limit));

export const getProject = async (slug: string) => {
  const fallback = demo.demoProjects.find((p) => p.slug === slug) ?? null;
  return fetchQuery<Project | null>(
    `*[_type=="project" && slug.current==$slug][0]{_id,title,"slug":slug.current,client,date,location,summary,story,"cover":cover${IMG},"category":category->title,"gallery":gallery[]${IMG}}`,
    { slug },
    fallback
  );
};

export const getVideos = () =>
  fetchQuery<VideoItem[]>(
    `*[_type=="video"]|order(featured desc, publishedAt desc){_id,title,url,client,kind,description,featured,"thumb":thumbnail${IMG}}`,
    {},
    demo.demoVideos
  );

export const getPosts = () =>
  fetchQuery<PostCard[]>(`*[_type=="post"]|order(publishedAt desc){_id,title,"slug":slug.current,publishedAt,excerpt,"cover":cover${IMG}}`, {}, demo.demoPosts);

export const getPost = (slug: string) =>
  fetchQuery<Post | null>(
    `*[_type=="post" && slug.current==$slug][0]{_id,title,"slug":slug.current,publishedAt,excerpt,body,"cover":cover${IMG}}`,
    { slug },
    demo.demoPosts.find((p) => p.slug === slug) ?? null
  );

export const getServices = () =>
  fetchQuery<Service[]>(`*[_type=="service"]|order(order asc){_id,title,description,startingFrom,includes}`, {}, demo.demoServices);
