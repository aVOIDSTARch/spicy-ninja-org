import { defineCollection, z } from 'astro:content'

// ─────────────────────────────────────────────
// SHARED ENUMS
// ─────────────────────────────────────────────

const moduleEnum = z.union([
  z.literal(1), z.literal(2), z.literal(3), z.literal(4)
])

const nodeTypeEnum = z.enum(['root', 'branch', 'leaf', 'seed'])

const blogFormatEnum = z.enum([
  'reflection', 'session-log', 'breakthrough',
  'question', 'reference', 'sketch'
])

const communityTypeEnum = z.enum(['listening', 'question', 'resonance'])

const projectStatusEnum = z.enum(['core', 'likely', 'explore'])

// ─────────────────────────────────────────────
// PROJECT TRACK — Listening curriculum works
// ─────────────────────────────────────────────

const projectTrack = defineCollection({
  type: 'content',
  schema: z.object({
    title:        z.string(),
    composer:     z.string(),
    year:         z.string(),
    module:       moduleEnum,
    order:        z.number().int().positive(),
    recording:    z.string().optional(),
    youtubeQuery: z.string(),
    listenFor:    z.array(z.string()).min(1),
    teaches:      z.array(z.string()).min(1),
    draft:        z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────
// MONTESSORI — Roots, branches, leaves, seeds
// ─────────────────────────────────────────────

const montessori = defineCollection({
  type: 'content',
  schema: z.object({
    title:              z.string(),
    type:               nodeTypeEnum,
    prerequisites:      z.array(z.string()).default([]),
    unlocks:            z.array(z.string()).default([]),
    connectsToProject:  z.array(z.string()).default([]),
    journeySeeds:       z.array(z.string()).default([]),
    fundamentalsBranch: z.string().nullable().default(null),
    description:        z.string().optional(),
    draft:              z.boolean().default(false),
  }),
})

// ─────────────────────────────────────────────
// MONTESSORI JOURNEYS — Bespoke Journey Courses
// ─────────────────────────────────────────────

const journeys = defineCollection({
  type: 'content',
  schema: z.object({
    journey:     z.string(),               // parent journey slug
    title:       z.string(),
    phase:       z.number().int().positive(),
    description: z.string(),
    subjects:    z.array(z.string()),      // artists/works covered
    draft:       z.boolean().default(false),
  }),
})

// ─────────────────────────────────────────────
// FUNDAMENTALS — Theory, composition, characters
// ─────────────────────────────────────────────

const fundamentals = defineCollection({
  type: 'content',
  schema: z.object({
    title:          z.string(),
    branch:         z.enum(['bach-math', 'markov-chains', 'music-theory', 'composition', 'characters']),
    order:          z.number().int().min(0),
    montessoriNode: z.string().optional(),  // links back to tree node slug
    description:    z.string().optional(),
    draft:          z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────
// LISTENING JOURNAL — 4-layer listening sessions
// ─────────────────────────────────────────────

const listeningJournal = defineCollection({
  type: 'content',
  schema: z.object({
    title:             z.string(),
    date:              z.date(),
    work:              z.string(),
    composer:          z.string(),
    module:            z.string().nullable().default(null),
    layers: z.object({
      naked:       z.string().optional(),
      inhabited:   z.string().optional(),
      anatomical:  z.string().optional(),
      notebook:    z.string().optional(),
    }).default({}),
    publishedAsPost:   z.string().nullable().default(null),
    draft:             z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────
// BLOG — Multi-format personal journal
// ─────────────────────────────────────────────

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:               z.string(),
    date:                z.date(),
    description:         z.string(),
    format:              blogFormatEnum,
    derivedFromJournal:  z.string().nullable().default(null),
    commentsEnabled:     z.boolean().default(false),
    commentsPublic:      z.boolean().default(false),
    draft:               z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────
// PROJECT — Jus Pulsus documentation
// ─────────────────────────────────────────────

const project = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    order:       z.number().int().min(0),
    status:      projectStatusEnum.optional(),
    description: z.string().optional(),
    draft:       z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────
// COMMUNITY — Public submissions
// ─────────────────────────────────────────────

const community = defineCollection({
  type: 'content',
  schema: z.object({
    type:        communityTypeEnum,
    content:     z.string(),
    submittedAt: z.date(),
    public:      z.boolean().default(false),
    approved:    z.boolean().default(false),
  }),
})

// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────

export const collections = {
  'project-track':     projectTrack,
  'montessori':        montessori,
  'journeys':          journeys,
  'fundamentals':      fundamentals,
  'listening-journal': listeningJournal,
  'blog':              blog,
  'project':           project,
  'community':         community,
}
