# Frontend issues to fix: plan

Status: not started. Found in a code-level scan of `src/app` and
`src/components`; nothing here was checked in a browser. Ordered by how much
each one affects the others.

## 1. The server sends an empty page

`src/components/theme/CustomThemeProvider.tsx` returns `null` until it mounts in
the browser, and it wraps the whole app in `src/app/layout.tsx`. Nothing inside
it renders on the server, so every visitor sees a blank screen until JavaScript
runs, and crawlers and link previews see almost nothing. It is also a likely
cause of a flash of the wrong theme.

Fix: render the children straight away and let `next-themes` do its own
hydration handling (`suppressHydrationWarning` is already on `<html>`). Do this
first, since the metadata and `lang` fixes below need real server output to be
worth anything.

## 2. Every page has the same title

`layout.tsx` holds the only metadata, so every page is titled "Namaq - Data
Driven Interactive Learning". All 13 page files are client components, so none
can export `metadata`.

Fix: a server wrapper or `generateMetadata` per route, with a title and
description for the people, event, battle, source and title pages, and Open
Graph tags so a shared link shows something useful. Person and source pages need
the record's name in the title, which means a server-side fetch.

## 3. `lang` and `dir` are wrong

`<html lang="en">` never changes, and there is no `dir`, while the app opens in
Arabic. Screen readers, browser translation and font choice get the wrong
language.

Fix: set both on the root element from the language context when it changes,
and, once item 1 is done, read the language cookie on the server so the first
response is already right. Related: the language starts as Arabic and loads the
saved choice after mount, so an English reader sees Arabic first
(`src/components/language/LanguageContext.tsx`). The cookie consent banner also
decides whether the choice is saved in a cookie or in `localStorage`.

## 4. No error, not-found or loading pages

There is no `not-found.tsx`, `error.tsx` or `loading.tsx` under `src/app`. A bad
URL or a thrown render error shows Next's default English page, unstyled and
unthemed.

Fix: add all three, in both languages, using the shared `ErrorMessage`,
`LoadingSpinner` and `Button` components.

## 5. Site files

There is no `robots.txt`, `sitemap.xml`, web manifest or share image; `public/`
holds only `vercel.svg`. Add `src/app/robots.ts` and `src/app/sitemap.ts`, the
sitemap listing people, events, battles and sources from the database.

## 6. Accessibility

Not audited yet. Run one pass with axe or Lighthouse and look at icon-only
buttons, focus rings, colour contrast (some `text-gray-500` on grey), and
keyboard use of the graph. The graph's nodes list is the only keyboard path to
select a node, which is part of why it stays
([graph-nodes-list.md](graph-nodes-list.md)).

## 7. Images

The homepage cards lost their images. The remaining `next/image` uses are profile
pictures and the hero. Check alt text and sizing on the hero.

## Related plans

- [graph-nodes-list.md](graph-nodes-list.md)
- [graph-node-font-size.md](graph-node-font-size.md)
- [relative-event-dating.md](relative-event-dating.md)

## Acceptance

For each item, a test where the behavior is testable (metadata builders, the
sitemap, the `lang` effect), and `npm run lint`, `npx tsc --noEmit` and
`npm test` clean. Items 1 and 3 need a check of the first server response, for
example with `curl`, since a component test cannot see it.
