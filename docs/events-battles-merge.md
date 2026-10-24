# One timeline for events and battles

Events and battles share `/events` because the reader studies one historical timeline. Their separate detail routes remain. See [Engagement](../CONTEXT.md) for the domain distinction.

The combined list uses `/api/timeline`. Widening `/api/events` was rejected because existing consumers depend on that endpoint's contract.

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

Filtering events by `EventType` remains deferred.
