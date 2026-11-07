# Branch exploration and focused comparisons

## Scope

First repair branches, review and merge it. Then refine `/quran/compare` as the dedicated destination for larger passage comparisons, starting with al-A'raf and al-Shu'ara. Branches links into selected comparisons. Prophets' timelines are deferred.

## Branch acceptance criteria

- Purpose categories are mutashabeh, pondering and word trees. The first two are selected by default. Mutashabeh does not require a book citation. Preserve the independent book-evidence filter.
- Difference chips and their examples require citations supporting that particular difference in the displayed passages. Remove unsupported automatic chips, including extension suffixes that conflate implementation terminology with evidence.
- Agent assessments include a rationale; uncertain editorial classifications remain pending owner review rather than being published as settled.
- Deduplicate equivalent visible passage comparisons after scope filtering. Keep meaningful parent and child comparisons accessible. Rebuild focused trees from the surviving occurrences.
- Stable comparison IDs do not depend on current filters. Preserve old links and bookmarks.
- Search results require the studied shared expression to match; surrounding context or an alias occurring in only a few members cannot qualify a broad tree.
- Progress uses the final deduplicated filtered results. Draft filters still require Apply.

## Comparison acceptance criteria

- Retain `/quran/compare`, existing modes and links. Add a focused exploration of explicit larger passage pairs rather than an unrelated second general matching engine.
- Reuse the existing precise-range links, TextCompare, CompareView and PageSpread. Add curated passage links starting with surahs 7 and 26; skip new topic annotation and custom pair-building. Start with clearly identified parallel narrative passages in surahs 7 and 26. Show both complete selected spans, shared wording and differences without unsupported grammatical classifications. Existing unmatched context must open by default for curated selections; lexical matches must not be described as editorial narrative alignment.
- Support Arabic and English, keyboard use and both themes. Make focused selections shareable and linkable from branches.

## Delivery

Two independent read-only data audits precede implementation. Add tests for search eligibility, filtered duplicate groups, citation-scoped tags, default categories, old URL resolution and the focused comparisons. Run lint, TypeScript, the full tests and build before each PR; independent review follows the repository's two-cycle cap. Merge only with green CI.

## Prior evidence

Distillate namaq/0021 documents that absorbing overlapping trees must preserve autocomplete, focused URLs, zoom targets, bookmarks and original word offsets. Test these entry points separately from diagram equality.
