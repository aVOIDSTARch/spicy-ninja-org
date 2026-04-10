# OPS.md — spicyninja.org Operations Runbook

---

## Change the passphrase

The passphrase hash is baked into the client bundle at build time.
Changing it requires a full rebuild and redeploy.

```bash
# 1. Generate new hash
node -e "const c=require('crypto');console.log(c.createHash('sha256').update('YOUR_NEW_PASS').digest('hex'))"

# 2. Update .env
echo "PUBLIC_AUTH_PASSPHRASE_HASH=<new_hash>" > .env

# 3. Rebuild and redeploy (see deploy section below)
```

---

## Deploy (Docker — recommended for homeserver)

```bash
cd /Users/louisc/my-progs/websites/spicy-ninja-org

# Pull latest
git pull origin main

# Run tests
pnpm test

# Build and restart container
export PUBLIC_AUTH_PASSPHRASE_HASH=$(grep PUBLIC_AUTH .env | cut -d= -f2)
docker compose up -d --build
```

## Deploy (Nginx bare metal)

```bash
cd /Users/louisc/my-progs/websites/spicy-ninja-org
git pull origin main
pnpm install
pnpm build

# Smoke test
test -f dist/index.html && test -f dist/montessori/index.html && echo "OK"

# Transfer
rsync -avz --delete dist/ homeserver:/var/www/spicy-ninja-org/
```

---

## Add a Montessori node

1. Create MDX in `src/content/montessori/roots/` or `branches/`
2. Frontmatter must match the schema in `src/content/config.ts`:
   ```yaml
   title: Node Title
   type: root          # root | branch | leaf | seed
   prerequisites: []   # slugs of nodes that must be completed first
   unlocks: []         # slugs this node unlocks
   connectsToProject: []
   journeySeeds: []
   fundamentalsBranch: null  # or: bach-math | markov-chains | music-theory | composition | characters
   description: One sentence shown in the tree panel.
   draft: false
   ```
3. Add coordinates to `COORDS` in `src/pages/montessori/index.astro`
4. Add connections to `CONNECTIONS` in the same file
5. `pnpm build` and redeploy

---

## Publish a blog post

1. Visit `/blog/compose` while logged in
2. Select format, fill title/description/date/body
3. Click **Export .mdx** — file downloads
4. Drop file into `src/content/blog/`
5. Set `draft: false` in the frontmatter
6. `pnpm build` and redeploy

---

## Publish a listening journal entry

1. Visit `/journal/new` while logged in
2. Fill work, composer, date, and all four layers
3. Click **Export .mdx** — file downloads
4. Drop file into `src/content/listening-journal/`
5. Set `draft: false` in the frontmatter
6. `pnpm build` and redeploy

---

## Publish a project document

1. Create or edit MDX in `src/content/project/`
2. Required frontmatter:
   ```yaml
   title: Document Title
   order: 2            # controls sort order on /project index
   status: core        # core | likely | explore
   description: Brief description shown on index.
   draft: false
   ```
3. `pnpm build` and redeploy

---

## Backup localStorage data

The Notes panel and Ideas panel store data in the **browser's localStorage** only.
They do not sync to the repo. The only persistence mechanism is Export.

**Before clearing browser data or switching browsers:**
- On any fundamentals lesson page: open Notes panel → **Export .md**
- On any page while logged in: open Ideas panel → **Export .md**
- Drop exported files into a safe location (e.g. `src/content/notes/`)

---

## Run tests

```bash
pnpm test           # run once
pnpm test:watch     # watch mode during development
```

---

## Lint

```bash
pnpm lint           # checks src/lib/ only (oxlint)
```

Note: oxlint does not parse `.astro` files. Astro type checking is handled by `pnpm check`.
