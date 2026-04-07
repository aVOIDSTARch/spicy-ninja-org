import { defineCollection, z } from 'astro:content'
import { glob, file } from 'astro/loaders'

// ─────────────────────────────────────────────────────────
//  PROJECT TRACK — 8 works, 4 modules, 4-layer methodology
// ─────────────────────────────────────────────────────────
const projectTrack = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/project-track' }),
  schema: z.object({
    title:        z.string(),
    composer:     z.string(),
    year:         z.string(),
    module:       z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    workNumber:   z.string(),
    recording:    z.string().optional(),
    youtubeQuery: z.string(),
    listenFor:    z.array(z.string()),
    teaches:      z.array(z.string()),
    draft:        z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────────────────
//  MONTESSORI TREE NODES
// ─────────────────────────────────────────────────────────
const montessori = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/montessori' }),
  schema: z.object({
    title:              z.string(),
    type:               z.enum(['root', 'branch', 'leaf', 'seed']),
    prerequisites:      z.array(z.string()).default([]),
    unlocks:            z.array(z.string()).default([]),
    connectsToProject:  z.array(z.string()).default([]),
    journeySeeds:       z.array(z.string()).default([]),
    fundamentalsBranch: z.string().nullable().default(null),
    description:        z.string().optional(),
    draft:              z.boolean().default(false),
  }),
})

// ─────────────────────────────────────────────────────────
//  BESPOKE JOURNEYS — Björk Bodysuit inaugural
// ─────────────────────────────────────────────────────────
const journeys = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/journeys' }),
  schema: z.object({
    title:       z.string(),
    journey:     z.string(),
    phase:       z.number().optional(),
    isOverview:  z.boolean().default(false),
    artist:      z.string().optional(),
    seedsNodes:  z.array(z.string()).default([]),
    description: z.string().optional(),
    draft:       z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────────────────
//  FUNDAMENTALS — theory, composition, characters
// ─────────────────────────────────────────────────────────
const fundamentals = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/fundamentals' }),
  schema: z.object({
    title:          z.string(),
    branch:         z.enum([
      'bach-math', 'markov-chains', 'music-theory', 'composition', 'characters',
    ]),
    order:          z.number(),
    montessoriNode: z.string().optional(),
    description:    z.string().optional(),
    draft:          z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────────────────
//  LISTENING JOURNAL — 4-layer format, private
// ─────────────────────────────────────────────────────────
const listeningJournal = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/listening-journal' }),
  schema: z.object({
    title:           z.string(),
    date:            z.date(),
    work:            z.string(),
    composer:        z.string(),
    module:          z.string().nullable().default(null),
    layers: z.object({
      naked:     z.string().optional(),
      inhabited: z.string().optional(),
      anatomical:z.string().optional(),
      notebook:  z.string().optional(),
    }).default({}),
    publishedAsPost: z.string().nullable().default(null),
    draft:           z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────────────────
//  BLOG — multi-format card blocks
// ─────────────────────────────────────────────────────────
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title:              z.string(),
    date:               z.date(),
    description:        z.string(),
    format:             z.enum([
      'reflection', 'session-log', 'breakthrough', 'question', 'reference', 'sketch',
    ]),
    derivedFromJournal: z.string().nullable().default(null),
    commentsEnabled:    z.boolean().default(false),
    commentsPublic:     z.boolean().default(false),
    draft:              z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────────────────
//  PROJECT DOCS — Jus Pulsus vision, structure, etc.
// ─────────────────────────────────────────────────────────
const project = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/project' }),
  schema: z.object({
    title:       z.string(),
    order:       z.number(),
    status:      z.enum(['core', 'likely', 'explore']).default('core'),
    description: z.string().optional(),
    draft:       z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────────────────
//  COMMUNITY SUBMISSIONS — approval-gated, public toggle
// ─────────────────────────────────────────────────────────
const community = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/community' }),
  schema: z.object({
    type:        z.enum(['listening', 'question', 'resonance']),
    content:     z.string(),
    submittedAt: z.string(),
    public:      z.boolean().default(false),
    approved:    z.boolean().default(false),
  }),
})

export const collections = {
  'project-track':      projectTrack,
  'montessori':         montessori,
  'journeys':           journeys,
  'fundamentals':       fundamentals,
  'listening-journal':  listeningJournal,
  'blog':               blog,
  'project':            project,
  'community':          community,
}
