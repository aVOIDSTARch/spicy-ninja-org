# spicyninja.org

A public education in making *Jus Pulsus: A Cosmogony in Four Movements* —
a 90-minute programmatic electronic suite currently in pre-composition.

This site documents every step: the listening curriculum, the theory, the
compositional decisions, and the philosophical ideas that drive the work.
It is a composer's notebook made public from the beginning.

---

## Development

```bash
pnpm install
cp .env.example .env    # then set PUBLIC_AUTH_PASSPHRASE_HASH (see below)
pnpm dev                # http://localhost:4321
```

## Build

```bash
pnpm build              # outputs to dist/
pnpm preview            # serve dist/ locally
```

## Auth

Admin access is via a hidden keystroke combination (not documented here).
The passphrase hash is set in `.env` as `PUBLIC_AUTH_PASSPHRASE_HASH`.

Generate a hash:
```bash
node -e "const c=require('crypto');console.log(c.createHash('sha256').update('YOUR_PASS').digest('hex'))"
```

**Changing the passphrase requires a full rebuild and redeploy.**

The hash is baked into the client bundle at build time. This is intentional
and safe — the hash is not the secret.

## Deploy

See `DEPLOY.md` for homeserver instructions (Nginx + rsync or Docker).

## Content authoring

All content lives in `src/content/` as MDX files.

| Collection | Path | How to add |
|---|---|---|
| Project Track works | `src/content/project-track/` | Edit existing MDX, set `draft: false` |
| Montessori nodes | `src/content/montessori/roots/` or `branches/` | Add new MDX matching schema |
| Fundamentals lessons | `src/content/fundamentals/[branch]/` | Add new MDX |
| Blog posts | `src/content/blog/` | Use `/blog/compose` → Export → drop file here |
| Listening journal | `src/content/listening-journal/` | Use `/journal/new` → Export → drop file here |
| Project docs | `src/content/project/` | Add MDX with title, order, description |

After adding content: `pnpm build` then redeploy `dist/`.

## Stack

- [Astro 6](https://astro.build) — static site generator
- [Tailwind CSS v4](https://tailwindcss.com) — via Vite plugin
- [pnpm](https://pnpm.io) — package manager
- Node ≥ 22.12

## Scripts

| Command | Action |
|---|---|
| `pnpm dev` | Dev server at localhost:4321 |
| `pnpm build` | Production build → `dist/` |
| `pnpm preview` | Serve built output locally |
| `pnpm lint` | Run oxlint |
| `pnpm check` | Type check via vite-plus |
