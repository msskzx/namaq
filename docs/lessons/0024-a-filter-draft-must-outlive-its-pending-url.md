# A filter draft must outlive its pending URL

Rapid filter changes lost a picked value, and a partial fix restored a cleared value from the old address.

Kind: detour · Outcome: solved · Date: 2026-11-04 · Topics: testing, ui-state

**Problem:** A second live filter change is computed from URL state that has not caught up with the first change.

**Fix:** Keep the latest complete draft in a ref, reconcile only matching navigation responses, restore it on browser history changes, and replace all managed URL filter keys from that draft.

**When it applies:** Next.js server-rendered Quran browse results with live multi-select surah and juz filters, React client controls and delayed router replacement.

**Rule it changes:** Race tests should leave router.replace pending while another input changes, including a deletion followed by an addition.

**Evidence:** Namaq PR #514, source commit 0daf6adeb6908032a3212987293853c73661aa0b; GroupFilters.tsx and GroupFilters.test.tsx; Playwright multi-select navigation check.

## What happened

Picking a second surah before the first route finished could lose the first
pick. The optimistic state reverted before the server returned the updated
filter props. A ref holding the latest complete draft kept both selections,
and an older response was ignored until the returned filters matched that draft.
Browser history changes deliberately restore the draft from the new address.

The next review found the reverse failure. Starting with a word-order filter,
clearing it and immediately enabling book-only results could restore the cleared
filter. The second request began with the old address and replaced only its own
key. The fix deletes every managed filter key, then serializes the latest draft.
Other URL state, such as the selected view and current group, stays available.

Evidence comes from [Namaq PR #514](https://github.com/msskzx/namaq/pull/514), [`src/app/quran/branches/GroupFilters.tsx`](../../src/app/quran/branches/GroupFilters.tsx)
and [`src/app/quran/branches/GroupFilters.test.tsx`](../../src/app/quran/branches/GroupFilters.test.tsx) at
commit 0daf6adeb6908032a3212987293853c73661aa0b. The regression leaves the mocked address unchanged between
clearing one filter and adding another. The browser check also picks multiple
surahs and a juz while navigation remains asynchronous.

A complete draft needs complete serialization. Updating only the key of the
latest click lets old keys survive in the address.
