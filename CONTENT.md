# CONTENT.md — Content authoring guide for spicyninja.org

All content lives in `src/content/` as MDX files.
After any content change: `pnpm build` then redeploy.

---

## Project Track works — `src/content/project-track/`

Files are named `w01-slug.mdx` through `w22-slug.mdx`.
All 22 files exist. Edit the body; frontmatter is already set.

Key frontmatter fields:
```yaml
title: "Work Title"
composer: "Composer Name"
year: "1936"
module: 1               # 1–4
order: 1                # 1–22
youtubeQuery: "search query for YouTube"
listenFor:
  - "What to notice on first listen"
teaches:
  - "What this teaches compositionally"
draft: false            # set true to hide from public
```

---

## Montessori nodes — `src/content/montessori/`

Roots have no prerequisites. Branches require at least one root.

```yaml
title: Node Title
type: root              # root | branch | leaf | seed
prerequisites: []       # bare slugs (filename without .mdx)
unlocks: []
connectsToProject: []   # free-form strings, informational
journeySeeds: []        # journey slugs this node seeds
fundamentalsBranch: null # or: bach-math | markov-chains | music-theory | composition | characters
description: One sentence shown in the tree panel and node page header.
draft: false
```

After adding a node, also add it to `COORDS` and `CONNECTIONS`
in `src/pages/montessori/index.astro` so it appears on the map.

---

## Fundamentals lessons — `src/content/fundamentals/[branch]/`

Branches: `bach-math`, `markov-chains`, `music-theory`, `composition`, `characters`

```yaml
title: Lesson Title
branch: bach-math        # must match directory name
order: 1                 # 0 = overview, 1+ = numbered lessons
montessoriNode: fugue-and-counterpoint  # optional slug
description: Brief description shown on branch index.
draft: false
```

Overview files use `order: 0`. Numbered lessons use `order: 1`, `2`, etc.

---

## Blog posts — `src/content/blog/`

Use `/blog/compose` (logged in) to write and export. Or author manually:

```yaml
title: Post Title
date: 2026-04-10        # YYYY-MM-DD
description: One sentence shown on the index card.
format: reflection      # reflection | session-log | breakthrough | question | reference | sketch
derivedFromJournal: null  # or: slug of source journal entry
commentsEnabled: false
commentsPublic: false
draft: false
```

Filename convention: `YYYY-MM-DD-slug.mdx`

---

## Listening journal — `src/content/listening-journal/`

Use `/journal/new` (logged in) to write and export. Or author manually:

```yaml
title: "Work Title"
date: 2026-04-10
work: "Symphony No. 8"
composer: "Shostakovich"
module: "Module 01"     # or null
layers:
  naked: |
    Raw, unguided impression.
  inhabited: |
    Listening with biographical and historical context.
  anatomical: |
    Score in hand, structural analysis.
  notebook: |
    Compositional notes and connections to Jus Pulsus.
publishedAsPost: null   # or: slug of derived blog post
draft: false
```

Filename convention: `YYYY-MM-DD-work-slug.mdx`

---

## Project documents — `src/content/project/`

```yaml
title: Document Title
order: 1                # controls sort order on /project index
status: core            # core | likely | explore
description: Brief description shown on index.
draft: false
```

Planned documents: vision (✅), structure, characters, decisions.

---

## Community submissions — `src/content/community/`

Not yet open. Future format:
```yaml
type: listening         # listening | question | resonance
content: "Submission text"
submittedAt: 2026-04-10
public: false
approved: false
```
