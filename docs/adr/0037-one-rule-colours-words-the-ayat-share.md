# 0037. One rule colours words the ayat share

The tree, the matrix and the compare cards each decided on their own whether two words were the same. The tree drew a word its ayat write differently in amber ([0035](0035-a-tree-node-shows-words-only-as-the-mushaf-writes-them.md)). The matrix compared words after `spell` dropped some marks, and gave any other difference the root colour, so لَعْنَةُ in al-Baqarah 161 and لَعْنَةَ in Al Imran 87 were purple there and amber in the tree. The compare cards folded the engine's `letters` level into `exact`, so the same pair was terracotta there.

The owner chose (2026-11-14) one rule for every view, in `likeness` in `shared/quran/wordMatch.ts`:

- `exact`: the words are written alike, tatweel aside.
- `written`: the same letters after `normalizeWord`, written differently. This covers a case ending, the hamza of an alif (`normalizeWord` folds أ, إ, آ and ٱ, not ؤ or ئ), an idgham shadda and a tanween's shape, the marks 0035 already counts.
- `root`: shared by root or lemma only.

`sharedByAll` returns `written` beside `exact` and `rooted`, and each link carries its `kind`. Compare cards keep their stored marks and find written pairs when they draw, with `writtenLinks`, partners of a one-to-many card included, so `compareCards.js` is not regenerated.

The colours follow a setting, by kind (the default), one colour, or none. The app's `usePalette` puts them in `palette.marks`; the website sets `<html data-marks>`, which `theme.css` reads into `--mark-exact`, `--mark-written` and `--mark-root`. With none, a word keeps its text's colour.

The legend names each colour with the kind of difference al-Zarkashi gives in al-Burhan: «الإدغام وتركه» for written differently, «الجمع والإفراد» and «إبدال كلمة بأخرى» for a shared root, «الزيادة والنقصان» for a word only some ayat have. Labelling each difference on a card, with the books' own cases, is later work.
