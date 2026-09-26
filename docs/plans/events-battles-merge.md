# One events page for events and battles

Status: **implemented**. The combined list is a new route, `/api/timeline`, not an extension of `/api/events`: that route pages at 20 and its tests pin its shape, so the events page moved to the new route and `/api/events` is untouched. The hero was already removed from the events pages before this work.

Vocabulary: [Engagement](../../CONTEXT.md). Related: [reader plan](reader-prefetch-fullscreen.md) for the plan format.

## Agreed behavior and scope

1. `/events` lists events and battles together on one timeline, ordered by Hijri year as `EventTimeline` already does.
2. The NavBar and the shared nav list carry only "Events". "Battles" is removed from `NavBar`, `getAllNavLinks` and the Footer's events group.
3. The frontend route `/battles` (the list page) is deleted, with no redirect. Detail routes `/battles/[slug]` and `/events/[slug]` are unchanged.
4. A type filter offers four options: **Event**, **Battle**, **Ghazwah**, **Sariyyah**. "Event" is every `Event` row whatever its `type`; "Battle", "Ghazwah" and "Sariyyah" are `Battle` rows by `engagement`. Options are multi-select and combine as a union; none selected means everything.
5. A search box matches Arabic name, transliterated name and location, using `normalizeSubjectSearch` (`src/lib/subjectSearch.ts`), which strips diacritics. Search and filter run in the browser over the loaded list.
6. Filter and search live in the URL: `?type=ghazwah,sariyyah&q=...`, so a filtered view can be linked. Values: `event`, `battle`, `ghazwah`, `sariyyah`.
7. `/api/timeline` returns events and battles together, each carrying a `kind` (`event`, `battle`, `ghazwah` or `sariyyah`). The `/api/battles` list route is deleted, since its only consumer was the deleted list page; the detail route `/api/battles/[slug]` stays.

Excluded: any model or migration change, filtering by `EventType` (27 of 46 events are `OTHER`), a redirect from `/battles`, server-side search.

Edge cases: all 43 catalog battles carry an engagement (21 ghazwah, 15 battle, 7 sariyyah), but an unset `engagement` is treated as `battle`. An unknown `type` value in the URL is ignored. An empty result shows a "nothing matches" message, not a blank page. Events without a Hijri year sort as `compareHijriYear` already orders them.

## Acceptance criteria

- AC1: `/events` shows both events and battles in one Hijri-year-ordered list.
- AC2: The NavBar, mobile menu and Footer have no "Battles" link, and no link to `/battles` remains except detail URLs.
- AC3: Requesting `/battles` returns the site's 404.
- AC4: Selecting Ghazwah shows only ghazwah battles; selecting Ghazwah and Event shows both; clearing shows everything.
- AC5: Typing an Arabic name with or without harakat, or a transliterated name or a location, narrows the list.
- AC6: Reloading a URL with `?type=sariyyah&q=...` restores the same view; the URL updates as the controls change.
- AC7: `/api/events` items each have a `kind`, battles have it from `engagement`, and existing fields the events page used are preserved.
- AC8: Each card links to `/events/<slug>` for events and `/battles/<slug>` for battles.

## Affected components

Order: 1, 2, 3, then 4 and 5 in either order.

1. `src/app/api/events/route.ts` (verified): also read battles, map both to one list with `kind`. Keep its existing `type`, `search`, `year` and `limit` behavior for existing callers; the combined list is the default response, so check the existing `route.test.ts` for what it asserts before changing the response shape. Unverified assumption: whether other callers use the array shape of `/api/events`.
2. `src/types/event.ts` (verified): add a list-item type with `kind`, replacing the `EventBase | Battle` union used by `EventTimeline` and `EventCard`.
3. `src/components/events/EventTimeline.tsx` and `EventCard.tsx` (verified): take the new item type. `EventCard` currently tells events from battles with `'type' in event`; use `kind` instead.
4. `src/app/events/page.tsx` (verified): fetch once, add the search input and the four filter chips (via the shared `Button`, with icons per AGENTS.md), read and write `useSearchParams`. Text in Arabic and English.
5. Navigation: `src/components/common/NavBar.tsx` (line 30), `src/lib/siteLinks.ts` (line 16), `src/components/common/Footer.tsx` (line 12), delete `src/app/battles/page.tsx`. `src/lib/nodeProfile.ts` keeps `/battles` because it builds detail URLs.
6. `CONTEXT.md`: the "Engagement" term is already added.
7. `README.md`: a line under "What is implemented" for the combined events page and its filters.

## Validation

- `src/app/api/events/route.test.ts` (exists): battles appear with the right `kind` (AC7).
- New `src/components/events/EventTimeline.test.tsx` or a page test, following the `next/navigation` mock pattern in `src/components/graph/GraphSearch.test.tsx`: filter union and clear (AC4), diacritic-insensitive search (AC5), URL read and write (AC6), card links (AC8).
- Repository checks from AGENTS.md: `npm run lint`, `npx tsc --noEmit`, `npm test`. The existing `graphIntegrity.live.test.ts` failure is unrelated.
- Visual: run the dev server, open `/events`, try each filter and the search in Arabic and English, light and dark, and phone width; confirm `/battles` is gone.

## Data and operational consequences

None: no migration, sync or recompute. The graph and its ranks are untouched.

## Open issues

Blockers: none.

Nonblocking assumptions: whether the `/api/events` response shape can change without breaking other callers (check when implementing, and add a separate combined path if it can't); the exact Arabic labels for the four filter options.

Deferred: filtering events by `EventType`.
