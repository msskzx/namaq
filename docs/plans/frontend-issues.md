# Frontend issues to fix: plan

Status: 1, 3, 4, 5 shipped; 7 closed as moot; 2 and 6 open. Found in a
code-level scan of `src/app` and `src/components`; nothing here was checked in
a browser except where noted. Ordered by how much each one affects the others.

## 1. The server sends an empty page (done — merged 2026-09-28, PR #148)

`src/components/theme/CustomThemeProvider.tsx` returns `null` until it mounts in
the browser, and it wraps the whole app in `src/app/layout.tsx`. Nothing inside
it renders on the server, so every visitor sees a blank screen until JavaScript
runs, and crawlers and link previews see almost nothing. It is also a likely
cause of a flash of the wrong theme.

Fix: render the children straight away and let `next-themes` do its own
hydration handling (`suppressHydrationWarning` is already on `<html>`). Do this
first, since the metadata and `lang` fixes below need real server output to be
worth anything.

Rendering real server output surfaced two latent production-build bugs that
the blank SSR pass had been hiding, fixed in the same PR: several client pages
called `useSearchParams()` without a `Suspense` boundary (Next requires one for
static generation), and `react-force-graph-2d` touches `window` at module
load, so it now loads via `next/dynamic` with `ssr: false`.

## 2. Every page has the same title (open)

`layout.tsx` holds the only metadata, so every page is titled "Namaq - Data
Driven Interactive Learning". All 13 page files are client components, so none
can export `metadata`.

Fix: a server wrapper or `generateMetadata` per route, with a title and
description for the people, event, battle, source and title pages, and Open
Graph tags so a shared link shows something useful. Person and source pages need
the record's name in the title, which means a server-side fetch.

## 3. `lang` and `dir` are wrong (done — merged 2026-09-28, PR #148)

`<html lang="en">` never changes, and there is no `dir`, while the app opens in
Arabic. Screen readers, browser translation and font choice get the wrong
language.

Fix: set both on the root element from the language context when it changes,
and, once item 1 is done, read the language cookie on the server so the first
response is already right. Related: the language starts as Arabic and loads the
saved choice after mount, so an English reader sees Arabic first
(`src/components/language/LanguageContext.tsx`). The cookie consent banner also
decides whether the choice is saved in a cookie or in `localStorage`.

## 4. No error, not-found or loading pages (done — merged 2026-09-28, PR #147)

There is no `not-found.tsx`, `error.tsx` or `loading.tsx` under `src/app`. A bad
URL or a thrown render error shows Next's default English page, unstyled and
unthemed.

Fix: add all three, in both languages, using the shared `ErrorMessage`,
`LoadingSpinner` and `Button` components.

## 5. Site files (done — merged 2026-09-28, PR #146)

There is no `robots.txt`, `sitemap.xml`, web manifest or share image; `public/`
holds only `vercel.svg`. Add `src/app/robots.ts` and `src/app/sitemap.ts`, the
sitemap listing people, events, battles and sources from the database.

Shipped: `robots.ts`, `sitemap.ts` (dynamic, not statically generated — the
sitemap queries the database, and Vercel's build environment only has
`DATABASE_URL` at request time, not build time), and `manifest.ts`. No share/OG
image yet — `public/` has no app logo to build one from; still open, needs
either a real design asset or explicit direction.

## 6. Accessibility (open)

Not audited yet. Run one pass with axe or Lighthouse and look at icon-only
buttons, focus rings, colour contrast (some `text-gray-500` on grey), and
keyboard use of the graph. The graph's nodes list is the only keyboard path to
select a node, which is part of why it stays
([graph-nodes-list.md](graph-nodes-list.md)). Needs real browser verification
(axe/Lighthouse pass), not just a code read.

## 7. Images (moot — checked 2026-09-28)

Stale: the homepage cards were deliberately made text-only in `14d4d36`
("feat(home): show text-only cards, add a Sources card, drop unused
translations"), which removed the placeholder Gemini images on purpose. The
hero is `HeroGraphPreview.tsx`, an interactive force-graph, not a static
image — it already carries `role="region"`/`aria-label` instead of alt text.
The one remaining `next/image` use (`src/app/people/[slug]/page.tsx`, the
profile picture) already has correct alt text and sizing. Nothing to do here
unless the intent is to bring back card imagery with real (non-placeholder)
assets, which needs explicit direction first.

## Related plans

- [graph-nodes-list.md](graph-nodes-list.md)
- [graph-node-font-size.md](graph-node-font-size.md)
- [relative-event-dating.md](relative-event-dating.md)

## Acceptance

For each item, a test where the behavior is testable (metadata builders, the
sitemap, the `lang` effect), and `npm run lint`, `npx tsc --noEmit` and
`npm test` clean. Items 1 and 3 need a check of the first server response, for
example with `curl`, since a component test cannot see it — done for both in
PR #148, plus a full `npm run build` (production static/dynamic generation
catches issues `npm run dev` and tests don't, as items 1's Suspense/force-graph
fallout showed).

Items 2 and 6 remain open; pick either up next.
