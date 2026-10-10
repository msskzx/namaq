# Qira'at page: the same ayah in different readings

Status: built as a demo at `/quran/qiraat`. Strict citations come after the
demo; until then the page says it is a demo, and every meaning line is either a
quotation with its source or labeled as an unsourced suggestion.

## What the owner wants

A page at `/quran/qiraat`, that shows one ayah in more than
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

## What was built

The page has a picker of 12 variants, keyed to the Hafs (Kufi) numbering. The
page says so, and says that Warsh numbers Al-Fatiha without counting the
basmala, so 1:4 is ayah 3 there, and that Al-Baqara has 286 ayat in the Kufi
count, 287 in the Basri and 285 in the Madani.

Each variant is a card:

1. The Hafs ayah through `AyahCard`, with the variant word colored. The text
   comes from the `Ayah` table; no table or migration is added.
2. A word-level display: the variant word with two neighbors on each side, once
   in the Hafs reading and once in the other. It never builds a full ayah from
   the other reading, because that string would be text no mushaf prints. The
   second line is labeled as a word-level difference, not the mushaf text of
   that riwaya.
3. A strip of 20 riwaya chips (`Badge`), one color per reading and grey
   «غير مؤكد» for a riwaya whose reading is not confirmed, with a legend.
   Chips are per riwaya, so a split inside one reader (Asim: Hafs against
   Shu'ba, in 5:6 and 36:35) shows.
4. A meaning line, either quoted from a named mufassir with its URL, or
   labeled «غير موثق (اقتراح للتجربة)». 5:6 shows «لا يُعرض شرح هنا لأنه موضع
   خلاف فقهي», since the difference is a fiqh dispute and the page authors no
   ruling.
5. The Quranpedia URL the reader lists come from.

The data is one typed file, `src/app/quran/qiraat/data/variants.ts`. A reading
lists readers (expanded to their two riwayat) and, where a reader splits, single
riwayat. The logic is in `src/lib/quran/qiraat.ts`: the reader-to-riwaya map,
chip states and neighbor extraction. `data/hafs.fixture.json` holds the twelve
Hafs ayat so the tests need no database.

The Hafs word is stored in plain letters and found by `normalizeWord`, which
drops the dagger alef. So the Hafs مَـٰلِكِ is matched as «ملك», قَـٰتَلَ as
«قتل» and عِبَـٰدُ as «عبد». 2:9 carries an `occurrence` because يُخَـٰدِعُونَ and
يَخۡدَعُونَ normalize to the same word.

## The 12 variants and what Quranpedia confirmed

Reader lists come from the riwaya tables on each Quranpedia ayah page
(`https://quranpedia.net/ayahs/<s>/<a>`; the fuller `/qiraat/<surah>/<a>` page
for 2:259, 5:6 and 18:86). The source book is not named there; check against
al-Nashr in the citation phase.

| Ayah | First reading (Hafs side) | Second reading | Notes |
| --- | --- | --- | --- |
| 1:4 | مالك: Asim, al-Kisa'i, Ya'qub, Khalaf al-Ashir | ملك: Nafi', Ibn Kathir, Abu Amr, Ibn Amir, Hamza, Abu Ja'far | No riwaya table on the page. The lists come from a footnote citing al-Nashr and al-Ithaf, so they are per reader and the card says so. |
| 2:9 | يخدعون | يخادعون: Nafi', Ibn Kathir, Abu Amr | Matches the proposed list. |
| 2:132 | ووصى | وأوصى: Nafi', Ibn Amir, Abu Ja'far | Matches. |
| 2:259 | ننشزها | ننشرها: Nafi', Ibn Kathir, Abu Amr, Abu Ja'far, Ya'qub | Matches. |
| 3:146 | قاتل | قُتل: Nafi', Ibn Kathir, Abu Amr, Ya'qub | Matches. |
| 5:6 | وأرجلَكم: Nafi', Ibn Amir, al-Kisa'i, Ya'qub, Hafs | وأرجلِكم: Ibn Kathir, Abu Amr, Hamza, Abu Ja'far, Khalaf al-Ashir, Shu'ba | Matches, with the Asim split. |
| 9:100 | تحتها | من تحتها: Ibn Kathir (al-Bazzi, Qunbul) | Matches. |
| 17:93 | قل | قال: Ibn Kathir, Ibn Amir | Matches. |
| 18:86 | حمئة | حامية | **Quranpedia lists no reading for this word**; its table for 18:86 holds only فيهم. The reader list in the brief is not confirmed, so every chip is grey. |
| 36:35 | عملته: Nafi', Ibn Kathir, Abu Amr, Ibn Amir, Abu Ja'far, Ya'qub, Hafs | عملت: Hamza, al-Kisa'i, Khalaf al-Ashir, Shu'ba | Matches, with the Asim split. |
| 43:19 | عباد | عند: Nafi', Ibn Kathir, Ibn Amir, Abu Ja'far, Ya'qub | Matches. |
| 49:6 | فتبينوا | فتثبتوا: Hamza, al-Kisa'i, Khalaf al-Ashir | Matches. |

"Khalaf" in a reader list is Khalaf al-Ashir (Ishaq, Idris). Khalaf an Hamza is a
riwaya of Hamza and sits on Hamza's side.

Meanings: 2:259, 3:146, 18:86, 36:35 and 49:6 quote al-Tabari from the
Quranpedia ayah page; 1:4 quotes Ibn Kathir from the KSU page the brief named.
The brief asked for al-Baghawi and al-Baydawi there, but the page shows Ibn
Kathir, and the quoted line is his. 18:86 quotes al-Tabari's reports on the two
words, since the brief's Ibn Kathir exchange is not in the page text I read.
2:9, 2:132, 9:100, 17:93 and 43:19 carry a short unsourced suggestion, labeled.

## Open questions for the next phase

- Whether to download a full farsh al-huruf dataset (see the table above): the
  likeliest route is digitizing al-Shatibiyya and al-Durra, or checking QUL.
  Nothing was downloaded for this demo.
- Check every reader list against al-Nashr and name the book.
- Find the real source for 18:86, and confirm whether Abu Ja'far and Khalaf
  al-Ashir read حامية.

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
