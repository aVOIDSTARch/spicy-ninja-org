// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://mind.hecarrieswater.com",
  output: "static",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [mdx(), sitemap()],

  server: {
    port: 3001,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
