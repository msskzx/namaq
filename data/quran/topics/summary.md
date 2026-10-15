# Topics reconciliation: surahs 41-65

Draft A had full, gap-free ayah coverage for all 25 surahs. Draft B left
coverage gaps in surahs 50 (36-37), 53 (49, 54-55), 54 (6-8, 51-53), 58 (21),
60 (2, 11), 61 (4, 9), 62 (3-4, 10), 64 (2-4, 8, 14). Draft A was adopted as
the canonical file for every surah in this range on completeness grounds;
boundary/wording differences of a few ayat were resolved by keeping A's
reading rather than reconstructing both.

Three surahs had a genuine structural disagreement (different topic
category over substantially the same ayat, not just a shifted boundary) and
ship as two rows, B's reading kept as an `alternativeOf` the canonical A row:

- **50** - ayat 23-29: A reads it as `reward-50-1` (reward/punishment scene
  continuing from 19-22's day-of-judgment setup); B reads 19-29 as one
  `day-50-5` block. Kept A canonical (reward is the dominant content of
  23-29), added B's `day-50-5` as `alternativeOf: reward-50-1`.
- **53** - ayat 26-30: A reads it as `denial-53-1` (disbelievers following
  conjecture); B reads 24-32 as one `tawhid-53-5` block. Kept A canonical,
  added B's `tawhid-53-5` as `alternativeOf: denial-53-1`.
- **61** - ayat 7-8: A folds it into `prophet-61-1` (6-9, messenger
  discussion); B isolates it as `denial-61-5` (lying about Allah). Kept A
  canonical, added B's `denial-61-5` as `alternativeOf: prophet-61-1`.

All other surahs (41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 52, 54, 55, 56, 57,
58, 59, 60, 62, 63, 64, 65): A's draft adopted as-is; differences from B were
wording or boundary shifts of a few ayat, or B simply had a coverage gap
across the disputed span, so no `alternativeOf` row was needed.
# Reconciliation summary: surahs 66-90

Method: diffed Agent A and Agent B drafts programmatically (ranges + slugs per surah).
Every disagreement found was a boundary/granularity split over the same material (where
exactly to cut a range, how finely to subdivide), not a genuine structural disagreement
(same ayat getting two incompatible topic readings). Agent A's drafts cover every ayah of
every surah 66-90 with no gaps; Agent B leaves gaps in most surahs. Adopted Agent A's draft
as-is (copied verbatim, no retyping of excerptAr) for all 25 surahs on completeness grounds;
no `alternativeOf` rows were needed.

- 66: straightforward merge — A adopted (B's split of 6-7/8 into 6/7-8 is a boundary variant)
- 67: straightforward merge — A adopted (B subdivides 5-11/12-14 differently; same material)
- 68: straightforward merge — A adopted (B drops ayah 3, 7, 38, 46 from coverage)
- 69: straightforward merge — A adopted (B drops ayah 11-12)
- 70: straightforward merge — A adopted (B's 1-9/10-18 split vs A's 1-7/8-14; same material)
- 71: straightforward merge — A adopted (B drops ayah 12)
- 72: straightforward merge — A adopted (B drops ayah 4, 12-15, 24)
- 73: straightforward merge — A adopted (B drops ayah 12-13, 17-19)
- 74: straightforward merge — A adopted (B drops ayah 3, 7, 26 context, 48-53)
- 75: straightforward merge — A adopted (B drops ayah 5-6, 26-36)
- 76: straightforward merge — A adopted (B drops ayah 28-29)
- 77: straightforward merge — A adopted (B's 8-13/15-18 split vs A's 8-15/16-19; same material)
- 78: straightforward merge — A adopted (B drops ayah 37)
- 79: straightforward merge — A adopted (B drops ayah 13-14, 20-22)
- 80: straightforward merge — A adopted (B drops ayah 8-10, 23)
- 81: straightforward merge — A adopted (B drops ayah 4-6, 14, 18, 24)
- 82: straightforward merge — A adopted (B's split differs, same material, A simpler)
- 83: straightforward merge — A adopted (B drops ayah 33)
- 84: straightforward merge — A adopted (B drops ayah 15, 19, 22-24)
- 85: straightforward merge — A adopted (B drops ayah 11-18)
- 86: straightforward merge — A adopted (B's 1-3 vs A's 1-4; boundary variant only)
- 87: straightforward merge — A adopted (B drops ayah 8)
- 88: straightforward merge — A adopted (B's split finer but same material, A simpler/complete)
- 89: straightforward merge — A adopted (B drops ayah 26)
- 90: straightforward merge — A adopted (B drops ayah 1, 18)

No genuine structural disagreements were found across surahs 66-90; no `alternativeOf` rows
were created.
# Reconciliation log: surahs 91-114

Two independent drafts (A, B) reconciled per surah. No genuine structural
disagreement (same ayah span, incompatible themes) was found in this range —
every surah was either a wholesale adoption (one draft had a gap or weaker
theme tagging) or a granularity merge (one draft subdivided further without
contradicting the other). No `alternativeOf` rows were created.

- 91: adopted B — finer oath/human/trial split, no gap, both complete.
- 92: adopted A — B has gaps (ayat 13, 19 uncovered).
- 93: adopted A — B has a gap (ayah 4 uncovered).
- 94: adopted A — B's "creation" tag for ayah 4 ("ورفعنا لك ذكرك") is a
  mislabel; A's prophet/trial/tawhid split is coherent.
- 95: adopted A — creation(4-5)+faith(6) split matches the standard
  "best form, then lowest, except believers" reading better than B's
  creation(4)+human(5-6).
- 96: adopted A — B has large gaps (ayat 8, 12-14, 17-18 uncovered).
- 97: adopted A — single revelation topic is simplest and accurate; B's
  three-way split of the same theme added no disambiguating value.
- 98: adopted B — separates the "messenger reciting pure scriptures" (2-3)
  as its own revelation topic rather than folding it into denial; both
  fully cover 1-8.
- 99: adopted B — separates the human's reaction (3-4) and the divine
  command (5-6) from the final reward clause (7-8); finer, no gap.
- 100: adopted A — B has a gap (ayah 5 uncovered).
- 101: adopted B — natural clause-level split (intro/description,
  two outcomes) with no loss of coverage.
- 102: adopted B — splits the "Day" accounting language (7-8) from the
  general reward/certainty warning (3-6); both cover 1-8.
- 103: adopted B — separates the oath (1) from its content claim (2) under
  distinct theme ids instead of lumping both under "oaths".
- 104: adopted B — separates the backbiter's false belief (3-4) from the
  description of the Hutama's punishment (5-9).
- 105: adopted B — separates the rhetorical question (1-2) from the
  description of the divine punishment (3-5, tagged trial).
- 106: adopted B — same ranges/excerpts as A; B's labelAr wording is more
  accurate (A's label for ayat 1-2 quoted a phrase from ayah 4).
- 107: adopted A — B's theme tags ("day" for 1-2, "tawhid" for 5-7) don't
  fit the content (denial of judgment/charity, hypocrisy in prayer); A's
  denial/conduct split is accurate.
- 108: adopted A — drafts are identical in range/excerpt/theme; A kept for
  slug consistency.
- 109: adopted B — the "qul ... la a'budu" declaration (1-2) stands apart
  from the mutual-negation refrain starting at ayah 3; B's boundary fits
  the refrain pattern better than A's (1-3)/(4-6).
- 110: adopted A — identical to B apart from diacritics; A kept.
- 111: adopted A — identical to B apart from slug suffix; A kept.
- 112: adopted A — B isolates ayah 1 ("qul huwa Allahu ahad") as a thin
  "prophet" row, but that ayah already states the tawhid content itself;
  A's single tawhid(1-4) row is the better fit.
- 113: adopted B — splits natural evils (general evil + night/ghasiq,
  2-3) from human-caused evils (magic + envy, 4-5), a sharper distinction
  than A's human(3-5) lump.
- 114: adopted A — the three parallel epithets of ayah 1-3 (Lord/King/God
  of mankind) belong together as one tawhid declaration; B's split after
  ayah 1 has no content basis (unlike the comparable split in 113, where
  ayah 2 shifts into a content catalog).

## Final dry-run (surahs 91-114)

`npm run quran:topics:sync` has no per-range filter; it scans the whole
`data/quran/topics` tree.

```
Quran topics sync (dry run)
Surahs: 74, topic records: 540
Warnings: 4
  55:reward-55-2 — range spans 16 ayat (> 15)
  55:reward-55-3 — range spans 17 ayat (> 15)
  56:reward-56-1 — range spans 19 ayat (> 15)
  68:trial-68-1 — range spans 17 ayat (> 15)
```

All four warnings are in surahs 55/56/68 (outside this range, from an
earlier batch) — zero errors and zero warnings across surahs 91-114.
73 topic records across the 24 surahs in this range.
