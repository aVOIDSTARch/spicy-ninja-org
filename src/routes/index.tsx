import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 2rem',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--color-text-ghost)',
          marginBottom: '1.6rem',
        }}
      >
        the education of a composer in public
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
          lineHeight: 0.95,
          color: 'var(--color-text-primary)',
          marginBottom: '0.5rem',
        }}
      >
        Jus Pulsus
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 300,
          fontSize: '1rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'var(--color-amber-gold)',
          opacity: 0.75,
          marginBottom: '2.5rem',
        }}
      >
        a creation myth — in progress
      </p>
      <p
        style={{
          maxWidth: '500px',
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          fontSize: '1rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.8,
        }}
      >
        A 90-minute electronic suite conceived simultaneously as a creation myth,
        the history of music, and an ontological love story.
        This is the public record of how it gets made.
      </p>
    </div>
  )
}
