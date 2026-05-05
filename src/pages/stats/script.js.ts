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

// Upstream Plausible container exposed on the VPS host at 127.0.0.1:8001.
// We hit it via `host.docker.internal` (mapped to host-gateway in compose)
// because outbound HTTPS to the public plausible.sdet.it URL is firewalled
// on this container's network bridge.
// `STATS_UPSTREAM` env var lets local dev override (defaults to the host).
const UPSTREAM =
  (import.meta.env.STATS_UPSTREAM ?? 'http://host.docker.internal:8001') +
  '/js/script.tagged-events.js';

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
