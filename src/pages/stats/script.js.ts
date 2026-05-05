/**
 * /stats/script.js - same-origin proxy for Plausible script (tagged-events variant).
 *
 * Bypasses ad-blocker filter lists matching generic plausible.io paths
 * by serving the script from cdat.sdet.it itself. The browser fetches
 * /stats/script.js (first-party JS) instead of plausible.sdet.it/js/...
 *
 * Self-hosted Plausible upstream: tagged-events variant (cdat uses
 * data-plausible-event="..." attributes for custom event tracking).
 */

import type { APIRoute } from 'astro';

export const prerender = false;

const UPSTREAM = 'https://plausible.sdet.it/js/script.tagged-events.js';

export const GET: APIRoute = async () => {
  try {
    const upstream = await fetch(UPSTREAM, {
      headers: {
        'User-Agent': 'cdat-website-stats-proxy/1.0',
      },
    });

    if (!upstream.ok) {
      return new Response('script proxy upstream error', { status: 502 });
    }

    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (err) {
    console.error('stats script proxy failed:', err);
    return new Response('script proxy failed', { status: 502 });
  }
};
