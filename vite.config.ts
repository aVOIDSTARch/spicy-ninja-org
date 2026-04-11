import { defineConfig } from 'vite-plus';

export default defineConfig({
  server: {
    allowedHosts: ['www.spicyninja.org', 'spicyninja.org']
  },
  build: {},
  preview: {
    allowedHosts: ['www.spicyninja.org', 'spicyninja.org']
  },

  test: {},
  lint: {},
  fmt: {},
  run: {},
  pack: {},
  staged: {},
});
