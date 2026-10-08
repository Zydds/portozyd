# Backlog Notes

Loose ends deliberately deferred by the owner. Do not "fix" without asking.

## Pending rework
- **Admin menu image** — owner wants to rework how the admin menu image works (design/mechanism TBD). Schedule after the current batch roadmap.

## Known issues left alone ("let them be")
- **Unsplash project image → 500** — owner observed a 500 on the projects-section image served through `/_next/image` (host: `images.unsplash.com`, allowlisted). `next build` + `next start` prod checks returned 200 in CLI testing; possibly dev-server or transient upstream. Leave as-is for now.
