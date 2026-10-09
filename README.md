# ZYD Portfolio

Personal portfolio site for **Zaidan Ghiffari Azhar** — QA Engineer / Web Developer / Project Manager. Public marketing site + full admin CMS (projects, experience, skills, topic pages, media library, inbox, threat board) behind an IP-gated admin area.

> **This README doubles as AI context.** It is kept up to date so any coding assistant can pick up the project cold. Read [Conventions & rules](#conventions--rules-for-ai-assistants) and [Pending rework](#pending-rework) before changing anything. Companion files: `AGENTS.md` (Next.js agent rules — read `node_modules/next/dist/docs/` before writing Next code), `CLAUDE.md` (owner's general guidelines), `NOTES.md` (owner's backlog — **do not "fix" items there without asking**).

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js **16.3.4** App Router (Turbopack dev) — *not* the Next you know from training data |
| Language | **Plain JavaScript** (no TypeScript), `"use client"` components where needed |
| Styling | Global CSS + CSS variables (`src/app/globals.css`) + inline `style={{}}` — no Tailwind/CSS modules (inline styles are scheduled for extraction in an upcoming UI redesign) |
| Auth | NextAuth v5 beta, credentials provider, bcryptjs-hashed seed admin |
| Database | PostgreSQL (**Neon**) via Prisma **5.22** — **`npx prisma db push` only, no migrations** |
| Email | Resend (contact-form notifications) |
| Images | Cloudinary (uploads, server-signed, compressed) + `next/image` optimizer |
| Icons | `react-icons` (fi / ri sets) |
| Lint | ESLint 9 + `eslint-config-next` — **must stay 0 errors / 0 warnings** |

Alias: `@/*` → `./src/*` (jsconfig.json).

---

## Commands

```bash
npm run dev          # next dev (port 3000; dev may occupy 3001 in this workspace)
npm run build        # prisma generate && next build
npm run start        # next start
npm run lint         # eslint . — must be clean
npm run smoke        # scripts/smoke.ps1 — full lint + build + curl E2E (add -SkipBuild for warm re-runs)
npx prisma db push   # apply schema.prisma to Neon (ALWAYS this, never migrate)
```

**Standard verification loop** (run before considering any task done):
1. `npm run lint` → 0/0
2. `npm run build` → clean (never build while a dev server holds `.next` — kill it first)
3. `npm run smoke` → codified login/landing/details E2E (or manual smoke: `next start -p 3000` → curl pages/APIs → kill process)

**Testing admin APIs with curl** (all three are required):
- Auth: login flow via `/api/auth/csrf` → `POST /api/auth/callback/credentials` with cookie jar + `Origin: http://localhost:<port>`
- `Origin` header on every `/api/admin/*` **mutation** (proxy returns 404 without it)
- `X-Forwarded-For: 127.0.0.1` to satisfy the IP gate

---

## Environment variables (names only — values live in `.env.local`, never commit them)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (use the pooled `-pooler` endpoint) |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET` | NextAuth config |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary uploads/destroy |
| `RESEND_API_KEY` | Contact-form email delivery |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Seeded admin login (also used as mail fallback) |
| `ADMIN_ALLOWED_IPS` | Comma-separated IPs allowed to reach `/admin*` (fail-closed gate) |
| `ADMIN_DEVICE_TOKEN` | One-time browser unlock: open `/admin?k=<token>` to get the gate cookie |

> Gotcha: values in `.env.local` may be wrapped in double quotes — trim `"…"` when scripting against the file.

---

## Project structure

```
src/
├── proxy.js                  # Middleware: IP gate + Origin check + probe logging (see Security)
├── app/
│   ├── page.js               # Landing (ISR revalidate = 300)
│   ├── [slug]/               # Dynamic topic pages (data-driven)
│   ├── qa/ webdev/ pm/ gaming/ others/   # Named topic routes (share TopicPageLayout)
│   ├── admin/                # Admin panel (AdminShell + sidebar)
│   │   ├── login/ dashboard(=admin root)/ projects/ experience/ skills/
│   │   ├── details/ topics/[slug]/ media/ inbox/ threats/ settings/ profile/
│   ├── api/
│   │   ├── admin/            # crud, details, inbox, media, probes, profile,
│   │   │                     # settings, topics/[slug]  (session + ADMIN role)
│   │   ├── auth/[...nextauth]/  contact/  profile/  projects/  topics/[slug]/  # public
├── components/
│   ├── sections/             # Hero, About, Skills, Experience, Portfolio, Contact
│   ├── admin/                # AdminShell, AdminSidebar, ConfirmProvider, ImagePicker
│   └── Header, Footer, Reveal (scroll fade-in wrapper), TopicPageLayout, ThemeProvider/ThemeToggle, GrainOverlay, SkillIcon
└── lib/
    ├── prisma.js  auth.js  home-data.js   # data access (getSharedData = single-admin pick)
    ├── safe-url.js           # safeUrl() scheme allowlist for every saved URL
    ├── api-error.js          # maps SyntaxError→400, P2025→404, P2002→409, else 500
    ├── cloudinary.js         # uploadImage (q_auto:good + w_limit:1600) / destroyImage
    ├── media-register.js     # auto-registers external image URLs into the Media library
    └── rate-limit.js         # in-memory checkRateLimit (used by /api/contact)
public/
├── flag/restricted.html      # Honeypot decoy (IP-gate 302 target) — owner-designed, keep behavior
├── videos/                   # Compressed hero video (immutable cache headers)
└── grain.svg                 # Static grain texture
```

### Data model (Prisma — **no relations/FKs between models**)
`User` (single admin: `role`, `avatar`, profile fields) · `Project` (`slug` unique, `imageUrl`, `order`) · `Experience` · `Skill` · `TopicPage` (`slug` unique) · `Media` (library: `url`, `publicId` unique, `source: "upload"|"link"`, `width/height`, `size`) · `ContactMessage` · `SiteDetail` (key/value) · `ProbeLog` (threat board rows).

Selecting the admin: **always `orderBy: { createdAt: 'asc' }`** (`getSharedData`, `/api/profile`, profile-route fallbacks). Never reintroduce unordered `findFirst` — it caused the historical "landing shows wrong admin" bug.

---

## Features

### Public site
- Landing: Hero (text-first on mobile), About (education entries support optional 56px crest thumbnails), Skills (brand-colored `SkillIcon`), Experience, Portfolio (project cards with `next/image` thumbnails), Contact form — all server-fetched with ISR (300s).
- **Scroll fade-in**: `src/components/Reveal.js` + `.reveal` CSS — About/Experience/Skills/Portfolio/Contact fade + rise once when entering the viewport (hero excluded — LCP; dividers static). No `prefers-reduced-motion` override: the owner's OS reports reduce (Windows animations off), which silently disabled it — effects must always play.
- **Card hover glow**: `.glow-hover` — blue ring + lift on project cards; skill cells glow without lifting (they share grid borders). Education rows and experience timeline items are deliberately excluded (owner feedback).
- **Footer socials**: Facebook / Instagram / X / Telegram / Discord icons appended after GitHub / LinkedIn / Email when their URL detail keys are set (empty = hidden; `https://` auto-prefixed).
- Topic pages: `/qa`, `/webdev`, `/pm`, `/gaming`, `/others` + dynamic `/[slug]` via `TopicPageLayout` (intro, focus items, tools, highlights).
- Theme (dark/light) with `ThemeProvider`, grain overlay, slide-down hamburger nav ≤820px.
- SEO/OG metadata from the `site_title` SiteDetail via `generateMetadata()` (`getSiteTitle()` in `home-data.js`), AVIF/WebP via `next/image`, host allowlist in `remotePatterns` (**new image hosts must be added to `next.config.mjs`** — the Cloudinary host was missed once: exact `res.cloudinary.com`, a `*` wildcard does NOT match the bare host).
- Fonts: next/font Google — Spectral (italic display), IBM Plex Mono, Inter. `preload: false` on Spectral/Mono + `crossOrigin: 'anonymous'` → zero font-preload console warnings.

### Admin panel (`/admin`, session required + ADMIN role)
- **Dashboard** with stats incl. threat counts; **Projects / Experience / Skills / Topics** CRUD; **Inbox** (paginated contact messages); **Settings**; **Profile** (full profile editor).
- **Details editor** (`/admin/details`, ~31 `SiteDetail` keys): hero (tagline/focus/status, 2 CTA labels + links, video/poster media pickers, name/based from Profile), about (title/quote), education ×2 (title/place/years/photo), section headings (experience/skills/portfolio + meta suffix + empty state), contact (heading/meta/intro), footer (brand/quote), `site_title`, social link URLs (Facebook/Instagram/X/Telegram/Discord). PUT upserts only the sent keys and calls `revalidatePath('/', 'layout')` → landing copy goes live immediately. Rendered via `lbl`/`input`/`area`/`group` factories so inputs keep identity across re-renders.
- **Collapsible sidebar** (desktop, `admin-main.is-collapsed` centering), **responsive drawer** ≤900px.
- **Sidebar identity block**: avatar + "LOGGED IN AS" + login email — refetches on navigation and on the `profile-updated` window event (instant after profile save).
- **ConfirmProvider** (`useConfirm(message, { danger, confirmText })`) — destructive actions always confirm.
- **Threat board** (`/admin/threats`): `ProbeLog` rows from denied probes (IP-gate blocks, origin violations). Stats are **30-day windowed**: older rows are pruned fail-soft before counting; unique IPs via `COUNT(DISTINCT ip)` (the `groupBy` count was over-counting per-request rows).
- Profile save: validates email, `asSafeUrl()` (auto-prefixes `https://` for bare domains, rejects `javascript:`), `revalidatePath('/', 'layout')` → landing updates instantly.

### Media library (Cloudinary pipeline)
- `/admin/media`: **drag & drop / browse upload** (jpeg/png/webp **and mp4 video**, 5MB cap — client + server), local preview (CSP `img-src` must allow `blob:`), XHR progress, red Cancel.
- Upload path: server-signed Cloudinary upload with `q_auto:good` + `w_limit:1600` (compressed, never upscaled) → `Media` row `source: "upload"`. Videos upload with `resource_type: 'video'` (no image transform) and are destroyed with the matching resource type.
- External URLs: "Add Image URL" secondary toggle → `source: "link"`.
- **Auto-register**: any external image URL saved on a project or the profile avatar is registered into the library automatically (`registerExternalMedia`, idempotent by URL, `publicId = ext_<sha1>`).
- Cards show **Uploaded/External badges**, **"Used in: …"** (scans `Project.imageUrl`, `User.avatar`, and SiteDetail fields — hero video/poster + education photos), Copy URL, Open.
- **Delete warns when in use** ("…still used in X. Delete anyway?"); Cloudinary asset destroyed only for `source: "upload"`.
- **ImagePicker / MediaField** (`src/components/admin/ImagePicker.js`): modal library grid (uploads sorted first), used by Projects editor, Profile avatar, and the Details editor (hero video/poster, education crest photos). `saveMode` (profile): once a value is chosen the primary button becomes **Save** with **"✓ Profile image saved"** indicator beside **Cancel**; save dispatches `profile-updated` → sidebar refreshes.

### Contact & email
- `POST /api/contact`: rate-limited (`lib/rate-limit.js`), stored as `ContactMessage`, notification emailed async via Resend.

### Security
- **`src/proxy.js` middleware**:
  - **Fail-closed IP gate** on `/admin*` + `/api/admin/*`: allowlist `ADMIN_ALLOWED_IPS` (loopback allowed), one-time unlock via `/admin?k=<ADMIN_DEVICE_TOKEN>` sets a gate cookie. Allowed humans → 200; denied humans → **302 decoy** to `/flag/restricted.html`; bots → **404** (confirms nothing).
  - **Origin check** on `/api/admin/*` mutations → 404 if cross-origin (also protects against CSRF).
  - **Probe logging** (fire-and-forget) → `ProbeLog` threat board.
- Security headers on all routes: CSP, HSTS, X-Frame-Options DENY, nosniff, etc. (`next.config.mjs`).
- All saved URLs pass `safeUrl()`/`asSafeUrl()`; API errors mapped honestly via `apiErrorResponse` (never 500 for client mistakes); secrets fail-fast at boot.

### Performance
- Landing ISR 300s; public APIs with cache headers + column selects; server-rendered sections; compressed hero video (−71%); static grain texture; entity-scoped crud selects; memoized theme provider; dead deps pruned.

---

## Feature log

| Date | Commit | Added |
|---|---|---|
| 2026-09-13 | `af189a4`…`ee99afc` | Initial site + first commits |
| 2026-10-03 | `d465acd`…`ff48dbb` | Early updates |
| 2026-10-08 | `9519f9d` | Security foundation: fail-fast secrets, headers, rate limiting, contact hardening |
| 2026-10-08 | `e429fa0` | CSP, hardened cookies, admin Origin check, URL-scheme allowlist |
| 2026-10-08 | `4eb15d4` | Server-side home data + 60s ISR |
| 2026-10-08 | `0a2a1a6` | Hero video −71%, API cache headers, inbox pagination, prod auth/topics fixes |
| 2026-10-08 | `13649f1` | Hamburger nav ≤820px |
| 2026-10-08 | `c2c3f11` | Mobile hero, `next/image` allowlist, OG metadata |
| 2026-10-09 | `3cf6d1c` | Admin responsive drawer sidebar ≤900px, mobile-safe grids/headers |
| 2026-10-09 | `5436da4` `7c21a67` `10d7dfb` | **B9–B11**: fail-closed IP gate + device unlock, probe logging + threat board, `/flag` decoy page |
| 2026-10-09 | `279a5bb`…`3b4e397` | **P1–P4**: perf pass (video, ISR, server sections, dep cleanup) |
| 2026-10-09 | `8ce2dc5` | Admin: ConfirmProvider dialogs, collapsible sidebar, brand skill icons, dashboard threat stats |
| 2026-10-09 | `ae8c6c4` | Admin: profile save/load fixes, structured API errors, deterministic single-admin landing pick, font `crossorigin` |

### Working tree (uncommitted — current batch)
- **README as AI context**: rewritten with tech stack, commands + verification loop, env names, structure, features, conventions, feature log, pending rework; `CLAUDE.md` keeps the owner's user-authored rules.
- **Fonts to zero warnings**: `preload: false` on Spectral/IBM Plex Mono (`layout.js`).
- **Media library rework**: schema (`source/width/height`), Cloudinary SDK integration (`lib/cloudinary.js`), upload/used-by/guarded-delete API, media page upload UI (dropzone/progress/badges/warned delete), **ImagePicker + MediaField**, auto-register (`lib/media-register.js` hooked into crud + profile), one-time import of existing image URLs, `res.cloudinary.com` remotePattern fix, CSP `blob:` fix, red Cancel button.
- **mp4 in the media library**: `ALLOWED_TYPES` += video/mp4, `uploadImage(dataUri, {video})` → `resource_type: 'video'` (no image transform), resource-type-aware destroy, video badges in media page/ImagePicker, CSP `media-src` for Cloudinary video. Powers the Details editor's Hero Video + Poster pickers (`hero_video_url` / `hero_poster_url`).
- **`/admin/details` expanded (~31 keys)**: hero (tagline/focus/status, 2 CTAs, video/poster pickers), about (title/quote), education ×2 (title/place/years/photo), section headings (experience/skills/portfolio + meta + empty state), contact (title/meta/intro), footer (brand/quote), `site_title`, social link URLs. `page.js` passes `details`/`profile` into every section; PUT only upserts sent keys + `revalidatePath('/', 'layout')`.
- **`site_title` → SEO**: `getSiteTitle()` in `home-data.js`; `layout.js` `metadata` → `async generateMetadata()` (title + OG/twitter; `DESCRIPTION` const).
- **Footer brand fix**: plain-text `footerBrand` (missing JSX braces) → `{footerBrand}` — ZYD fallback renders again.
- **ProbeLog stats**: 30-day window (fail-soft prune of older rows before counting) + unique-IP count via `SELECT COUNT(DISTINCT ip)`.
- **Sidebar identity**: avatar + "logged in as" email, `profile-updated` event refresh.
- **Profile save UX**: MediaField `saveMode` (Choose image → Save + "✓ Profile image saved" beside Cancel), `saving` state on both Save buttons.
- **Landing UI batch (owner-approved 5-point plan, all verified via lint/build/curl)**:
  - **Scroll fade-in**: `src/components/Reveal.js` + `.reveal` CSS wraps the 5 sections (hero excluded). Owner couldn't see it → Windows reports `SPI_GETCLIENTAREAANIMATION = 0` → Chrome signals `prefers-reduced-motion: reduce` → the CSS override suppressed it; override removed so effects always play.
  - **Glow hover**: `.glow-hover` on project cards + skill cells (cells glow, no lift). Removed from education/experience rows after owner feedback — hover there looked bad.
  - **Education crest thumbnails**: `edu_1_image`/`edu_2_image` keys + MediaField pickers; 56px `.edu-thumb` (object-fit contain, hides on image error); keys added to the media usedBy scan.
  - **Footer socials**: 5 URL detail keys + `/admin/details` "Social links" inputs; `Footer.js` appends FB → IG → X → Telegram → Discord after GitHub/LinkedIn/Email (empty = hidden, `https://` auto-prefixed).
  - **UI-kit policy** codified in Conventions #2 (cherry-pick source only, never install a styling system).
- **`AboutSection` → `'use client'`**: required to pass `onError` to `next/image` (server components can't take event handlers — only surfaced once an education image was actually set; build had passed because the value was empty).

---

## Conventions & rules for AI assistants

1. **Next.js 16 differs from your training data.** Read the relevant guide in `node_modules/next/dist/docs/` first (mandated by `AGENTS.md`). `next dev` re-adds an agent-rules block to `AGENTS.md` — commit it, don't fight it.
2. **Plain JS, match existing style.** No TypeScript, no new frameworks/styling systems. Inline styles + CSS vars is the current convention (extraction happens in the planned UI redesign — don't preempt it). **UI kits** (Coss UI, Watermelon UI, shadcn) were evaluated and rejected for wholesale adoption — both require Tailwind, which this project deliberately doesn't use. If a kit component is ever useful, cherry-pick its source and restyle it to the existing tokens; never install a styling system.
3. **Never `prisma migrate`** — the project uses `npx prisma db push`. The Prisma engine DLL locks on Windows: **stop the dev server before `db push`/`generate`**.
4. **`npm run lint` must stay 0/0.** The `react-hooks/set-state-in-effect` rule fires on data-fetch effects — the established fix is `// eslint-disable-next-line react-hooks/set-state-in-effect` on the `useEffect` line.
5. **Admin API tests need** cookie auth + `Origin` + `X-Forwarded-For` headers (see Commands).
6. **Every URL that gets stored** must pass through `safeUrl()`/`asSafeUrl()`; API routes use `apiErrorResponse()` — don't hand-roll error responses.
7. **Image hosts**: `next/image` only works for hosts in `remotePatterns` (exact hostnames; bare `res.cloudinary.com` is required — wildcards don't cover it).
8. **Media library is the single source of truth for images.** Save paths auto-register external URLs — keep that hook when touching project/profile saves.
9. **Single-admin selection always `orderBy: createdAt asc`**; profile saves must `revalidatePath('/', 'layout')`.
10. **Don't touch without asking**: `NOTES.md` items (cert images, restricted.html design, admin menu image), `public/flag/restricted.html` behavior (live honeypot), Unsplash 500s ("let them be").
11. **Commits only when the owner asks**; lint+build green before proposing one.
12. Owner reviews in batches with checkpoints — small, verifiable increments preferred.
13. **Don't add `prefers-reduced-motion` opt-outs for landing effects.** The owner's machine reports `reduce` (Windows animations off, `SPI_GETCLIENTAREAANIMATION = 0`), so such overrides silently kill animations the owner asked for — effects must always play unless they say otherwise.

## Pending rework
Tracked in `NOTES.md` (admin menu image, restricted.html redesign, honeypot cert images, admin sidebar restyle) plus the remaining **UI redesign batch** (inline-style → CSS extraction, sidebar restyle). The landing motion/hover/scroll items (fade-in reveal, card glow) landed in the current batch.
