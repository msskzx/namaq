# Mutashabih groups on branches

The branch page opens on reviewed mutashabeh and pondering comparisons in mushaf order. Word trees remain available through the purpose filter. Editorial category membership is independent of book evidence; the explicit review manifest is `shared/quran/mutashabih/categories.json`. Each group uses the existing tree and matrix views, swipe gestures, bookmark and share row. The selected default view still comes from the saved preference. Phrase trees remain available through search and existing links.

## Matching and evidence

The engine compares ayat and selected spans, retaining the original word indices. An explicitly cited passage can continue into the next ayah. Automatic groups require every pair to satisfy the same matching policy. Exact repeats remain accessible. Broad phrase groups are restricted to search.

The thirty cases supplied in the owner's book-rules report are recorded in `shared/quran/mutashabih/evidence.json`. Their quotations, edition locators and selected passages retain the report's attribution and verification limits. A section link stands in for pagination only where the report provides no printed page. The four messenger passages are held together as the requested regression example. Only the cited places inherit the citation.

`MATCH_CONFIG` in the engine holds Namaq's retrieval choices. The books provide no numeric thresholds. Initial settings require six strongly matching words and 72% coverage for a complete ayah comparison. A local span needs eight matches, with at most three intervening words. Unattributed shared phrases need six words and at most thirty-six places. The labelled set includes fifteen common-formula negatives. These values passed that bounded set and require further corpus review.

The static build stores group places, original word indices, alignment levels, moved-word tags, all supported difference tags and citations. Alignments use one reference place against each other place to keep the artifact linear in group size. Clique membership is checked independently across every pair.

Published difference chips require book evidence supporting the exact displayed passage selections. Computational alignments alone do not authorize grammatical chips. Case remains available where supported by the recorded source; unsupported gender, noun/pronoun and frame tags are hidden. The plural-form contrast خطاياكم / خطيئاتكم is not labelled singular/plural.

## Browsing

The type chip below the card toggles word connectors in the matrix. Selecting another type switches connectors, and pressing the active type hides them. Connectors start off. A saved setting next to the default view can enable the first type when opening a group. Card-chip toggles apply to the current group. Filtering remains in the funnel. The differing expression is plain text. Book references and short quotations follow beneath. Both views use the same footer.

The funnel keeps draft filters until Apply. Reset clears the draft. Applied filters are stored in the URL. Selected surahs and juz' combine by union. Page range, legacy juz' range, relation kind, difference kind, saved-only and book-only filters restrict those results. Scope filtering rebuilds shared wording from surviving occurrences and removes containing duplicate anchors over the same visible passage selections. Stable comparison IDs include word offsets and continuation bounds; old IDs remain aliases. Sorting supports mushaf order, closest first, most places and fewest marked word differences.

## Verification

Keep existing tests for search, old phrase links, bookmarked trees, zoom targets, default-view preference, matrix matching, swipe and accessibility. Rewrite assertions tied to the previous default inventory for the group feed. Add regression tests for all thirty book cases, fifteen negatives, nontransitive chains, filters, footer-chip toggling and citations in both views.

Run lint, TypeScript, the full Vitest suite and the production build. Inspect the running app at 390 px in light mode before opening the PR. Run an independent review and answer each finding.

## Prior records

Distillate record namaq/0021, “Absorbing a phrase must preserve its entry points,” informed retaining the legacy phrase inventory for search and zoom targets. Existing links and bookmarks keep their entry points when the default inventory changes.
