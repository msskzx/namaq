# Relations within a single surah

Status: built as the demo page `/quran/shifts`; the section "Verdict after testing"
at the end overrides the ideas above where they differ. No citations yet.

## What the owner wants

The /quran page compares passages across surahs and deliberately skips shared
runs inside one surah. This plan covers that missing half: how a surah moves
between parts of itself. The owner's seeds:

- 43:22 and 43:23, one claim stated twice.
- 12:80-81, a speech that turns into the words the brothers will say.
- Iltifat of person: speaking about God, then addressing Him (1:2-5).
- Iltifat of number: singular, then plural (43:36-37).

## Checked against the text

I read surahs 1, 12, 43 and several more from the running API
(`/api/quran/surahs/<n>`) and checked the words below.

43:22-23. Both ayat contain the same eleven-word clause `إِنَّا وَجَدۡنَاۤ
ءَابَاۤءَنَا عَلَىٰۤ أُمَّةࣲ وَإِنَّا عَلَىٰۤ ءَاثَـٰرِهِم`, then differ in the last word:
`مُّهۡتَدُونَ` (22) against `مُّقۡتَدُونَ` (23). The speakers differ too: 22 opens
`بَلۡ قَالُوۤا۟`, the Quraysh; 23 reports `قَالَ مُتۡرَفُوهَا`, the elites of earlier
towns, after `مِن قَبۡلِكَ`. 24 then has the warner speak (`قَـٰلَ أَوَلَوۡ جِئۡتُكُم`)
and the answer `قَالُوۤا۟`. So a repetition finder finds this one by itself, and
the near-miss in the last word is the point. A plain diff already shows it.

43:36-38. 36 is `وَمَن یَعۡشُ ... نُقَیِّضۡ لَهُۥ شَیۡطَـٰنࣰا فَهُوَ لَهُۥ قَرِینࣱ`:
`مَن` takes singular verbs and pronouns (`یَعۡشُ`, `لَهُۥ`, `فَهُوَ`). 37 switches
to `وَإِنَّهُمۡ لَیَصُدُّونَهُمۡ ... وَیَحۡسَبُونَ`, all plural, still about the same
`مَن`. 38 goes back to singular (`جَاۤءَنَا قَالَ یَـٰلَیۡتَ بَیۡنِی وَبَیۡنَكَ`).
Correction to the owner's wording: this is not singular address then plural
address. All three ayat are third person about the one who turns away; the
number moves from the word's form (lafz) to its meaning (ma'na). The singular
address is the `بَیۡنِی وَبَیۡنَكَ` inside the quoted cry in 38. This is a
different device from iltifat and the page should not label it as one.

12:80-83. 80: `قَالَ كَبِیرُهُمۡ أَلَمۡ تَعۡلَمُوۤا۟ أَنَّ أَبَاكُمۡ` is the eldest
speaking to the brothers, about "your father" (`أَبَاكُمۡ`) and "my father"
(`أَبِیۤ`, `لِیۤ`). 81 starts with the imperative `ٱرۡجِعُوۤا۟ إِلَىٰۤ أَبِیكُمۡ
فَقُولُوا۟` and then, with no new `قَالَ`, the quoted message is already in the
brothers' mouths: `یَـٰۤأَبَانَاۤ إِنَّ ٱبۡنَكَ سَرَقَ وَمَا شَهِدۡنَاۤ`. Three
things change without a marker: "your father" becomes `أَبَانَا` "our father",
the addressees (plural brothers) become the addressed (the father), and the
speaker of "we" becomes the group. 82 continues with the singular imperative
`وَسۡـَٔلِ ٱلۡقَرۡیَةَ`, addressed to the father, still inside the message, and ends
`وَإِنَّا لَصَـٰدِقُونَ`. 83 `قَالَ بَلۡ سَوَّلَتۡ لَكُمۡ` is Yaqub answering as if
the message had been delivered, with `لَكُمۡ` plural. The owner's "81" is right
for the nested speech; the visible reply of the father comes at 83, so the
shift spans 80-83.

1:2-7. 2-4 are third person about God (`لِلَّهِ`, `رَبِّ`, `مَـٰلِكِ`). 5 switches:
`إِیَّاكَ نَعۡبُدُ وَإِیَّاكَ نَسۡتَعِینُ` is second person singular with first person
plural for the speakers. 6 keeps it with the imperative `ٱهۡدِنَا`, 7 has
`أَنۡعَمۡتَ` (you) and returns to the third person for those who are angered at.
Machine-checkable at the word level: `إِیَّاكَ` and `ـتَ`.

Other candidates verified on the text:

- 10:22 `كُنتُمۡ فِی ٱلۡفُلۡكِ وَجَرَیۡنَ بِهِم`: "you" (`كُنتُمۡ`) then "them"
  (`بِهِم`) in one ayah. Classic example in al-Itqan.
- 35:9 `أَرۡسَلَ ٱلرِّیَـٰحَ فَتُثِیرُ ... فَسُقۡنَـٰهُ ... فَأَحۡیَیۡنَا`: third person
  `أَرۡسَلَ`, then `فَسُقۡنَـٰهُ` with "we". Classic example.
- 17:1 `أَسۡرَىٰ بِعَبۡدِهِۦ ... بَـٰرَكۡنَا ... لِنُرِیَهُۥ ... إِنَّهُۥ هُوَ ٱلسَّمِیعُ`: from
  "He" to "We" and back to "He" within one ayah.
- 36:20-22 `یَـٰقَوۡمِ ٱتَّبِعُوا۟` then `وَمَا لِیَ لَاۤ أَعۡبُدُ ٱلَّذِی فَطَرَنِی وَإِلَیۡهِ
  تُرۡجَعُونَ`: the man speaks of himself (`لِیَ`, `فَطَرَنِی`), then "you will be
  returned" to his people. Fits the person shift cited in al-Burhan.
- 48:8-9 `أَرۡسَلۡنَـٰكَ` then `لِّتُؤۡمِنُوا۟ ... وَتُعَزِّرُوهُ`: singular address to the
  Prophet, then plural to the believers. Number shift of address, and this one
  does fit the owner's idea of singular then plural. Hafs reads `تُؤۡمِنُوا۟`; other
  readings use `یُؤۡمِنُوا۟`, which removes the shift. Note this: the shift
  is a feature of one reading.
- 55:13, 55:16 and 29 more: `فَبِأَیِّ ءَالَاۤءِ رَبِّكُمَا تُكَذِّبَانِ`, a refrain
  with dual address. Identical text, trivially machine-checkable.
- 108:1-2 `أَعۡطَیۡنَـٰكَ` then `فَصَلِّ لِرَبِّكَ`: "We" speaking, then a command
  to the same addressee with "your Lord" in place of "Us". Third-to-first
  alternation is the subject of the next section.

Note for any counting code: in the data, ayah 1 of every surah except 1 and 9
carries the basmala in its text (17:1, 108:1). `ayahWords(text, true)` strips it.

## What the text alone can give

The signals below work on surface forms after `normalizeWord`.

| Signal | Detect by | False positives |
| --- | --- | --- |
| Quoted-speech openers | `قَالَ`, `قَالُوا`, `قُلۡ`, `یَقُولُ`, `قَالَتۡ` as a word | Common. A `قَالَ` can open a narrator's report, a divine speech or a quote; the speaker is not in the word. |
| Address number | Suffix `كَ`, `كِ` vs `كُمۡ`, `كُمَا`, `كُنَّ` on a word; `إِیَّاكَ` | `كَ` as the preposition "like", and as part of a stem (`ذَ ٰ⁠لِكَ` is a demonstrative). Needs a stop list. |
| Pronoun suffix `هُ`, `هُمۡ`, `هَا` | Suffix match | Many words end in these letters without being pronouns (`ٱللَّهُ`, `وَجۡهُ`). Rough. |
| Verb prefix `نَ` / `أَ` / `تَ` / `یَ` | First letter after a clitic | Nouns and Form VII verbs start the same way. No way to tell without a lexicon. |
| First-person standalone | `إِنَّا`, `نَحۡنُ`, `أَنَا`, `إِنِّی` | Low. A list of ten words; reliable. |
| Second-person standalone | `أَنتَ`, `أَنتُمۡ`, `إِیَّاكَ` | Low. |
| Imperative with plural `وا` | Word ends `ُوا۟` and sits in an ayah with no `قَالُوا` | Past plural verbs end the same; only context separates them. |
| Repeated runs inside a surah | Reuse `passages.ts` with surah A equal to surah B and skip self-overlap | None. It is exact words, and it is the safest signal. |
| Refrains | A run of at least 4 words repeated at least 3 times | None for finding, but the editorial call ("refrain" vs "formula") is a human one. |

The hard truth: person and number of a verb are not readable from letters. A
trailing `ـتُ` can be "I" or "you"; `یَ` begins both "he" and "they" (`یَعۡشُ`
and `یَصُدُّونَ`). The pronoun and suffix lists above give a rough grid of
"mostly second person", "mostly third person" per ayah, enough for a ribbon
that flags a change but not enough to name the shift. Any list of shifts I would
call "detected" from letters alone would need a human to confirm every row.

Not computable without morphology: subject of a verb, who `قَالَ` refers to, the
addressee of an imperative, and whether a pronoun refers back to `مَن` or to a
new subject. The speaker timeline needs that last piece.

## Open morphology data

The Quranic Arabic Corpus morphology file (version 0.4, Kais Dukes, 2011),
linked from corpus.quran.com/download. It tags every segment (about 128,000) by
part of speech, root, lemma and the features person, number and gender (for
example `3MS`, `2MP`). The download page says the licence is the GNU GPL with
the condition that the file is not altered and credit goes to the corpus. This
is a copyleft licence over a data file and the "unchanged" clause means we
could keep it as an external input but not ship a modified copy; the owner
should read it before we rely on it. I could not confirm size or format from the
page (my guess: plain text, tab-separated, a few MB), so I did not.

Alternatives found but not evaluated: MASAQ (a morphosyntactic dataset,
Creative Commons Attribution 3.0, from the paper cited at arxiv 2506.18148);
the Qatar University `qataruts/quran` repository, which says it builds on the
Corpus morphology. A third-party GitHub conversion of the Corpus exists in a
JSON-per-ayah form; I could not verify it.

Where it would live: not in the repo as a copy. A script under `scripts/`
would read a file kept outside git (for example `data/external/`, ignored) and
write per-ayah, per-word person and number into a small JSON checked in, one
file per surah or a single file of a few hundred kilobytes. Rows keyed by
surah:ayah:word match the `Pos` type already in `passages.ts`. The Corpus
indexes words in the Uthmani text while ours is the Hafs text of the API, so
the join needs a check: words may split differently (`وَٱلَّذِی` is one
word for us and two segments there). No download is made in this phase;
approval needed from the owner for: the Corpus file, its licence terms.

## Candidate list

Eleven, sorted by how sure I am that the shift is real and how a machine finds it.

| # | Where | Shift | Found by | Sure |
| --- | --- | --- | --- | --- |
| 1 | 43:22-23 | Same claim by two groups; last word changes | machine (repeat) | high |
| 2 | 1:2-5 | He becomes You | partly machine (`إِیَّاكَ`) | high |
| 3 | 12:80-83 | Speech becomes the message, then the reply | hand-picked | high |
| 4 | 48:8-9 | Singular address to plural address | machine with a morphology file | high |
| 5 | 43:36-38 | Number follows meaning, then returns | hand-picked | high, but mislabelled by the seed |
| 6 | 10:22 | You becomes They | machine with morphology | high |
| 7 | 35:9 | He becomes We | machine with morphology | high |
| 8 | 17:1 | He, We, He | machine with morphology | high |
| 9 | 36:20-22 | Speaker about self then to his people | hand-picked | medium |
| 10 | 55:13, 16 ... | Refrain | machine (repeat) | high |
| 11 | 26 (the line `إِنَّ فِی ذَ ٰ⁠لِكَ لَـَٔایَةࣰ` and `وَإِنَّ رَبَّكَ لَهُوَ ٱلۡعَزِیزُ ٱلرَّحِیمُ`) | Refrain after each story | machine (repeat) | medium: my simple substring test found nothing, so the spelling in the data differs from what I typed and I did not chase it |

Sources: al-Itqan (nau' 'al-iltifat', in the chapter on the rhetorical forms of
the Qur'an) and al-Burhan (al-nau' 'al-iltifat'). I quote from memory the
examples 1:5, 10:22, 35:9, 17:1 and 36:22; I did not open either book and the
numbering of the chapters is not something I checked. Treat the attribution as
a lead for the owner to confirm.

## Page ideas

Route: `/quran/shifts`. Arabic only, light and dark, usable at phone width,
written in the style of `/quran` (QuranDemo.tsx). Reused: `AyahCard` (word
marks), `Badge`, `Button` with an icon.

1. Ribbon per surah. One thin strip of cells, one per ayah, coloured by the
   dominant grammatical person and number (first, second, third; singular or
   plural). A change of colour is a shift. A surah picker above, an ayah list
   below that opens the ayah under the tapped cell.
   Needs: person and number per ayah. From letters alone a coarse version works
   from the standalone pronoun and suffix lists; the real one needs the
   morphology file. Cost: medium for coarse, medium plus the data step for real.
   Risk: coarse colours will be wrong often and look authoritative.
2. Shifts list. For a surah, rows of "ayah A / ayah B" side by side, with the
   changing words underlined by the `marks` prop of `AyahCard`, a `Badge` naming
   the kind (person, number, speaker, repeat). Start with the eleven above as a
   hand-authored file, then add machine rows once morphology exists.
   Needs: a small JSON of shifts (surah, ayah range, kind, marked word
   positions). Cost: small, and the quickest honest demo. Risk: it is a curated
   list rather than a discovery; say so on the page.
3. Repetition arcs inside a surah. Ayat along one axis, an arc between each pair
   that shares a run of at least four words; thickness for length. Same SVG
   as the arcs on `/quran`. Surah 26 and 55 would show their refrains as a
   comb; 43:22-23 as a single short arc.
   Needs: `passages.ts` made to accept one surah against itself, with a
   rule for dropping overlapping pairs. Cost: small to medium, no new data,
   fully machine-checkable. This is the only idea whose output I trust today.
4. Speaker timeline. A row of turns taken from `قَالَ` / `قَالُوا` / `قُلۡ`,
   each a block along the surah; nested quotes drawn as indented blocks (12:80-83
   would show the eldest's turn containing the brothers' message). Needs the
   speaker and the quote boundary; opener words give where a quote starts but
   not who speaks or where it ends. Cost: high unless hand-marked for a few
   surahs. Recommend as a later step.

Recommendation: build 3 and 2 together as the demo. 3 needs nothing we lack and
stays true to the "exact words" principle of the existing page. 2 carries the
owner's own examples and shows the idea at once. Add 1 only after the owner
approves the morphology download.

## Assumptions to attack

1. Within-surah repetition is a relation worth a page of its own, rather than a
   filter on the existing /quran page.
2. A hand-authored list of eleven shifts is an acceptable demo, even though the
   brief asks for discovery by scanning.
3. Hafs text only; shifts that exist in one reading (48:9) are valid examples
   when labelled with the reading.
4. Number of `مَن` (43:36-37) is a different device from iltifat and should have
   its own label.
5. 12:80-83 counts as one shift and should be shown as a four-ayah span rather
   than one pair.
6. Letters alone are too weak to give person and number; a coarse ribbon built
   from them would mislead more than help.
7. The Corpus morphology licence permits using the file as an input without
   redistributing a changed copy; checking this is the owner's job.
8. Words in our text and Corpus words can be joined by position with a small
   check, even where clitics split differently.
9. The 4-word minimum for a repeated run is right for within-surah pairs, where
   the cross-surah page uses `MIN_WORDS = 10`.
10. The classical attributions listed come from memory and are not verified;
    no citations are needed at this stage, but the page must not imply they are.
11. Surah 26's refrain is real in the data. My test found no match, so I have
    not shown it.

## Verdict after testing

A skeptic ran the plan against the real text. What the page builds:

1. Repetition arcs. A run seen exactly twice in one surah, of four words or
   more, in two different ayat. At that size surah 55 would draw 465 pairs, so
   anything seen three or more times leaves the arcs. The finder is
   `src/lib/quran/shifts.ts`. It counts exact repeats, which the fuzzy
   cross-surah finder in `passages.ts` does not, so `/quran` is untouched. It
   finds 43:22-23 (an eight-word clause).
2. Refrain lanes. A run seen three times or more, of four words or more, or of
   three words seen five times or more (77's «ويل يوميذ للمكذبين», ten times),
   becomes a lane of ticks. Surahs 55, 77 and 26 show it.
3. Speech-turn strip. One block per opener (قال, قالوا, قالت, قل), colored by
   verb form only. The speaker is named after the opener in a small share of
   cases, so the page draws no names. Surah 12 has 73 openers.
4. Curated shifts, moved to their own static page `/quran/iltifat`. Seven
   hand-picked entries in `curatedShifts.ts`, each shown as hand-picked and as a
   demo suggestion without citations: 43:22-23, 12:80-83, 1:2-7, 48:8-9 (Hafs
   reading), 10:22, 35:9, 17:1. 43:36-37 is left out: the divine We in 36 and 38
   and the هم in 37 cover both devils and people, so it is not an address shift.

There is no person and number ribbon. Surface forms give them right about 60%
of the time and the divine We merges with the human we. Revisit it only with
the morphology file, which waits on the owner.

Data: nothing new is stored. The page reads the chosen surah's ayat on each
request and finds the runs in a few milliseconds.

## Person colors on the curated page

The owner asked to see the iltifat inside the ayat, with one color per mode of
address on every example. The modes are غيبة (third person), تكلم (first
person) and خطاب (second person), on text slots 1-3 of `AyahCard`; slot 0,
amber, stays the color of a phrase repeated in two ayat (43:22-23).

- A mark is a phrase of normalized words in one ayah, with its mode. When the
  phrase occurs more than once in the ayah, the mark names a longer phrase that
  contains it and occurs once (`عليهم` inside `المغضوب عليهم`). A phrase that
  does not resolve exactly once is an error, and the unit test fails on it.
- Every word whose person is plain from its form is marked, in every ayah of
  a curated shift, so a plain word never reads as a different mode. A verb
  takes its subject's person (`أرسل`, `فسقناه`, `أرسلناك`, `يسيركم`, `يأتيني`),
  even when its object pronoun is another person. A noun or particle takes its
  attached pronoun (`أباكم`, `عليهم`, `حوله`), even when the pronoun points at
  a thing rather than a person. A noun with no pronoun is left plain
  (`الرياح`), and so are relative and demonstrative pronouns (`الذي`, `هذه`).
- Exceptions the owner chose: in Al-Fatiha the names of God in 2-4 (`لله رب`,
  `الرحمن الرحيم`, `ملك`) are marked غيبة, and `اهدنا` is marked تكلم for its
  `نا` although its subject is the One addressed.
- No mode for quoted speech. In 12:80-83 the three persons already show the
  turn: `أبيكم` (خطاب, the eldest to his brothers) becomes `أبانا` (تكلم, the
  brothers' own words), and `ابنك` addresses the father.

The page is static: `npm run quran:iltifat` writes the text of the curated
ayat to `src/app/quran/iltifat/ayat.json` from the stored Quran, and Next
prerenders the page from that file.
