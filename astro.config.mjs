// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://cdat.sdet.it',
  // hybrid: every route is prerendered by default; only /mcp opts out
  // via `export const prerender = false`. Keeps static perf for the 14 pages
  // and runs Node at runtime exclusively for the MCP SSE endpoint.
  output: 'static',
  adapter: node({ mode: 'standalone' }),

  // Disable Astro 5+ default CSRF Origin check globally because the
  // analytics proxy at /stats/event must accept text/plain POSTs from the
  // Plausible script (text/plain avoids CORS preflight). Astro's CSRF
  // blocks form-like Content-Types unless Origin matches, but TLS
  // termination behind nginx + CF makes the scheme comparison brittle.
  // Public endpoints (/mcp = read-only, /stats/event = analytics) carry
  // no CSRF risk on this site.
  security: { checkOrigin: false },

  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/og/') && !page.includes('/mcp'),
    }),
  ],
});
