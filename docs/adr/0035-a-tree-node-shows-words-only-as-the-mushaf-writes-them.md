# 0035. A tree node shows words only as the mushaf writes them

A branch tree groups words by letters, root and lemma, so one node can hold ayat that write a word differently: a different last vowel, a tanween drawn in another shape, a madd sign in one place. The node used to draw one blended word that kept only the marks every ayah shared. That word could be written in none of its ayat. In 2:161 and 3:87 the node showed the word with no last vowel, where one ayah has damma and the other fatha.

A node now draws a differing word once for each way its ayat write it, with the ayat that write it so. Ayat that agree share one line. When a path is lit, the node draws the lit ayah's own form alone, and an ayah-end sign that stood empty because its ayat carry different numbers shows that ayah's number. Grouping is unchanged, so no tree changes shape.

This holds for every difference, including marks that change only with the next letter. One rule is easier to check than a list of marks that may be dropped, and a test can state it for all trees: no drawn word is absent from its ayat.

`writtenForms` in `shared/quran/writtenForms.ts` decides what a node draws. The website and the app both draw from it.
