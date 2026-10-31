# Moving between trees on /quran/branches

An open tree has no way to reach the next one except going back to the list.
This adds previous and next steps through the trees, in the order the list shows
them.

## Scope

- The steps walk the list the page shows: the trees left by the juz range, the
  surah and the search, in list order. An open tree's link carries the search
  (`q`) and surah (`s`) so the steps know that list.
- A two-option switch, «قائمة» (list) and «تصفّح» (browse), sits in the
  filters row beside the juz filter on both views. Browse opens the first tree
  on the current list page with the same filter; list returns to the list page
  that holds the current tree.
- A tree reached through a subtree link, which is not in that list, gets no
  steps. A tree scoped to some occurrences (`at=`) steps to whole trees.
- The surroundings setting (`c=1`) carries over to the next tree.
- Quizzes get no steps.

## Behaviour

- In browse mode the filters row shows previous and next buttons beside the
  switch, with the position, e.g.
  `٣ / ١٢٠` / `3 / 120`. The first tree has no previous, the last no next.
  Arrows follow writing direction, as in `Pagination.tsx`.
- The left and right arrow keys step while the tree is fitted. In Arabic the
  left arrow is next. Keys typed into a field do nothing, and keys with a
  modifier do nothing.
- A horizontal one-finger swipe on the tree steps while the tree is fitted,
  the way Photos only turns the page at fit zoom. In Arabic a swipe to the
  right is next. Once zoomed in, arrows and swipes pan instead.
- The buttons are links, so the next and previous trees are prefetched.

## Paths

- `src/lib/quran/branches.ts`: `branchesHref` keeps `q` and `s` beside a tree id.
- `src/app/quran/branches/page.tsx`: read the list filter with a tree open, work
  out the neighbours and pass them on.
- `src/app/quran/branches/TreeSteps.tsx`: the switch and the step buttons.
- `src/app/quran/branches/PieceList.tsx`: inline trees get no list filter.
- `src/app/quran/branches/BranchTree.tsx`: a `steppable` prop and the keys and
  swipe in `TreeViewport`, which click the step links.

## Acceptance

- Previous and next link to the neighbouring trees of the filtered list,
  keeping the juz range, search, surah and `c=1`.
- The first and last tree disable the missing step.
- Arrow keys and a horizontal swipe step at fit zoom, mirrored in Arabic, and do
  nothing when zoomed in, inside a field, or for a mostly vertical swipe.
- Trees without steps (quizzes, subtree trees) show no step buttons.

## Validation

`npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`.
