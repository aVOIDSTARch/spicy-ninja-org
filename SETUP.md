# spicyninja.org — Local Setup

This project uses **Vite+** (`vp`), a unified JavaScript toolchain by VoidZero.
Install `vp` globally once before anything else.

---

## 1. Install `vp` (one-time, global)

```bash
curl -fsSL https://vite.plus | bash
```

Open a **new terminal window** after installation, then verify:

```bash
vp help
```

Vite+ manages Node.js and your package manager automatically.
To opt out of that behaviour: `vp env off`

---

## 2. Clone the repo

```bash
git clone https://github.com/aVOIDSTARch/spicy-ninja-org.git
cd spicy-ninja-org
```

---

## 3. Install dependencies

```bash
vp install
```

---

## 4. Start the dev server

```bash
vp dev
```

Site runs at **http://localhost:5173** by default.

---

## 5. Daily workflow

| Task | Command |
|---|---|
| Start dev server | `vp dev` |
| Format + lint + type-check | `vp check` |
| Run tests | `vp test` |
| Production build | `vp build` |
| Preview production build | `vp preview` |
| Add a dependency | `vp add <package>` |
| Remove a dependency | `vp remove <package>` |
| Upgrade `vp` itself | `vp upgrade` |

---

## Stack

| Layer | Tool |
|---|---|
| Toolchain | Vite+ (`vp`) |
| Build / dev server | Vite 8 + Rolldown |
| Framework | React 18 + TypeScript |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 (CSS-native `@theme`) |
| Linting | Oxlint (via `vp check`) |
| Formatting | Oxfmt (via `vp check`) |
| Testing | Vitest (via `vp test`) |
| Deployment | Netlify |

---

## Route map

```
/          → Home / hero
/syllabus  → Listening curriculum (four modules)
/project   → Jus Pulsus documentation
/blog      → Process journal
/about     → Artist
```

---

## Notes for Claude

When returning to this project:
1. Re-fetch https://viteplus.dev/guide — alpha software, check for API changes
2. Read this file and README.md before writing any code
3. Vite+ SKILL.md lives at `/home/claude/skills/vite-plus/SKILL.md`
4. `import { defineConfig } from 'vite-plus'` — NOT `'vite'`
5. `import { ... } from 'vite-plus/test'` — NOT `'vitest'`
6. One file per commit, atomic and professional — user-wide preference
7. Always run `vp dev` to verify the build boots before declaring done
