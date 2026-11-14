# 0038. Compare cards draw with the branches tree

Compare and pair cards drew their tree with their own braid component, one in the app and one on the website. It had its own boxes and lines and no path tap. The branches tree was drawn by two more components, so the project had four tree renderers with two looks.

The owner chose (2026-11-14) one tree for every view. A `Branch` can now carry `rejoin`, the node where its children's paths meet again, and `via`, the ayat whose paths run through it. `compareTree` in `shared/quran/braid.ts` turns a card's two sides into such a tree. The sides share one box where they say the same words, get a box each where they part, and meet again on the next common stretch.

Both `BranchTree` components draw a rejoin as a second fan after the children, mirrored. They take `nodeContent` for a node's whole content, so the card keeps its own word colours, end marks and silent-part notes. A compare tree is drawn top down. On the website it fits and zooms like any tree, without the zoom buttons. Tapping a box lights its side's path.

The compare video still draws the matrix, so it did not change.
