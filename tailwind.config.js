/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        accent: {
          DEFAULT: '#FF6B35',
          dark: '#E85D2F',
        },
        gray: {
          light: '#F5F5F5',
          DEFAULT: '#6B6B6B',
          dark: '#4A4A4A',
        },
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
        body: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
