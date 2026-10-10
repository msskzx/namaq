# Qira'at page: the same ayah in different readings

Status: proposal for a demo. Nothing here is built. Strict citations come after
the demo; until then every variant and every meaning below is a demo
suggestion, and the page must say so.

## What the owner wants

A new page, suggested route `/quran/qiraat`, that shows one ayah in more than
one reading and, where it helps, how the readings differ in meaning. Arabic
only, light and dark, usable at phone width, styled like `/quran` and
`/quran/compare`.

## What the app has today

- The `Ayah` table holds 6,236 Hafs ayat. `RecitationType` has `HAFS` and
  `WARSH`, but only `HAFS` rows exist.
- `src/lib/quran/normalize.ts` (`normalizeWord`, `ayahWords`) splits an ayah
  into display and normalized words.
- `src/lib/quran/wordDiff.ts` (`wordDiff`, `sharedSlots`) finds differing word
  positions and assigns color slots. `src/components/quran/AyahCard.tsx` takes a
  `slots` map and colors those words with `SLOT_COLORS`.
- `src/lib/quran/compare.ts` aligns two surahs; `/quran/compare` shows them.
- `docs/plans/quran-as-a-source.md` already says a page belongs to a
  recitation (riwaya).

So a page that shows one Hafs ayah beside an alternative wording, with the
differing word colored, needs no new component. It needs a data file.

## Where the data can come from

I looked at pages only and downloaded nothing. Nothing I found is a ready
machine-readable table of farsh al-huruf (variant words per ayah, with the
readers on each side) for the ten readers. That is the main finding.

| Source | What it gives | Licence | Machine-readable | Variant word and readers per ayah |
| --- | --- | --- | --- | --- |
| Quran.com API v4 (`api.quran.com`) | Hafs text in `text_uthmani`, `text_uthmani_simple`, `text_imlaei`, `text_indopak`, `text_uthmani_tajweed`. The recitations resource lists 12 audio reciters, all Hafs. | Per Quran Foundation terms, not checked | Yes | No. No Warsh or Qalun text or mushaf id found. |
| Quran.com "Qira'at" tab (Ayah Study Mode) | Per-ayah reading notes on the website. The explainer shows 1:4 with a meaning note. | Unknown | No API or data source documented that I could find | Appears so on the site, but the source book is not named. A feedback request to add Warsh and Qaloon is open. |
| KFGQPC (King Fahd Complex) | Mushaf text per riwaya (Warsh, Qalun, al-Duri and others) and Unicode fonts. A secretary-general statement allows free use of the mushaf text copy. | Font licence not found; check the official download page | Text yes, as Unicode | No. Whole mushafs, not a variant table. |
| ibnhazm/KFGQPC on GitHub | Third-party mirror with Warsh, Qalun and Doori fonts as TTF and WOFF2 | Not confirmed, unofficial | Fonts only | No |
| Tanzil | Hafs only (Uthmani and Simple variants) | CC BY 3.0 per a mirror, no changes allowed | Yes | No |
| `quran-ws/quran-text` on Packagist | Says it has seven riwayat, including `warsh.json`, with shared word numbering | Not verified | Yes | Unknown. Riwaya texts could be diffed against Hafs to find variant words, but would not name the readers. |
| ulumalazhar.com printed Mushaf of the ten qira'at | Differing words among the ten readers, with the reader named, from the Shatibiyya and Durra | Printed work | No | Yes, but must be digitized by hand |
| Quran.com feedback thread on 2:245 | One user's note on which readers read sad | None | No | One case |
| Wikipedia, Qira'at article | Overview of readers and riwayat | CC BY-SA | Prose | A few examples |
| Classical works: al-Shatibiyya, al-Durra, Taybat al-Nashr, Ibn Khalawayh, al-Farisi, Makki | The authority for variants and meanings | Public domain texts | Not as data | Yes, in verse or prose |

Not checked: QuranEnc, Quranic Corpus, QUL (qul.tarteel.ai, which hosts
KFGQPC resources and might hold more than I saw). The owner or the next phase
should look there before anyone authors a full table.

Recommendation: for the demo, use a hand-picked static file of about ten
variants. It needs no download and no approval. For a full dataset, the likely
route is to digitize farsh al-huruf from al-Shatibiyya (seven readers) and
al-Durra (three more), keyed by surah, ayah, word index and reader. A riwaya
text diff (KFGQPC Warsh against Hafs) can find the word positions, but not who
reads what. If the owner later wants a download, the request would name the
KFGQPC Warsh text (Unicode text, probably a few MB, to live under `data/` as
source material, not in the repo root), and we would first confirm its licence
on the official page.

## Candidate variants for the demo set

Hafs wording is checked against `http://localhost:3000/api/quran/surahs/<n>`
for every row except 2:10, which I did not fetch. Everything in the "other
reading", "readers" and "meaning" columns is from memory and unverified,
including reader lists. The only variant confirmed on the web is the 1:4 pair
(both readings exist, complementary meaning, per the Quran.com explainer).

| Ayah | Hafs word (checked locally) | Other reading | Readers of the other side (from memory) | Meaning note, demo suggestion (from memory) |
| --- | --- | --- | --- | --- |
| 1:4 | مَالِكِ | مَلِكِ | Nafi', Ibn Kathir, Abu Amr, Ibn Amir, Hamza, Abu Ja'far read ملك; 'Asim, al-Kisa'i, Ya'qub, Khalaf read مالك | Owner of the Day versus King of the Day. Both fit; the Quran.com explainer calls them complementary. Al-Farisi's al-Hujja discusses the choice. |
| 2:9 | وَمَا يَخۡدَعُونَ | وما يخادعون | Nafi', Ibn Kathir, Abu Amr, plausibly Abu Ja'far and Ya'qub | The second verb mirrors the first (they "deal deceitfully with" God and the believers) versus a plain "deceive only themselves". Source: Ibn Khalawayh, from memory. |
| 2:10 | يَكۡذِبُونَ | يُكَذِّبُونَ | Kufan readers (Asim, Hamza, al-Kisa'i) read the Hafs form | They lie versus they call the Messenger a liar. Not fetched locally. |
| 2:132 | وَوَصَّىٰ | وَأَوۡصَىٰ | Nafi', Ibn Amir, Abu Ja'far | Both mean "enjoined". The second is a different verb form and changes the spelling in the mushaf. |
| 2:259 | نُنشِزُهَا (zay) | نُنشِرُهَا (ra) | Ibn Kathir, Abu Amr (zay is Nafi', Ibn Amir, Hamza, al-Kisa'i, Asim) | Raise and join the bones together versus bring the bones to life. Source: Ibn Khalawayh, from memory. |
| 3:146 | قَـٰتَلَ | قُتِلَ | Nafi', Ibn Kathir, Abu Amr, Ya'qub | A prophet fought beside many scholars, or a prophet was killed and many scholars with him did not weaken. A well-known case where the sense of who fell changes. |
| 5:6 | وَأَرۡجُلَكُمۡ (accusative) | وَأَرۡجُلِكُمۡ (genitive) | Ibn Kathir, Abu Amr, Hamza, Shu'ba read genitive | Wash the feet versus wipe over the head and feet. The ruling debate in fiqh turns on it; al-Itqan and the tafsirs discuss it. |
| 9:100 | تَجۡرِی تَحۡتَهَا | تجري من تحتها | Ibn Kathir (and the Makkan mushaf) | One added word, so the rasm differs. Meaning the same; a clean example of a rasm difference. |
| 18:86 | حَمِئَةࣲ | حامية | Nafi', Ibn Amir, Abu Ja'far (others uncertain) | Muddy black silt versus hot. The old Ibn Abbas and Mu'awiya exchange about it is told in the tafsirs. Check the anecdote before use. |
| 49:6 | فَتَبَیَّنُوۤا۟ | فتثبتوا | Hamza, al-Kisa'i, Khalaf | Investigate clearly versus verify and wait. Both warn against acting on a sinner's report. |

The four I would trust most for a first demo, because the readings are widely
known and the Hafs side is confirmed in our own text: 1:4, 49:6, 5:6 and 9:100.
Even these need the reader lists checked against al-Shatibiyya before any
citation.

Note that 12:11 and 2:245 in our Hafs text carry marks (an ishmam sign, a small
letter over a sad) that encode a reading inside the Hafs script. A page that
splits words must not treat those as variants.

## Page ideas

### A. Ayah picker with variant words highlighted

An ayah selector (or a list of the demo set) shows the Hafs text with the
variant word colored. Under it, a badge row per reading: the wording, then the
readers on that side. A line below carries the meaning note, labeled as a demo
suggestion.

- Data: the demo file only. Words located by index into `ayahWords`.
- Cost: low. Reuses `AyahCard` slots and `Badge`. This is the recommended page.

### B. Two readings side by side

Two stacked cards (stacked on a phone, side by side on a wide screen): Hafs on
one, the other reading on the other, the differing word colored by the same
slot in both. The second text is the Hafs ayah with the variant word swapped,
produced by the static file.

- Data: demo file with the replacement word per reading.
- Cost: low. `wordDiff` and `sharedSlots` already do the coloring. The risk is
  that a swapped word is not the exact printed text of that riwaya (see risks).

### C. Who reads what matrix

Rows are variant words, columns are the ten readers; a cell shows which side
the reader takes (a color, not a label). It makes the pattern visible: a block
of Kufan readers on one side, the Hijazis on the other.

- Data: the demo file with a reader list per side. A real matrix needs the full
  farsh table, which is the expensive dataset. With ten rows it is a teaser.
- Cost: medium for the UI. A small table on a phone needs horizontal care.

### D. Per-surah heat strip

One strip per surah, one cell per ayah, shaded by number of variant words.
Honest only with a full dataset. With the demo set, nearly every cell would be
empty and the strip would mislead. Defer until the full table exists.

### Which are possible now

| Idea | Hand-picked file | Needs full dataset |
| --- | --- | --- |
| A picker with highlights | Yes | Only to extend |
| B side by side | Yes | Only to extend |
| C reader matrix | Teaser with ten rows | Yes, to mean anything |
| D heat strip | No | Yes |

Recommended: build A, with B as the view for the chosen pair of readings.

## Suggested data shape for the demo file

One entry per variant: surah, ayah, word index in the Hafs ayah (counted the
same way `ayahWords` counts), a list of readings, each with its text and its
readers, and an optional meaning note with its source named in prose. The
reader ids are the ten names; riwayat can be added later. A short validation
test should check that each Hafs word at the given index equals `Hafs word` in
the entry, so a text change cannot silently misalign the file. Per the repo
rule, any code comment points to this document and nothing more.

## Risks

1. Rasm and script differ by riwaya. Warsh and Qalun use different spelling,
   dotting (Warsh's dotless fa and qaf, per a Unicode Consortium note, which
   few fonts support) and diacritic conventions. A Hafs word with another
   reading's letters swapped in is a rendering aid, not that riwaya's printed
   text. Say so on the page, and do not call the swapped string "the Warsh
   text".
2. Versification differs. Ayah counts and numbers differ between schools (for
   example whether the opening letters of a surah are an ayah on their own). A
   surah:ayah key for Hafs may point at a different ayah in another riwaya.
   Keep every entry keyed to the Hafs numbering and say that.
3. Hafs text already contains reading marks (small letters, ishmam signs, the
   marks on sad and sin). Word-level matching must work on the normalized form
   but display the original.
4. Meaning claims must not be authored by us. Each note needs a named classical
   source (Ibn Khalawayh, al-Farisi, Makki, Ibn Jinni, al-Suyuti, or a tafsir)
   before it leaves the demo, with page and quotation like every other value in
   this repo. For the demo, label them "demo suggestion, from memory".
5. Reader lists from memory are the likeliest errors. I am unsure of at least
   2:9, 2:10, 2:259 and 18:86. The ten readers have two narrators each, and a
   riwaya can differ from its imam; a demo that says "Nafi'" when only Warsh or
   Qalun reads that way is wrong.
6. Licence: Tanzil forbids changes to the text; KFGQPC font terms are
   unconfirmed; the Packagist data licence is unknown. None is needed for the
   hand-picked demo.
7. Fonts: if we ever show true Warsh script, the system may lack glyphs, so the
   KFGQPC Warsh font would need to be hosted, after a licence check.
8. A page about reading differences invites reading it as doctrine. It needs a
   short note that all ten readings are mutawatir and the page picks no side.

## Assumptions for the SKEPTIC to attack

1. No ready-made farsh al-huruf dataset exists online in machine-readable form,
   and a hand-picked file is the right start. (I searched pages, not
   repositories in depth; QUL and QuranEnc were not checked.)
2. Ten variants are enough to show the idea, and a demo that shows only ten
   will not be mistaken for coverage.
3. Page A plus B is better than the matrix or heat strip for a first demo.
4. Keying every entry to Hafs surah:ayah and Hafs word index is stable enough.
5. Swapping one word into the Hafs text and coloring it is an honest enough
   rendering for a demo, given the rasm risk.
6. Reader attributions at the level of the ten imams, without riwayat, are
   acceptable for the demo even though they blur Warsh and Qalun.
7. The reader lists in the table above are right. They come from memory.
8. Showing meaning notes before sources exist, labeled as demo suggestions, is
   acceptable and will not leak into the data later as if cited.
9. The Hafs word index from `ayahWords` is the same as the index a viewer would
   count, including after basmala stripping and inside ayat with waqf marks.
10. Reusing `AyahCard` slots needs no change to the component.
11. 2:10, 2:9 and 18:86 are well known enough to include; 18:86's anecdote may
    not be.
12. The owner will accept that a full dataset is a separate, larger task that
    needs a licence check and possibly a download approval.
