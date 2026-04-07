import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/project')({
  component: ProjectPage,
})

function ProjectPage() {
  return (
    <div style={{ padding: '6rem 2.5rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--color-text-ghost)',
          marginBottom: '1rem',
        }}
      >
        the work
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          color: 'var(--color-text-primary)',
          lineHeight: 1.05,
          marginBottom: '1.5rem',
        }}
      >
        Jus Pulsus
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', fontWeight: 300 }}>
        Vision, structure, characters, decisions. The full documentation of the piece as it develops.
      </p>
      {/* Four-act structure, characters, open questions — to be built */}
    </div>
  )
}
