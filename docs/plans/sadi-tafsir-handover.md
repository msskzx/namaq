# Al-Sa'di tafsir handover

Incomplete draft, preserved at the owner's request on 2026-11-14. Do not merge in its current state. The shared accessor imports a generated JSON file that does not exist.

## Requested result

Long-pressing an ayah offers a book icon labelled التفسير and opens the existing preview sheet. Ship Al-Sa'di's تيسير الكريم الرحمن offline in one shared data file for Expo and web. The app supplies the style. Both light-theme sketches were approved. Keep the UI right-aligned, with Hafs for Quran text, Amiri for other text, and no statistics. Preserve book/page citations and Quranpedia attribution with the dump version. Al-Muyassar is excluded.

## Saved work

- `scripts/quran/buildTafsirSadi.ts` converts the official dump and deduplicates passages.
- `shared/quran/tafsirSadi.ts` provides shared accessors.
- `mobile/src/components/Reader.tsx` adds the action.
- `mobile/src/components/AyahPreviewSheet.tsx` adds the sheet content and credits.

Web integration, generated data, automated coverage and source-preservation verification remain unfinished.

## Independent review

Cross-review found that the converter includes unrelated trailing content supplied by the dump: Fatiha 1:1–7 includes the Baqarah introduction from page 40, and Fil 105:1 includes the Quraysh introduction from page 935. The sheet would display those introductions as tafsir for the selected ayah. This defect is deferred in this handover draft. Split or exclude unrelated selections with source-backed boundaries and regression tests before generating publishable data. No implementation changes were made after this review, so no second review cycle was run.

## Source and local inputs

The [official dump](https://api.quranpedia.net/dumps/tafsir-book-3.json.gz) is cached at `/private/tmp/quranpedia-sadi.json.gz`. Temporary files may disappear; download it again if absent. Its own version is **2026-08-10**. Metadata identifies book 3, مؤسسة الرسالة, first edition 1420/2000, editor عبد الرحمن بن معلا اللويحق. See the [dump licence](https://api.quranpedia.net/dumps/LICENSE.md).

The source has null page values for 104:1–9. The implementer compared that commentary with [book 3, part 1, page 934](https://quranpedia.net/book/3/1/934); the generator records that correction. Reconfirm the selection when validating the generated output. No independent legal public-domain determination was made during this work.

## Resume

1. Read current `AGENTS.md` and relevant `docs/records`. Fetch and integrate `origin/main`, preserving this draft. Both branches were updated through `6432a38d` when handed over.
2. Restore a working, supported Node runtime. During handover `/opt/homebrew/Cellar/node/22.5.1/bin/node` failed to load `libicui18n.74.dylib`. Earlier mobile installation completed with engine warnings; its log is `/private/tmp/sadi-mobile-install.log`. The old session ID is no longer active.
3. Review the converter, run it on the dump, and commit `shared/data/quran/tafsirSadi.json`. Prove complete ayah coverage, locators and preservation of source text and Quran spans. The earlier `tsx` attempt stopped before execution with an IPC `EPERM` error.
4. Complete the web action and sheet in `src/app/quran/read/`, following the approved mobile interaction. Audit Arabic/English labels, font use, accessibility and themes.
5. Add meaningful generator, shared-data, component and UI regression tests. Run lint, TypeScript, `npm test`, build, mobile typecheck and `npm run test:ui`. None has run successfully for this draft.
6. Resolve the draft's review findings, complete the required review cycle and mark ready only after all gates pass.

The topics branch is `codex/sourced-topics`. Its current change is data only, so there is no file overlap yet. If it later touches these reader files, rebase task 2 onto task 1 as requested. Keep both draft worktrees until handover is complete.

Records used: none
