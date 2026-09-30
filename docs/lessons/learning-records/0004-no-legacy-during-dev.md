# No back-compatibility layers while the app is unreleased

Rejected the staged migration and the URL-translation layer outright: "it is not
like the app is 5 years old that we need to keep legacy code, we are in dev
phase". Applies to already-emitted `?book=&page=` links, to adapters between old
and new authored file shapes, and by extension to any compatibility shim
proposed before release.

**Implications:** when a change has a clean form and a compatible form, propose
the clean one and price the breakage honestly, rather than offering the staged
path as the safe default. See [[0003-page-keyed-by-reader-not-book]].
