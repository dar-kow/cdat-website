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

const UPSTREAM = 'https://plausible.sdet.it/api/event';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = await request.text();

    const xff = request.headers.get('x-forwarded-for');
    const forwardedFor = xff ? `${xff}, ${clientAddress}` : clientAddress;

    const upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
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
