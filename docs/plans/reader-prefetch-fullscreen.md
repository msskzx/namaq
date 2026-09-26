# Reader: page prefetch and default fullscreen

Status: **implemented**; not yet verified in a running browser. The range param lives on the existing `/accounts` routes (`from`/`to`, cap 9), not new route files. The reader keeps pages ±2 cached and fetches the next 5 when one of those is missing.

Background: [ADR 0016](../adr/0016-a-reader-that-owns-the-whole-screen.md), [book-reader-design](../book-reader-design.md).

## Agreed behavior and scope

1. **Windowed fetch.** The reader loads pages in windows of 5 around the current page: 2 behind, the current page, 2 ahead. Turning a page or swiping inside the window shows the next page with no network wait.
2. **Sliding window.** When the reader reaches a page within 1 of the window's edge, the reader fetches the next window in that direction in the background. A jump (section index, URL, book change) starts a fresh window at the target page.
3. **Session cache.** Every fetched page stays cached for the session, keyed by account id and sequence. Nothing is evicted until the book changes.
4. **Split payload.** The initial call returns the shell (`accounts`, `account`, `pageNumbers`) plus the first window. Later window calls return page bodies only, with no account list and no `pageNumbers`. A cold open is one round trip.
5. **Default fullscreen on sources.** `/sources/[slug]` with `book` set opens the reader fullscreen. Profile embeds of the reader (`src/app/people/[slug]/page.tsx`) stay inline.
6. **Exit fullscreen.** On a source page, exit writes `fullscreen=0` and shows the inline view. `?fullscreen=1` still forces fullscreen anywhere. Absent param means the prop's default.

Out of scope: eviction, prefetching across books, changing the section index (`/accounts/sections`), changing paging semantics or URL shape (`book`, `page`).

Edge cases: first and last pages (window clamps to `1..pageCount`); a page missing inside a window (omit it, don't fail the window); a fast swipe past the window while a fetch is in flight (show the spinner for that page, not a blank); a failed background fetch (retry on demand when the page is actually turned to).

## Acceptance criteria

- AC1: Opening a chapter issues one request that returns the shell and pages `page-2..page+2` clamped to the account.
- AC2: Turning forward or back within the window issues no request for the shown page and renders it in the same frame.
- AC3: Reaching a page within 1 of the window edge triggers one background request for the next window in that direction, and no duplicate request for pages already cached.
- AC4: Window responses contain no `accounts` and no `pageNumbers`.
- AC5: Going back to an already-read page issues no request.
- AC6: A section-index jump to an uncached page fetches a window around the target and shows a spinner only until it arrives.
- AC7: `/sources/<slug>?book=<id>&page=N` opens fullscreen with no `fullscreen` param; exit lands inline with `fullscreen=0`; a reload keeps it inline.
- AC8: A person profile's reader stays inline by default and its "Read fullscreen" button works as before.
- AC9: Page 1, the last page and a 1-page account all render without error.

## Affected components

Order: 1 → 2 → 3 → 4.

1. `src/lib/history/sourceAccounts.ts`: add `readPages(accountId, from, to)` (one `findMany` on `accountId + sequence` range, same `select` as `readPage`). Change `accountsPayload` to take a window and return `pages: AccountPage[]` alongside the existing fields. Keep `page` as the requested page for now so callers don't break. Add a `pagesPayload` for body-only ranges.
2. `src/app/api/sources/[slug]/accounts/route.ts` and `src/app/api/people/[slug]/accounts/route.ts` (verified as `accountsPayload` callers): pass the window; add a body-only mode (proposed: `GET .../accounts/pages?account=&from=&to=`, new route files, both scopes) with `to - from` capped at a small maximum (proposed 9) so a range can't be abused.
3. `src/types/provenance.ts`: add a `pages` field to the accounts response type.
4. `src/components/people/SourceAccountReader.tsx`: replace the single-page SWR key with a session `Map` cache plus a window fetcher. The map is a module-level or ref cache keyed `${accountId}:${sequence}`, cleared on book change. Drive the prefetch trigger from `turnPage` and `setSelection`. Add a `defaultFullscreen?: boolean` prop; compute `fullscreen` as `param === '1' || (param !== '0' && defaultFullscreen)`; `setFullscreen(false)` writes `0` when `defaultFullscreen`, otherwise deletes the param.
5. `src/app/sources/[slug]/page.tsx`: pass `defaultFullscreen` to the reader (verified: the file renders `SourceAccountReader`). The contents view is untouched.

Unverified assumption: `SourceContents` links already carry `book` and `page`, so the default-fullscreen path needs no link change. Check when implementing.

## Validation

- `src/lib/history`: add a test for `readPages` range clamping and for a payload with no `accounts` or `pageNumbers` in the window response (AC1, AC4, AC9). Follow the mocking style of existing tests there.
- `src/components/people/SourceAccountReader.test.tsx` (exists): add cases with a mocked `fetch` counting calls: forward turn inside window makes no call (AC2), edge triggers exactly one window fetch (AC3), revisit makes none (AC5), section jump fetches around target (AC6), `defaultFullscreen` and `fullscreen=0` behavior (AC7, AC8).
- Repository checks: run the project's lint, typecheck and test scripts from `package.json` (not yet read; confirm names when implementing).
- Visual: run the dev server, open a chapter on a source page, confirm fullscreen on load, swipe/arrow through 5+ pages with the network panel showing no per-page requests, and exit to inline. Repeat at phone width.

## Data and operational consequences

No migrations or derived data. The range query uses the existing `accountId_sequence` unique key. No rollout steps beyond a normal deploy.

## Open issues

Blockers: none.

Nonblocking assumptions: the window cap of 9 pages per request; the new route path name; payload size per window is small enough for one response (page bodies are single printed pages, so 5 is well within limits).

Deferred: cache eviction, cross-book prefetch.
