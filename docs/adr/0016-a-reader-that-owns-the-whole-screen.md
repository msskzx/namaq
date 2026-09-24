---
status: accepted
---

# A reader that owns the whole screen

`SourceAccountReader` already turns pages one printed page at a time, keeping
book and page in the URL so a citation can link straight into the passage it
names. What it cannot do is let someone actually read: font and page stay
whatever the surrounding site chose, the section index is a native `<select>`,
and a paragraph the source's own editor marked as a heading — bracketed, like
`[إسلام ضماد:]` — prints those brackets instead of becoming a heading, because
only the section-index code path strips them.

The fix is a fullscreen mode on `SourceAccountReader` itself, not a second
component. It's already the one place both `/sources/[slug]` and every person
profile read from, and a sibling reader would start diverging from it the
first time either one changed.

## Fullscreen is application chrome, not a browser feature

Fullscreen here means hiding `NavBar` and `Footer`, not calling the browser's
Fullscreen API. The API is unreliable on mobile Safari and asks for a
permission the reader doesn't need. `/graphs` already solved the same problem
— a view that covers the site's own navigation needs its own way back — with a
hamburger button opening a fixed popover of site links, language, and theme.
The reader reuses that popover for the same reason: exiting fullscreen and
reaching the rest of the site are rare actions, not reading actions, and they
belong behind the icon graph already uses for "rare actions while the site nav
is hidden."

Turning pages and opening the section index are not rare, so they keep their
own buttons on a thin, permanently visible toolbar next to the hamburger.
Hiding them behind a menu, or hiding the toolbar itself until tapped, would
put friction on the two things a reader does constantly to save space for
something they do once a session.

## A page is the source's page, not the screen's

The source already prints on numbered pages, and a citation depends on that
number staying attached to the same content. Font size becomes adjustable
here, which would silently break that link if a "page" were redefined as
"however much text fits the viewport" — the same printed page would hold
different content depending on what font a reader chose. Instead, one
`SourceAccountPage` row stays one reader page always; a larger font makes that
page scroll inside its own fixed-size card rather than spilling into a
different page.

## Direction is a fact about the source, not an assumption in the component

`SourceAccountReader` hardcodes `dir="rtl" lang="ar"`, which has been
harmless because every source read through it has been Arabic. Swipe
navigation makes that assumption load-bearing: which way a swipe means "next
page" has to match how the book physically turns, and an RTL book turns the
opposite way an LTR one does. Rather than hardcode a gesture direction next to
a hardcoded text direction, `HistoricalSource` gains a `language` column
(default `ar`), and both the text direction and the swipe direction read from
it. No LTR source exists yet; this is a one-column migration taken now, while
the component already needs touching, instead of a hardcoded assumption
someone has to find and undo later.

## What this doesn't cover

Bookmarks and reading-progress both want a signed-in reader, which doesn't
exist yet — no session, no login, just a `User` row nothing currently writes
to. Font, size, and background preferences don't need an account, so they are
saved to `localStorage` now; that's a per-device convenience, not a
substitute for the profile-based sync that will eventually replace it.
