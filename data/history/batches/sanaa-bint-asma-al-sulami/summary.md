# سناء بنت أسماء بن الصلت السلمية — batch summary

## What the source says

The entry (سير أعلام النبلاء, Risalah edition, vol. 2 p. 256, Shamela
`book/10906/2236`) is one short paragraph. Abu Ubayd al-Qasim ibn Sallam
reports — citing Hafs ibn al-Nadr al-Sulami and Abd al-Qahir ibn al-Sari, a
third-hand chain the entry names but does not further corroborate — that the
Prophet صلى الله عليه وسلم married Sanaa bint Asma ibn al-Salt al-Sulamiyyah,
and that she died before the marriage was consummated. The entry closes with
an alternate identification: "وقيل: سناء بنت سفيان الكلابية."

## Legacy values visited

The catalog already carried this subject from the retired
`prisma/personSeedData10.ts` entry, uncited:

| Legacy value | Disposition |
|---|---|
| sex: FEMALE | Promoted to cited claim (`sanaa-bint-asma-al-sulami-siyar/sex`) |
| fullName: سناء بنت أسماء بن الصلت السلمية | Promoted to cited claim (`sanaa-bint-asma-al-sulami-siyar/full-name`) |
| titles: companion | Promoted to cited claim (`sanaa-bint-asma-al-sulami-siyar/companion`) |

## New values authored

- `DAUGHTER`/`FATHER` relation to a new graph-only person module,
  `asma-ibn-al-salt-al-sulami` (`hasProfile: false`, no attestation beyond
  being named as her father here) — `sanaa-bint-asma-al-sulami-siyar/father`.
- `WIFE`/`HUSBAND` relation to `prophet-muhammad`, marked `DISPUTED` rather
  than `ESTABLISHED`: the entry's own chain is third-hand ("زعم ... وزعم
  ..."), and the entry itself immediately offers a competing identification
  of the same candidate wife (see cross-reference below) —
  `sanaa-bint-asma-al-sulami-siyar/wife-of-prophet`. The assertion carries
  the detail that she died before the marriage was consummated; the model has
  no separate field for consummation, so this stays in the assertion text
  rather than a structured value.

## Absent from source

- kunya: none given
- appearance: none given
- manaqeb: none given (the entry is one paragraph, the marriage report and
  the alternate identification, nothing else)
- siblings: none mentioned

## Cross-reference: the entry's alternate identification points to a separate, later batch

The entry's closing line — "وَقِيْلَ: سَنَاءُ بنْتُ سُفْيَانَ الكِلاَبِيَّةُ" —
names a candidate identification that overlaps by name with the checklist's
next entry, الكلابية (line 166). That overlap was investigated separately and
resolved: **the two stay as separate batches**, not merged. The reason is not
that the name overlap was judged unimportant — it is that the two source
entries tell materially different stories about a candidate wife named (in
some form) الكلابية:

- This entry (سناء) reports she **died before the marriage was consummated**.
- The الكلابية entry (line 166) is a distinct, multi-candidate contested-identity
  narrative built around a story where the candidate **sought refuge from the
  Prophet صلى الله عليه وسلم on the wedding night** and was released — a
  different outcome entirely, not a restatement of this one.

A single "زعم ... سناء بنت سفيان الكلابية" clause is too thin to safely
collapse the two narratives into one person; recording the overlap here,
rather than merging the batches, keeps both source disagreements visible
instead of silently picking one.
