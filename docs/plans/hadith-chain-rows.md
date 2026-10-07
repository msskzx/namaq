# Isnad rows by Ibn Hajar's ṭabaqa

Status: demo built; the cited, stored version is not. Terms are in
[CONTEXT.md](../../CONTEXT.md) (Ṭabaqa, Narrator). It extends the isnad diagram
from [hadith-on-profiles.md](hadith-on-profiles.md).

## What the demo does

On `/hadith/muslim-jibril` and `/hadith/bukhari-jibril`, in the isnad view:

- Rows are Ibn Hajar's ṭabaqāt, with the collector on top and the Companions at
  the bottom, the way an isnad is read. Each row is labelled in the page's
  language.
- A person on both routes is one node (Kahmas, Yaḥyā ibn Yaʿmar).
- Each narrator sits under the person they report to. A narrator who reports
  from someone of the same ṭabaqa sits beside them, with an amber arrow:
  Yaḥyā beside ʿAbdullāh ibn Buraydah, and ʿUmar beside ʿAbdullāh ibn ʿUmar.
- A narrator with no ṭabaqa goes in a row of their own at the bottom. None is
  guessed.
- A unit with no ranks keeps the depth layout it had.

ʿAbdullāh ibn ʿUmar and ʿUmar are not links in the Muslim `chain`, because
`check.ts` requires every link to sit inside the printed isnad span and they
come later, in the story. The demo table adds them after Yaḥyā ibn Yaʿmar. The
model already records ʿUmar as the narrator of the embedded scene.

## Where the data is

`src/lib/model/tabaqa.ts` holds a hand-written table per unit, keyed by the
narrator's printed name without vowel marks, because the page reads a stored
copy of the view that carries no mention ids. `src/lib/model/isnadGraph.ts`
reads it, and `IsnadSvg.tsx` draws the rows. Tests are in
`src/lib/model/isnadGraph.test.ts`.

## Ranks and where they come from

From تقريب التهذيب, Dār al-Rashīd edition (Awwāma) on Shamela, book 8609; the
page and entry numbers are the edition's.

| Narrator | Entry no., page | ṭabaqa |
|---|---|---|
| زهير ابن حرب | 2042, 143 | 10 |
| وكيع ابن الجراح | 7414, 507 | 9 (من كبار التاسعة) |
| كهمس ابن الحسن | 5670, 388 | 5 |
| عبد الله ابن بريدة | 3227, 223 | 3 |
| يحيى ابن يعمر | 7678, 524 | 3 |
| عبيد الله ابن معاذ | 4341, 300 | 10 |
| معاذ ابن معاذ ابن نصر | 6740, 462 | 9 (من كبار التاسعة) |
| مسدد ابن مسرهد | 6598, 454 | 10 |
| إسماعيل ابن إبراهيم ابن مقسم | 416, 31 | 8 |
| يحيى ابن سعيد ابن حيان (أبو حيان التيمي) | 7555, 516 | 6 |
| أبو زرعة ابن عمرو ابن جرير | 8103, 566 | 3 |

Not taken from an entry:

- **Companions** (ʿUmar, ʿAbdullāh ibn ʿUmar, Abū Hurayra). Their entries give
  no number. They are ṭabaqa 1 on Ibn Hajar's scheme. The introduction page
  that defines it is not among the pages reachable on Shamela (the first page
  there already begins at the twelfth ṭabaqa), so the citation is still owed.
- **Muslim and al-Bukhārī.** Muslim's entry (6623, page 455) gives no ṭabaqa.
  The collector has its own top row, so neither is ranked.

## Not built (the stored version)

The demo table is not evidence. The version that is, in order:

1. An ADR: the ṭabaqa is a cited assertion from the *Taqrīb*, covers only
   people it ranks, and is never derived. Narrators become people, which
   widens the Companions-only rule in `AGENTS.md` and
   `docs/data-pipelines.md`.
2. A `tabaqa` predicate and a `RIJAL` genre in `src/lib/model/types.ts`, with
   `check.ts` rejecting a value outside 1 to 12 and requiring a `RIJAL_ENTRY`
   basis.
3. The *Taqrīb* entries for these narrators under
   `data/works/taqrib-al-tahdhib/units/`, with `name.full` and `tabaqa` only,
   and identifications through the sharḥ.
4. Replace the table in `tabaqa.ts` with those assertions and delete it.
5. Narrator catalog entries, with full name and ṭabaqa, so each node links to
   `/people/[slug]`; `NARRATED_FROM` edges between consecutive narrators; then
   `npm run graph:layout` (dry run first), since new nodes and edges shift every
   rank. The owner has deferred the layout run.

## Later

Small, after the demo:

1. **Narrator profiles.** Show full name and ṭabaqa at `/people/[slug]`.
   Nodes link there only where the model has an identification, and the
   narrators of the two hadith have none.
2. **Check the diagram** in light mode, with the English labels, and at phone
   width, where a wide diagram scales down and its text gets small.
3. **Show the source of a rank** on the page: a hover or footnote with the
   *Taqrīb* entry number.
4. **A component test** for `IsnadSvg`: row labels and same-row arrows.
5. **Cite ṭabaqa 1** for the Companions from the introduction page of the
   *Taqrīb*, and decide how Muslim, whose entry gives no ṭabaqa, is shown.
6. **Move ʿAbdullāh ibn ʿUmar and ʿUmar** out of the demo table and into the
   model, read from the embedded scene (`scenes[1].narrator` and the speaker of
   turn `o3`; `data/inferences/inf_o3.json` is still `REPORTED`).

## Decisions to keep

- A narrator is a person, with no separate table or flag.
- The graph links consecutive narrators with `NARRATED_FROM` (narrator to
  source), defaulting to off in the global graph's filters
  ([ADR 0007](../adr/0007-filters-choose-the-relationship-vocabulary.md)).
- No reliability grading, no inference of irsāl, and nothing marked reviewed.
