# Source reader decisions

[ADR 0016](adr/0016-a-reader-that-owns-the-whole-screen.md) owns the fullscreen, source-page identity, source-language direction and local-preference decisions. The shared reader serves source pages and person profiles; a second reader would duplicate those rules.

## Reading continuity

Prefetch adjacent printed pages so ordinary page turns do not wait for the network. A jump starts at the requested page, and a missing adjacent page must not prevent the requested page from loading. Keep the cache local to the session and book. Its window size and request limits belong in the code.

Reading settings are per-device preferences, independent of the site theme. Bookmarks and reading-progress sync remain deferred until accounts exist. Cache eviction and cross-book prefetch are also deferred.

## Source structure

Source headings must render consistently in the index and page body. A bracketed heading is source structure, not literal brackets added to the reader's prose. The shared paragraph parser owns detection.
