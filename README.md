# Alvin Shot It: portfolio + admin

Next.js (App Router) + Sanity (data only) + Tailwind. Photography first, with a separate Videos page.
Everything is managed from your own admin at `/admin`. Sanity Studio at `/studio` remains as a fallback.

## 1. Sanity
1. Create a project at https://sanity.io/manage and copy the **project ID**.
2. API → Tokens → add a token with the **Editor** role. Copy it once (it is shown only once).
3. API → CORS origins → add `http://localhost:3000` and your live URL (allow credentials, only needed for /studio).

## 2. Environment variables
`cp .env.example .env.local` (PowerShell: `Copy-Item .env.example .env.local`) and fill in:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SITE_URL` | Live site URL |
| `SANITY_WRITE_TOKEN` | Editor token. Server only |
| `ADMIN_PASSWORD` | Password for /admin |
| `ADMIN_SESSION_SECRET` | Random string, 16+ chars. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

Never put the last three behind a `NEXT_PUBLIC_` prefix. On Netlify, add all of them under Site configuration → Environment variables.

## 3. Run
```
npm install
npm run dev
```
Site: http://localhost:3000 · Admin: http://localhost:3000/admin

Until a project ID is set, the public site shows demo content.

## Dummy content
```
npm run seed          # adds 5 categories, 4 projects, 5 videos, 4 services and site settings
npm run seed:reset    # removes only the dummy content (ids starting with "seed-")
```
Needs Node 20.6+ and the project ID + write token in `.env.local`. Safe to re-run: it never overwrites anything you edited. Photos and images are not seeded, so upload your own in `/admin`. Seeded projects show a grey placeholder until you add a cover, and videos use a sample YouTube link until you replace it.

## Admin
- **Photos**: drag in many photos at once, pick a category, mark as featured for the home page. Large photos are resized in the browser to 2400px before upload (keeps requests under Netlify's ~6 MB limit).
- **Categories**: the filter tabs on the Portfolio page.
- **Projects**: case-study pages with cover, story, gallery (reorder with the arrows).
- **Videos**: paste a YouTube or Vimeo link.
- **Services** and **Site settings**: headline, about story and portrait, contact details, social links.

Saving updates the live site immediately.

## Security notes
- `/admin` and `/api/admin/*` are guarded by `proxy.ts`, and every server action and the upload route re-check the session.
- Session cookie is HTTP-only, signed, and lasts 7 days.
- The write token is only read in server code (`lib/sanity-admin.ts`).
- Use a long, unique admin password.
