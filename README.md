# Alvin Shot It: portfolio

Next.js (App Router) + Sanity + Tailwind. Photography first, with a separate Videos page.

## Setup
1. Create a Sanity project at https://sanity.io/manage (free plan is fine) and copy the project ID.
2. `cp .env.example .env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. In the Sanity project's API settings, add CORS origins `http://localhost:3000` and your live domain (allow credentials).
4. `npm install && npm run dev`
5. Open http://localhost:3000/studio, sign in, and add content.

Until a project ID is set, the site shows demo content so you can see the design.

## Content model (Studio)
- **Site settings**: hero text, about story and portrait, contact details, social links (one document, create it once)
- **Category**, **Photo**: the filterable Portfolio page (tick "featured" to show on Home)
- **Project**: case-study pages with story and gallery
- **Video**: paste a YouTube or Vimeo URL; add a thumbnail if you like
- **Journal post**, **Service**

## Deploy
Push to GitHub, import into Vercel, add the same env vars. Pages revalidate every 60 seconds, so edits in Studio appear within a minute.

## Notes
- Contact form opens WhatsApp or email with the message pre-filled (no backend needed).
- Fonts (Outfit, Inter) are self-hosted via Fontsource.
- Logo files are in `public/` as transparent PNGs; swap in an SVG when you have one.
