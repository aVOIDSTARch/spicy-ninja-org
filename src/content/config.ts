import { defineCollection, z } from 'astro:content'

// ─────────────────────────────────────────────────────────
//  PROJECT TRACK
//  8 works across 4 modules. Full 4-layer methodology.
//  draft: true until you edit and publish.
// ─────────────────────────────────────────────────────────
const projectTrack = defineCollection({
  type: 'content',
  schema: z.object({
    title:        z.string(),
    composer:     z.string(),
    year:         z.string(),
    module:       z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    workNumber:   z.string(),                   // e.g. "W01"
    recording:    z.string().optional(),        // recommended recording
    youtubeQuery: z.string(),                   // search string for free access
    listenFor:    z.array(z.string()),          // specific things to hear
    teaches:      z.array(z.string()),          // what this work gives the project
    draft:        z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────────────────
//  MONTESSORI TREE NODES
//  Roots, branches, leaves, seeds.
//  Prerequisites drive the unlock / progress system.
// ─────────────────────────────────────────────────────────
const montessori = defineCollection({
  type: 'content',
  schema: z.object({
    title:              z.string(),
    type:               z.enum(['root', 'branch', 'leaf', 'seed']),
    prerequisites:      z.array(z.string()).default([]),  // slugs of required nodes
    unlocks:            z.array(z.string()).default([]),  // slugs of nodes this opens
    connectsToProject:  z.array(z.string()).default([]),  // links to Jus Pulsus concepts
    journeySeeds:       z.array(z.string()).default([]),  // journeys seeded by this node
    fundamentalsBranch: z.string().nullable().default(null), // links to Fundamentals course
    description:        z.string().optional(),            // short summary for map tooltip
    draft:              z.boolean().default(false),
  }),
})

// ─────────────────────────────────────────────────────────
//  BESPOKE JOURNEYS
//  Deep immersive panoramic courses — one artist/tradition.
//  Björk Bodysuit is inaugural.
//  Phases are individual MDX files within a journey folder.
// ─────────────────────────────────────────────────────────
const journeys = defineCollection({
  type: 'content',
  schema: z.object({
    title:          z.string(),
    journey:        z.string(),           // parent journey slug e.g. "bjork-bodysuit"
    phase:          z.number().optional(),// ordering within journey
    isOverview:     z.boolean().default(false),
    artist:         z.string().optional(),
    seedsNodes:     z.array(z.string()).default([]), // Montessori nodes this journey plants
    description:    z.string().optional(),
    draft:          z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────────────────
//  FUNDAMENTALS
//  Theory / composition / technique courses.
//  Each lesson links back to its Montessori tree node.
// ─────────────────────────────────────────────────────────
const fundamentals = defineCollection({
  type: 'content',
  schema: z.object({
    title:          z.string(),
    branch:         z.enum([
      'bach-math',
      'markov-chains',
      'music-theory',
      'composition',
      'characters',
    ]),
    order:          z.number(),           // lesson order within branch
    montessoriNode: z.string().optional(),// slug of corresponding tree node
    description:    z.string().optional(),
    draft:          z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────────────────
//  LISTENING JOURNAL
//  Private listening sessions. 4-layer format.
//  publishedAsPost links to derived blog entry.
// ─────────────────────────────────────────────────────────
const listeningJournal = defineCollection({
  type: 'content',
  schema: z.object({
    title:            z.string(),
    date:             z.date(),
    work:             z.string(),
    composer:         z.string(),
    module:           z.string().nullable().default(null),
    layers: z.object({
      naked:          z.string().optional(), // first listen — pure reception
      inhabited:      z.string().optional(), // second listen — active attention
      anatomical:     z.string().optional(), // structural dissection
      notebook:       z.string().optional(), // raw images / feelings / ideas
    }).default({}),
    publishedAsPost:  z.string().nullable().default(null), // slug of blog post
    draft:            z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────────────────
//  BLOG
//  Personal process journal. Multi-format card blocks.
//  format drives which card component renders on the index.
//  derivedFromJournal links back to source listening entry.
// ─────────────────────────────────────────────────────────
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:                z.string(),
    date:                 z.date(),
    description:          z.string(),
    format:               z.enum([
      'reflection',        // long prose, pull quote
      'session-log',       // monospace, timestamp-heavy
      'breakthrough',      // large bold statement, high contrast
      'question',          // centered, sparse, open
      'reference',         // citation-style, structured
      'sketch',            // loose, informal
    ]),
    derivedFromJournal:   z.string().nullable().default(null),
    commentsEnabled:      z.boolean().default(false),
    commentsPublic:       z.boolean().default(false),
    draft:                z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────────────────
//  PROJECT DOCUMENTATION
//  Jus Pulsus vision, structure, characters, decisions.
//  status mirrors the confidence labeling system in docs.
// ─────────────────────────────────────────────────────────
const project = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    order:       z.number(),
    status:      z.enum(['core', 'likely', 'explore']).default('core'),
    description: z.string().optional(),
    draft:       z.boolean().default(true),
  }),
})

// ─────────────────────────────────────────────────────────
//  COMMUNITY SUBMISSIONS
//  public: toggle on/off without deleting data
//  approved: you review before anything appears
//  type: which submission form it came from
// ─────────────────────────────────────────────────────────
const community = defineCollection({
  type: 'data',
  schema: z.object({
    type:        z.enum(['listening', 'question', 'resonance']),
    content:     z.string(),
    submittedAt: z.string(),             // ISO date string
    public:      z.boolean().default(false),
    approved:    z.boolean().default(false),
  }),
})

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
