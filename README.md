# Mind - Standalone Website

A living collection of ideas, thoughts, and evolving concepts extracted from the He Carries Water ecosystem.

## Overview

Mind is a dedicated space for documenting ideas as they grow and evolve over time. Each idea contains chronologically ordered thoughts, tags for organization, and a complete changelog of its development.

## Features

- **Ideas**: Topic-based collections of thoughts
- **Thoughts**: Chronological entries within each idea
- **Tags**: Organize and browse ideas by hashtags
- **Changelog**: Track the evolution of every idea
- **Timeline Controls**: View thoughts oldest-first or newest-first
- **Responsive Design**: Neo-brutalist aesthetic with bold typography

## Tech Stack

- **Astro 5.0**: Static site generation with content collections
- **Tailwind CSS 4.0**: Utility-first styling
- **TypeScript**: Type-safe development
- **Marked**: Markdown parsing for thought content

## Project Structure

```
mind-only-website/
├── src/
│   ├── components/
│   │   ├── BaseHead.astro        # SEO and meta tags
│   │   ├── Header.astro          # Site navigation
│   │   ├── Footer.astro          # Site footer
│   │   └── IdeaCard.astro        # Idea preview card
│   ├── content/
│   │   ├── mind/                 # Mind idea JSON files
│   │   └── config.ts             # Content collection schema
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro           # Home page (all ideas)
│   │   ├── about.astro           # About page
│   │   └── mind/
│   │       ├── [slug].astro      # Individual idea page
│   │       └── tags/
│   │           ├── index.astro   # All tags page
│   │           └── [tag].astro   # Tag-specific ideas
│   └── styles/
│       └── global.css            # Global styles
├── public/                       # Static assets
├── astro.config.mjs              # Astro configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## Content Schema

Each idea in `src/content/mind/*.json` follows this structure:

```json
{
  "title": "Idea Title",
  "summary": "Brief description",
  "createdDate": "2025-12-11T18:28:30Z",
  "updatedDate": "2025-12-11T18:28:30Z",
  "hashtags": ["#tag1", "#tag2"],
  "status": "active",
  "thoughts": [
    {
      "id": "thought-001",
      "date": "2025-12-11T18:28:30Z",
      "content": "Markdown content here",
      "hashtags": ["#specific-tag"],
      "editedDate": "2025-12-11T19:00:00Z"
    }
  ],
  "changelog": [
    {
      "date": "2025-12-11T18:28:30Z",
      "action": "created",
      "description": "Initial idea created"
    }
  ]
}
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Server will start at `http://localhost:3001`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Design Philosophy

### Neo-Brutalist Aesthetic
- Bold borders and shadows
- High contrast black and white base
- Accent color (#FF6B35) for highlights
- Monospace fonts for UI, serif for content
- Geometric, intentionally "raw" design

### Content Philosophy
- **Living Documentation**: Ideas are never "finished"
- **Chronological**: Thoughts are time-ordered, showing evolution
- **Transparent**: Full changelog shows all changes
- **Connected**: Tags create a web of related concepts
- **Accessible**: Clear hierarchy and readable typography

## Color Palette

- **Black**: `#000000` - Primary text, borders
- **White**: `#FFFFFF` - Background
- **Accent**: `#FF6B35` - Links, highlights, CTAs
- **Accent Dark**: `#E85D2F` - Hover states
- **Gray Light**: `#F5F5F5` - Backgrounds, subtle elements
- **Gray**: `#6B6B6B` - Secondary text
- **Gray Dark**: `#4A4A4A` - Body text

## Typography

- **Headings/UI**: Courier New (monospace)
- **Body Content**: Georgia (serif)

## Deployment

This is a static site that can be deployed to:
- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting service

Configure the `site` URL in `astro.config.mjs` for your production domain.

## License

Part of the He Carries Water ecosystem.
