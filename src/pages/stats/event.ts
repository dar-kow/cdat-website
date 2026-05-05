/**
 * /stats/event - same-origin proxy for Plausible event ingestion.
 *
 * The Plausible script POSTs pageview + custom events here; this endpoint
 * forwards to the upstream API with the original client IP preserved via
 * X-Forwarded-For so Plausible can geo-locate accurately.
 *
 * Self-hosted Plausible upstream: https://plausible.sdet.it/api/event
 */

import type { APIRoute } from 'astro';

export const prerender = false;

// Upstream Plausible container exposed on the VPS host at 127.0.0.1:8001.
// We hit it via `host.docker.internal` (mapped to host-gateway in compose)
// because outbound HTTPS to the public plausible.sdet.it URL is firewalled
// on this container's network bridge.
const UPSTREAM =
  (import.meta.env.STATS_UPSTREAM ?? 'http://host.docker.internal:8001') + '/api/event';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = await request.text();

    const xff = request.headers.get('x-forwarded-for');
    const forwardedFor = xff ? `${xff}, ${clientAddress}` : clientAddress;

    const upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        // Plausible expects requests to look like they came in via
        // plausible.sdet.it so its BASE_URL/site lookups match.
        Host: 'plausible.sdet.it',
        'Content-Type': request.headers.get('content-type') ?? 'text/plain',
        'User-Agent': request.headers.get('user-agent') ?? 'unknown',
        'X-Forwarded-For': forwardedFor,
        'X-Forwarded-Proto': 'https',
      },
      body,
    });

    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'text/plain',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('stats event proxy failed:', err);
    return new Response('event proxy failed', { status: 502 });
  }
};
