import { defineConfig } from 'vite-plus'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  fmt: {
    printWidth: 100,
    singleQuote: true,
    trailingComma: 'all',
  },
  lint: {
    include: ['src/**/*.{ts,tsx}'],
  },
  staged: {
    '*.{ts,tsx,css}': 'vp check --fix',
  },
})
