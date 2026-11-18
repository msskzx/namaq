# Siyar batch 2 (v4 entries 16-37): paused

Paused 2026-11-18 at the owner's request (batch threads wait until the feature threads are done). Remove this file
before opening the PR.

Done on this branch:
- 21 units in `data/works/siyar-alam-al-nubala/units/siyar-v4-16-*` to `siyar-v4-37-*`; `npm run model:check` passes.
  Scripts: `/mnt/project-files/tarajim-app/conversion/batch2/`.
- Store pages: 241 added, 240 completed, 202/230/240 notes refetched.
- Batch summary with the classified diff: `data/works/siyar-alam-al-nubala/summary-batch2.md`.
- Second-agent review done; all must-fix items fixed (see the summary's last section).
- people.json regenerated, `npx vitest run shared/ src/lib/model` passed (1229).
- Dark screenshots: `/mnt/project-files/tarajim-app/conversion/batch2/screens/`.

Left to do when resumed:
1. Merge origin/main (PR #935 is merged; main now has batches 8 and 14 too). On a people.json conflict, re-run
   `npm run model:app-people`; do not edit it by hand.
2. Check `shared/data/tarajim/virtueQuizSkip.json` (from #935) against the batch 2 virtues, and re-read the generated
   nasab and virtue questions for the new people (guide check 4).
3. Re-run model:check and the vitest suite, push, open the PR (attribution header, "Records used:", screenshots),
   assign and request review from msskzx, merge when checks pass.
