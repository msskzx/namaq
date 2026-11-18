# Status: Tarajim batches 16 and 17 (paused 2026-11-18)

Paused by the coordinator (owner's cap of 10 parallel threads; batches 1–3 run first). Branch `claude/project-thread-frrjc6`,
built on PR #935's branch (#935 was still open); merge main once #935 lands, then re-run `npm run model:app-people`.

## Batch 16 (v6 entries 58–76, p387–430): converted, not yet in a PR
- 19 units under `units/siyar-v6-5x…7x-*.json`; scripts `/mnt/project-files/tarajim-app/conversion/batch16/`; summary `batch-16.md`.
- Code: `nasabOf` kunya rule, `shortName` for people with no catalog entry, virtue quiz name without the article, nasab test by whole words.
- `model:check` 27 units; `npx vitest run shared/ src/lib/model` passed before the Miswar change below.
- Second-agent review (on 8e1220f7): NOT READY. Must-fix, to apply on resume:
  1. Miswar slip: 6 nasab questions answer «قصي» (should be Kilab). Land the slip mark (tree + quiz skip «زهرة بن قصي») before any PR.
  2. Ibn Abi Awfa a_aw_v_dua: rest it on the Sahih wording (p429, Shu'bah ← Amr ibn Murrah: «فأتاه أبي بصدقة قومه، فقال: اللهم صل على آل أبي أوفى»), by Ibn Abi Awfa, not the author's paraphrase.
  3. «زوّج أمه» (Umar p407, Nasa'i sahih; Salamah p408, Ibn Ishaq): model both as virtues, attributed, status DISPUTED (disputed virtues are not asked).
  4. Contested companionship: DISPUTED COMPANION_OF for Maslamah (author, al-Bukhari, al-Daraqutni, Ibn Yunus vs Abu Hatim) and Busr («الصحابي», Ibn Yunus vs «وفي صحبته تردد»).
  5. Anas a_an_age107: voice REPORTED_ANONYMOUS «بعضهم» (al-Ansari only reports the disagreement).
  6. Generic virtues offer right wrong-choices: a_nb_v_sami, a_ss_v_dayyin → add a quiz skip list (or drop from the quiz).
  7. Prompts naming the owner: skip a virtue whose `by` is the owner (anas «— أنس», ibn abi awfa); namesOf misses «أنسا», «أنيس», «ابن أبي أوفى» (use shortName's father form).
  Should-fix: COMPANION_OF where «له صحبة»/«الصحابي» (9 people; Ibn Sarjis clearest); offices an-Nu'man قضاء دمشق and Amr ibn Hurayth (al-Waqidi) or a not-modeled note; Ibn Jaz' «سنة سبع» as anonymous 87 if the reader allows; Umar's mother rests only on «وقيل»; split Ibn al-Sa'ib «مقرئ مكة» from «عداده في صغار الصحابة»; Miswar death add «وكذا أرخه فيها جماعة»; shortName duplicates «عبد الله بن الحارث» with abdullah-ibn-al-harith-ibn-nawfal.
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
