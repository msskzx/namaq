# No back-compatibility layers while the app is unreleased

While the app is unreleased, propose the clean form and price the breakage, not a staged compatible path.

Kind: challenge · Outcome: solved · Date: 2026-09-30 · Topics: migrations

**Problem:** Deciding whether to keep compatibility layers or adapters for old shapes and links in an unreleased app.

**Fix:** Rejected the staged migration and the URL-translation layer; the clean form with the breakage priced held.

**When it applies:** The app is unreleased and in dev phase, so old links and file shapes carry no users.

**Rule it changes:** When a clean form and a compatible form both exist, propose the clean one and price the breakage honestly.

**Evidence:** Owner's stated rule: "we are in dev phase" (no commit named in the record)

**Builds on:** [0003](0003-page-keyed-by-reader-not-book.md)

## What happened

Rejected the staged migration and the URL-translation layer outright: "it is not
like the app is 5 years old that we need to keep legacy code, we are in dev
phase". Applies to already-emitted `?book=&page=` links, to adapters between old
and new authored file shapes, and by extension to any compatibility shim
proposed before release.

**Implications:** when a change has a clean form and a compatible form, propose
the clean one and price the breakage honestly, rather than offering the staged
path as the safe default. See [0003-page-keyed-by-reader-not-book](/records/namaq/0003-page-keyed-by-reader-not-book).
