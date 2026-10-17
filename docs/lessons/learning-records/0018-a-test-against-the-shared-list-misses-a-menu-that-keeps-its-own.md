# A test against the shared link list misses a menu that keeps its own

`/quran/branches` shipped in #398 with a card on `/quran` and an entry in
`getAllNavLinks`, and the owner could not find it in the navbar. The desktop Quran
menu does not read that list. It keeps its own array of hrefs,
`QURAN_SUBMENU_HREFS` in `src/components/common/NavBar.tsx`, and nothing tied the
two together. The hub test compares the cards against `getAllNavLinks`, so it
passed, and the NavBar test named each page by hand, so it passed too. Both
checks were green, and neither one could see the gap.

**Evidence:** #398's diff added the page to `src/lib/siteLinks.ts` and
`QuranHub.tsx` only. #399 adds it to `QURAN_SUBMENU_HREFS`, and its test loops over
every `/quran/` link in `getAllNavLinks` and expects each one in the desktop
submenu. The test fails with the fix removed.

**Implications:** when a page is added, look for every list that names pages, not
only the one a test compares against: `grep` for a sibling page's href (here
`/quran/words`) and touch every hit. A test that names its expected values by hand
only catches the pages someone thought of. A test that derives them from the
shared list catches the next page too.
