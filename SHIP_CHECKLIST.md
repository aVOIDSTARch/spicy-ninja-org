# spicyninja.org — Ship Checklist
> Audit date: 2026-04-10 · Target: homeserver deploy tomorrow
> Stack: Astro 6 · Tailwind CSS v4 · pnpm · Node ≥22.12

---

## 1. BLOCKING — Must fix before deploy

### 1.1 Auth passphrase
- [ ] Replace placeholder passphrase `spicyninja` in `.env` with a real secret
- [ ] Regenerate hash: `node -e "const c=require('crypto');console.log(c.createHash('sha256').update('YOUR_PASS').digest('hex'))"`
- [ ] Confirm `.env` is in `.gitignore` (it is — verify before push to any public remote)

### 1.2 Environment variable exposure
- `PUBLIC_AUTH_PASSPHRASE_HASH` is baked into the client bundle at build time.
  This is acceptable (it is a hash, not the secret) but must be documented so you
  don't accidentally rotate the hash and break login without rebuilding.
- [ ] Add a note to the ops runbook: **changing the passphrase requires a full rebuild and redeploy**

### 1.3 Missing `/montessori/journeys` routes
- `src/pages/montessori/index.astro` and `[slug].astro` exist
- `/montessori/journeys`, `/montessori/journeys/[journey]`, and
  `/montessori/journeys/[journey]/[phase]` do **not** exist as page files
- The Björk Bodysuit journey is in the spec and nav but has no content or route
- [ ] Either add stub pages with honest "not yet" state, or remove the nav link
  until content exists — **broken nav link is worse than no link**

### 1.4 README is the Astro starter template
- `README.md` is the default "Seasoned astronaut?" Astro starter — completely wrong
- [ ] Replace with project README (see Section 5 for content)

### 1.5 `src/content/fundamentals/.gitkeep`
- A `.gitkeep` file exists in the fundamentals directory alongside real content
- It does nothing harmful but is noise and was supposed to be deleted
- [ ] `git rm src/content/fundamentals/.gitkeep`

### 1.6 `project-track` order schema still uses `.positive()`
- `src/content/config.ts` line: `order: z.number().int().positive()`
  for the `projectTrack` collection — rejects `order: 0`
- All 22 project-track files use `order: 1+` so this doesn't currently break,
  but it's inconsistent with the fix already applied to fundamentals/project
- [ ] Change to `z.number().int().min(1)` for clarity, or `min(0)` for consistency

---

## 2. DEPLOY INFRASTRUCTURE — Required to run on homeserver

### 2.1 No deployment configuration exists
Zero of the following exist in the repo:
- `Dockerfile`
- `docker-compose.yml`
- `nginx.conf` or reverse proxy config
- `.github/workflows/` (no CI/CD)
- Any process manager config (`pm2`, `systemd` unit file)

This is a static site (`astro build` → `dist/`). Serving options for homeserver:

**Option A — simplest: Nginx serving static dist/**
```nginx
server {
    listen 80;
    server_name spicyninja.local;  # or your domain
    root /var/www/spicy-ninja-org/dist;
    index index.html;
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
}
```

**Option B — Docker + Nginx**
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install && pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

- [ ] Decide on serving strategy (Nginx bare metal vs Docker)
- [ ] Create `Dockerfile` and/or `nginx.conf`
- [ ] Create `docker-compose.yml` if using Docker (recommended for homeserver)
- [ ] Document the `.env` injection method at deploy time (not in image)

### 2.2 No build pipeline
- [ ] Create a deploy script: `git pull && pnpm install && pnpm build && rsync dist/ ...`
- [ ] Or set up a GitHub Actions workflow that builds and pushes to homeserver on merge to `main`

### 2.3 Node version pinning
- `package.json` specifies `"node": ">=22.12.0"` — confirm homeserver has Node 22+
- [ ] `node --version` on homeserver
- [ ] Add `.nvmrc` or `.node-version` file: `22.12.0`

---

## 3. MISSING FEATURES — Incomplete from spec

### 3.1 Montessori journey routes (spec-defined, not built)
| Route | Status |
|---|---|
| `/montessori/journeys` | ❌ Missing |
| `/montessori/journeys/[journey]` | ❌ Missing |
| `/montessori/journeys/[journey]/[phase]` | ❌ Missing |
| `src/content/journeys/` | ❌ Empty (0 files) |

- The Björk Bodysuit journey is referenced in Montessori node data (`journeySeeds`)
  but has no content or route to land on
- [ ] Add stub journey index page or remove `journeySeeds` references from node data

### 3.2 Empty content collections
| Collection | Files | Impact |
|---|---|---|
| `blog/` | 0 | Blog index shows empty state — expected, graceful |
| `listening-journal/` | 0 | Journal index shows empty state — expected, graceful |
| `project/` | 0 | Project index shows empty state — **this should have content** |
| `community/` | 0 | Honest stub — expected |
| `journeys/` | 0 | Journey routes broken — see 3.1 |

- The `project/` collection is meant to hold vision, structure, characters, and decisions
  documents from the cosmogony repo — these exist locally in `/Users/louisc/art/cosmogony/`
  and should be adapted to MDX
- [ ] Create at minimum `src/content/project/vision.mdx` so `/project` isn't empty

### 3.3 Montessori tree: missing node types
- Only `root` and `branch` nodes exist (9 nodes total)
- No `leaf` nodes, no `seed` nodes
- The Björk Bodysuit journey seed is referenced but has nowhere to land
- [ ] Add `bjork-bodysuit` as a journey seed node pointing to the journey route
  (even if journey content doesn't exist yet — the node should exist)

### 3.4 Project Track: all 22 works are `draft: true`
- All `src/content/project-track/w01` through `w22` have `draft: true`
- The project-track index page filters `!data.draft` — **zero works appear**
- [ ] Set `draft: false` on at minimum the first module (w01–w05) to make the
  track functional as a public resource
- Note: this is intentional per spec ("invisible until you edit") but needs a decision
  before launch — an empty syllabus is worse than a partial one

### 3.5 About page content
- `about.astro` has real content describing the project but it reads like a draft
  and references `me.md` and `direction.md` from the cosmogony repo
- Per the project notes: "Artist-voice revision of `me.md` and `direction.md`
  before publication" is a known open item
- [ ] Review about page text before going live

### 3.6 Blog composer `/blog/compose` auth gate is client-side only
- The page redirects unauthenticated users via `window.location.replace('/')`
- With `astro build` (static output), the HTML of the page is still publicly accessible
  if someone knows the URL — the redirect is a JS guard, not a server guard
- This is acceptable per the spec ("You are the only user") but should be documented
- [ ] Add a comment in `compose.astro` explaining the intentional scope of this guard

---

## 4. TESTING — Currently zero tests

### 4.1 No test files exist
`pnpm test` is defined in `package.json` via `vite-plus` but no test files exist anywhere.

### 4.2 Recommended test suite for this stack

**Critical path — auth flow**
```typescript
// tests/auth.test.ts
import { describe, it, expect } from 'vitest'
import { sha256, isAuthenticated, writeAuthToken, clearAuthToken } from '../src/lib/auth'

describe('sha256', () => {
  it('produces a 64-char hex string', async () => {
    const h = await sha256('test')
    expect(h).toHaveLength(64)
    expect(h).toMatch(/^[0-9a-f]+$/)
  })
  it('is deterministic', async () => {
    expect(await sha256('spicyninja')).toBe(await sha256('spicyninja'))
  })
})

describe('token lifecycle', () => {
  it('starts unauthenticated', () => {
    localStorage.clear()
    expect(isAuthenticated()).toBe(false)
  })
  it('authenticates after writeToken', () => {
    writeAuthToken()
    expect(isAuthenticated()).toBe(true)
  })
  it('clears on clearToken', () => {
    clearAuthToken()
    expect(isAuthenticated()).toBe(false)
  })
})
```

**Content validation — schemas**
```typescript
// tests/content.test.ts
// Verify all existing MDX files pass their schema
// Use getCollection() in a test context
```

**Build smoke test**
```bash
# In CI or deploy script:
pnpm build && test -f dist/index.html && test -f dist/montessori/index.html
```

- [ ] Install Vitest: `pnpm add -D vitest @vitest/ui jsdom`
- [ ] Add `vitest.config.ts` with `environment: 'jsdom'` for localStorage tests
- [ ] Write `tests/auth.test.ts` — the auth module is the highest-stakes logic
- [ ] Write `tests/content-schema.test.ts` — validate all MDX frontmatter
- [ ] Add `"test": "vitest run"` script (replace or supplement current vite-plus test)
- [ ] Add a build smoke test to the deploy script

### 4.3 Linting
- `oxlint` is installed and `pnpm lint` is defined
- [ ] Run `pnpm lint` before deploy and fix any errors
- [ ] Confirm `oxlint` config covers `.astro` files (it may not — Astro support in oxlint is partial)

---

## 5. DOCUMENTATION — Currently none

### 5.1 README must be replaced
Current README is the Astro starter template. Needed:

```markdown
# spicyninja.org

Public education in making *Jus Pulsus* — music theory, composition,
and the art of listening. Built with Astro 6 + Tailwind CSS v4.

## Development
pnpm install
cp .env.example .env   # set PUBLIC_AUTH_PASSPHRASE_HASH
pnpm dev

## Auth
Admin access via keystroke combo (not documented here intentionally).
Passphrase hash set in .env. Changing passphrase requires full rebuild.

## Deploy
pnpm build            # outputs to dist/
# Serve dist/ with Nginx or Docker — see DEPLOY.md

## Content
src/content/          # all MDX content collections
src/pages/            # all routes
src/components/       # Astro components
src/lib/auth.ts       # client-side auth utilities
```

- [ ] Write `README.md`
- [ ] Write `DEPLOY.md` with homeserver-specific instructions
- [ ] Write `CONTENT.md` explaining how to author and publish content

### 5.2 Ops runbook (minimum viable)
A single markdown file covering:
- How to change the passphrase
- How to rebuild and redeploy after a content change
- How to add a new Montessori node
- How to publish a blog post (compose → export → drop in → set draft:false → rebuild)
- How to publish a listening journal entry (same flow)
- Backup strategy for localStorage data (it doesn't sync — `Export .md` is the only persistence)

- [ ] Write `OPS.md`

---

## 6. KNOWN BUGS — Not yet fixed

| # | Location | Description | Severity |
|---|---|---|---|
| 1 | `src/content/config.ts` | `projectTrack.order` uses `.positive()` — inconsistent with other collections | Low |
| 2 | `src/pages/journal/new.astro` | `kind` field in export frontmatter doesn't match `listeningJournal` schema field name (`work` vs `kind`) — journal exports may fail schema validation | Medium |
| 3 | `src/pages/montessori/index.astro` | Node panel prereq links use bare slug as display text — should look up node title | Low |
| 4 | All zone pages | `zone-spacer` at 60vh means content starts very far below fold on lesson/detail pages — may want 35-40vh on inner pages | Low |
| 5 | `src/components/ui/RawIdeasPanel.astro` | `MutationObserver` watching `body.classList` for auth state — works but couples two components implicitly. If auth mechanism changes, this silently breaks | Low |
| 6 | `src/pages/montessori/[slug].astro` | Prerequisite links display the raw slug, not the node title | Low |

---

## 7. DEPLOY SEQUENCE — Tomorrow

Assuming Nginx on homeserver (bare metal, simplest path):

```bash
# On Mac — build
cd /Users/louisc/my-progs/websites/spicy-ninja-org
cp .env.example .env          # edit: set real passphrase hash
pnpm install
pnpm build                    # → dist/

# Transfer to homeserver
rsync -avz --delete dist/ homeserver:/var/www/spicy-ninja-org/

# On homeserver — Nginx config
sudo nano /etc/nginx/sites-available/spicy-ninja-org
# (paste Nginx config from 2.1 above)
sudo nginx -t && sudo systemctl reload nginx
```

**Pre-deploy checklist (run in order):**
```
[ ] Set real passphrase in .env
[ ] pnpm build — confirm 68+ pages, zero errors
[ ] pnpm lint — zero errors
[ ] Open dist/index.html in browser and verify fonts load
[ ] Test auth flow: keystroke → modal → passphrase → admin bar appears
[ ] Test TOC: scroll down → collapses, click handle → reopens
[ ] Test Notes panel: appears on fundamentals lesson pages when logged in only
[ ] Test Ideas FAB: appears when logged in, hidden when logged out
[ ] Test Montessori tree: roots start Available, clicking node opens panel
[ ] Set draft:false on at least w01-w05 project-track works OR document that the empty syllabus is intentional
[ ] Replace README.md
[ ] rsync dist/ to homeserver
[ ] Verify site loads on homeserver URL
[ ] Test auth on homeserver (localStorage behaves differently cross-origin)
```

---

## 8. WHAT IS WORKING

For completeness — what does not need attention:

| Feature | Status |
|---|---|
| Build: 68 pages, zero errors | ✅ |
| Auth: keystroke → modal → token → admin bar | ✅ (fixed: `is:global`) |
| Auth: 30-day localStorage token | ✅ |
| Auth: Notes trigger hidden until logged in | ✅ |
| Auth: Ideas FAB hidden until logged in | ✅ |
| Auth: `/journal/new` and `/blog/compose` redirect if not authed | ✅ |
| Nav: rail + mobile drawer, active state | ✅ |
| Theme: Woodblock dark / Red Lacquer light toggle | ✅ |
| Parallax: 4-layer SVG silhouette scenes, 9 zones | ✅ |
| Fundamentals: 25 lessons across 5 branches | ✅ |
| Fundamentals: TOC slide/collapse with explicit icon | ✅ |
| Fundamentals: Course Notes panel (auth-gated) | ✅ |
| Fundamentals: Bach Math interactive tool at `/tools/bach-math/` | ✅ |
| Montessori: 9 nodes (3 roots, 6 branches), SVG tree map | ✅ |
| Montessori: locked/available/complete state via localStorage | ✅ |
| Montessori: node detail pages with progress button | ✅ |
| Project Track: 22 works defined (all draft:true) | ✅ schemas |
| Blog: compose page with 6 formats, autosave, export | ✅ |
| Journal: new entry page with 4-layer format, autosave, export | ✅ |
| Ideas panel: global capture with tag + URL + timestamp | ✅ |
| Homepage: real landing page with 3-path cards | ✅ |
| Fonts: Kaisei Decol + Shippori Mincho + JetBrains Mono | ✅ |
| PostCSS: Google Fonts via `<link>` not `@import` | ✅ |

---

*Generated by audit on 2026-04-10. Update this file after each deploy.*
