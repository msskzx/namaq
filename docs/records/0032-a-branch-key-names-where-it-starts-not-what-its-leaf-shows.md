---
title: "A branch key names where it starts, not what its leaf shows"
summary: "Tree labels printed each branch's ayah key, so a leaf grown into the next ayah or surah showed text under the wrong ayah or surah name."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "Tree nodes are keyed by the ayah a branch starts in. Branches that grow past their ayah end (identical ayat, run-ons) carry words of the next ayah, sometimes of the next surah, yet the label printed only the key."
approach: "shownAyat(node, path) in shared/quran/branches.ts names the key and, when the node's words run past an ayah end, the end of the run (ayahEnds); ayatLabel prints «البقرة ٣–٤» or «الصافات ١٨٢ ثم ص ١», matching the ayah cards. Web tree, web quiz answers, app tree, app quiz rows and graded nodes all use it."
outcome: "solved"
conditions: "trees.json at 2026-11-14; thousands of node labels across the 1,056 trees named only the key while showing words of a later ayah, 3 kinds of surah crossing among them (37:182, 56:96, 69:52 and corpus-follow paths)."
evidence: "shared/quran/treeLabels.test.ts rebuilds every tree and checks each label against the Quran text read from the key to the named ayah (with the basmala before a new surah); src/app/quran/branches/page.test.tsx checks the reported tree."
implication: "A label for a node must come from the words the node shows, not from the id it is filed under. Check labels against the corpus text, not against the tree's own keys."
date: "2026-11-14"
topics: ["testing","text-matching"]
buildsOn: ["namaq/0005-checks-that-dont-rederive-pass-the-wrong-inputs"]
---

The owner saw «بسم الله الرحمن الرحيم ص والقرآن ذي الذكر» under «الصافات ١٨٢» on the الحمد لله رب العالمين tree. The tree was right: 37:182 and 1:2 are identical, so both grow into their next ayah until they split. The label was wrong: it printed the key, and the key is where the branch starts.

The same was true inside a surah (al-Fatiha 2's leaf reads ayah 3), which is why the data test found thousands of nodes, not one. The test reads the text from the corpus rather than from the tree, so it would also catch a label that names the wrong ayah inside the right surah.
