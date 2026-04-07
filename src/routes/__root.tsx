import { createRootRoute, Outlet, Link, useRouterState } from '@tanstack/react-router'

const navLinks = [
  { to: '/syllabus', label: 'Syllabus' },
  { to: '/project',  label: 'Project'  },
  { to: '/blog',     label: 'Blog'     },
  { to: '/about',    label: 'About'    },
] as const

function RootLayout() {
  const router = useRouterState()
  const path = router.location.pathname

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 2.5rem',
          background: 'linear-gradient(to bottom, rgba(7,7,13,0.97) 0%, rgba(7,7,13,0) 100%)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: 'var(--color-gossamer)',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            opacity: 0.85,
          }}
        >
          spicyninja.org
        </Link>
        <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none' }}>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 300,
                  fontSize: '0.78rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: path.startsWith(to)
                    ? 'var(--color-gossamer)'
                    : 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main style={{ paddingTop: '4rem' }}>
        <Outlet />
      </main>
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
