# Status: Tarajim batches 16 and 17 (paused 2026-11-18)

Paused by the coordinator (owner's cap of 10 parallel threads; batches 1–3 run first). Branch `claude/project-thread-frrjc6`,
built on PR #935's branch (#935 was still open); merge main once #935 lands, then re-run `npm run model:app-people`.

## Batch 16 (v6 entries 58–76, p387–430): converted, not yet in a PR
- 19 units under `units/siyar-v6-5x…7x-*.json`; scripts `/mnt/project-files/tarajim-app/conversion/batch16/`; summary `batch-16.md`.
- Code: `nasabOf` kunya rule, `shortName` for people with no catalog entry, virtue quiz name without the article, nasab test by whole words.
- `model:check` 27 units; `npx vitest run shared/ src/lib/model` passed before the Miswar change below.
- Second-agent review: launched on commit 38bc2097; its must-fix list is not applied yet (the result is in the thread).
- OPEN, must land before the PR: al-Miswar's name is kept as printed («… بن زهرة بن قصي بن كلاب», p390), but «زهرة بن قصي»
  is a printing slip (Zuhrah is the son of Kilab, Qusayy's brother). Coordinator's ruling: keep the span, mark the link as a
  known slip with a note and source, and have the tree (`shared/tarajimLine.ts`) and the nasab quiz skip it. Until then the
  nasab quiz says al-Miswar meets the Hashimis and al-Zubayr at «قصي», which is wrong.
- Still to do: screenshots of two pages (dark), PR ("Records used:"), merge.

## Batch 17 (v6 entries 77–95, p430–467): not started
- Store pages 431–467 are fetched (untracked, not committed). Pages 430–441 read; notes so far:
  - 77 Abdullah ibn Busr: kunya in heading; siblings Atiyyah and al-Samma' (p431); Cyprus (fath-cyprus); «لتبلغن قرناً» (Ahmad, hasan); death 88 + 94 years + «آخر من مات من الصحابة بالشام» (al-Waqidi), 96 (Abd al-Samad).
  - 78 Abu Inabah: heading is a kunya only (nasabOf/shortName must return «أبو عنبة», not «أبو»); Yarmuk; companionship contested (Ibn Ma'in for the people of Hims, al-Daraqutni, Shurahbil); «صلى القبلتين» would clash with Anas in the quiz.
  - Virtue quiz gives the answer away when the sayer is the owner («— أنس»): skip such virtues in `virtueQuestions`.
