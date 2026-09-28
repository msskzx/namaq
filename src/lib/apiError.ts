import { NextResponse } from 'next/server';

// See docs/plans/backend-issues.md, item 6: a bad request becomes a 400 via
// this error, everything else stays a 500 logged with a request id.
export class ApiValidationError extends Error {}

// s-maxage/stale-while-revalidate rather than `revalidate`/a static route
// segment: these routes read `request.url`, which Next.js treats as dynamic
// regardless, so a response header is the one lever that actually caches
// them at the edge. See docs/plans/backend-issues.md, item 4.
export const CATALOG_CACHE_HEADERS = {
  'Cache-Control': 's-maxage=300, stale-while-revalidate=3600',
};

export function apiError(route: string, error: unknown, fallbackMessage: string): NextResponse {
  if (error instanceof ApiValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  const requestId = crypto.randomUUID();
  console.error(`[${route}] ${requestId}`, error);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
