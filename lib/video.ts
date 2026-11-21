export function parseVideo(url: string): { embed: string; thumb?: string } | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return { embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`, thumb: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` };
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v") || u.pathname.split("/").pop();
      return { embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`, thumb: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` };
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return { embed: `https://player.vimeo.com/video/${id}?autoplay=1` };
    }
  } catch {}
  return null;
}
