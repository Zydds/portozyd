# Backlog Notes

Loose ends deliberately deferred by the owner. Do not "fix" without asking.

## Pending rework
- **Admin menu image** — owner wants to rework how the admin menu image works (design/mechanism TBD). Schedule after the current batch roadmap.
- **Admin sidebar redesign (social-media style)** — owner wants the sidebar to show the admin avatar + "logged in as [email]". `User.avatar` is now settable via the media-library picker (uploaded to Cloudinary), so the data side is ready; actual sidebar restyle waits for the UI redesign batch.
- **`public/flag/restricted.html` design is a prototype** — it is the live honeypot lure (proxy gate 302 target) and works as-is; owner will redesign later. Keep behavior when restyling.
- **Honeypot cert images** — page references `public/certs/cert-1.jpg` / `cert-2.jpg` (graceful "coming soon" fallback until files exist).

## Known issues left alone ("let them be")
- **Unsplash project image → 500** — owner observed a 500 on the projects-section image served through `/_next/image` (host: `images.unsplash.com`, allowlisted). `next build` + `next start` prod checks returned 200 in CLI testing; possibly dev-server or transient upstream. Leave as-is for now.

## Superseded plans
- Old B11 idea of a `/flag` decoy page — replaced by owner-provided `public/flag/restricted.html` (same role: human-facing lure for the admin IP gate; bots still get 404).
