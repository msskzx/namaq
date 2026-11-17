# Phone app code quality

Date: 2026-11-17. Revision reviewed: `fcc8e3a6`, main through #844. Initial inspection used `566cd02e`; #842 updated UI tests, #843 changed tree sign rendering, and #844 fixed reader gestures/top-bar placement. All were integrated before final validation. The old missing vertical-drag cancellation finding was removed because #844 fixes it. This PR changes only this report.

## Recommendation and scope

There are 27 open findings: 3 high, 18 medium and 6 low severity. Fix the offline audio and persistence failure paths before broad component refactoring. Preserve the existing shared tree, Quran text work, native screen wrappers and quiz UI. Coordinate UI duplication and recite-control findings with the effort already assigned to them; this report does not propose another design or implementation of those controls.

Evidence labels:

- **Checked**: read the cited code, counted files or ran the stated command/probe. A checked code path is not necessarily a reproduced native interaction.
- **Inferred**: a runtime consequence, performance cost or possible interleaving deduced from code, without a native reproduction.
- Suggested fixes and acceptance tests are proposals. No application code, data, settings, architectural guards or existing tests were changed.

Read [AGENTS.md](../../AGENTS.md), including the shared-components table and two-vote rule, [palette](../palette.md), the [records index](../records/README.md) and the relevant records listed below. Reviewed the mobile entry/navigation, storage/settings, audio/downloads, reader/pager, books, home/search, selected tree/matrix/video components, shared storage/search/recitation logic and their tests. This is a risk-led review, not a claim to have read every line of every shared module.

The inventory contains **220 TypeScript/TSX files under `mobile/src`, including 23 test files**. An AST scan of production mobile files found **0 explicit `any` type nodes and 137 `as` expressions**, including legitimate `as const` assertions. Most of the type concern is unchecked persisted/network values and implicit `any` from `JSON.parse`, not widespread explicit `any`.

No iPhone/Android render, audio session, pinch gesture, notification delivery or device memory measurement was performed. The executable probes below use actual source modules with mocked platform boundaries. Browser UI tests are not a substitute for those native checks.

## Correctness and offline risks, highest first

### Q01. A failed audio download can become a falsely successful offline pack

**Severity: high. Evidence: checked with a mocked filesystem/network reproduction; Android-specific partial-file behavior also checked in the installed Expo API documentation.**

Locations: [listenFiles.ts:124](../../mobile/src/lib/listenFiles.ts#L124), especially the existence check at line 128, failure handling at 138 and pack commit at 143; [listenFiles.ts:51](../../mobile/src/lib/listenFiles.ts#L51) returns any existing local file.

The worker catches a download failure but leaves its destination untouched. On retry, `file.exists` skips downloading and increments progress as if the file were complete. Expo FileSystem's installed `File.d.ts` documents that Android streams into the destination and may leave a partial file after failure; iOS uses a temporary download first. File existence is therefore not a portable completion check.

The probe made the first download create a partial file and reject, then allowed subsequent downloads to succeed. Retrying committed one pack while making **only one download call in total**. The stored bytes remained `partial`, and `localAyah` returned that file. This is a false offline guarantee, not merely a slow retry.

Suggested fix: use a temporary destination or a verified completion record per file, discard failed partials and install only completed files. Check every requested ayah before committing a pack. A missing sync row must be reported as unavailable, not silently removed from the queue while the committed pack still lists it. Test interruption, a zero-byte/partial existing file, missing rows, retry and offline playback. Apply the same completion policy to the sync replacement path.

### Q02. A failed sync replacement deletes good offline audio and postpones repair

**Severity: high. Evidence: checked with an executable mocked reproduction.**

Locations: [listenFiles.ts:83](../../mobile/src/lib/listenFiles.ts#L83), checkpoint save at 90, deletion at 93, ignored replacement error at 97, and the due check in [listenFiles.ts:169](../../mobile/src/lib/listenFiles.ts#L169). The shared due rule is [recitationSync.ts:80](../../shared/quran/recitationSync.ts#L80).

For a changed URL, sync saves the new token and `syncedAt`, deletes the old file, and catches a failed replacement download. A subsequent `syncPacks()` inside the next day skips this reciter as up to date. The UI still has its installed pack metadata.

The probe started with a good file, returned a changed URL and rejected the replacement. The file disappeared, the saved token became `new`, and an immediate second `syncPacks` made **no repair attempt**. Metadata freshness and file completeness are incorrectly represented by one checkpoint.

Suggested fix: track pending file repairs separately from a successful metadata sync. Repair missing/failed held files even when no new metadata sync is due. Stage changed-file replacement before switching it where the source policy permits, while handling explicit source withdrawal/deletion separately. Test successful metadata plus failed bytes, immediate offline relaunch, later retry and explicit removal. Do not simply retain a resource the source has withdrawn.

### Q03. User-data write failures are swallowed as success

**Severity: high. Evidence: checked code and a failing-storage reproduction.**

Locations: [shared/storage.ts:46](../../shared/storage.ts#L46), [mobile storage.ts:14](../../mobile/src/lib/storage.ts#L14), [settings.ts:21](../../mobile/src/lib/settings.ts#L21), and the note editor's local text state at [NoteSheet.tsx:28](../../mobile/src/components/NoteSheet.tsx#L28).

Both write helpers catch and discard storage errors. The settings store updates memory and notifies listeners regardless of persistence. `keyStore.write` notifies despite a failed write; its next read can return the old value. Screens cannot distinguish a saved note/setting from a failed write on a full or unavailable store. In an offline app with no login, the local copy matters.

A probe using the actual shared `keyStore` and an adapter whose `setItem` throws returned normally from `write`, then read the old empty value. This did not involve a database or modify real user data.

Suggested fix: return/propagate a write outcome, retain unsaved edits in memory, and expose a recoverable save failure through the existing UI. Do not silently roll an editor back. Test storage refusal, retry, successful recovery and relaunch. Keep the shared persistence contract consistent for notes, marks, bookmarks and settings rather than patching one screen's catch.

### Q04. Valid JSON with the wrong shape can crash a feature or bypass validation

**Severity: medium. Evidence: checked with two executable malformed-state probes.**

Locations: [storage.ts:5](../../mobile/src/lib/storage.ts#L5), [books.ts:16](../../mobile/src/lib/books.ts#L16), [listenFiles.ts:25](../../mobile/src/lib/listenFiles.ts#L25), [settings.ts:66](../../mobile/src/lib/settings.ts#L66), [soloStore.ts:12](../../mobile/src/lib/soloStore.ts#L12), and [Reader.tsx:94](../../mobile/src/components/Reader.tsx#L94).

`readJson<T>` only parses and casts. It does not establish `T`. Seeding `books-hidden` with `{}` made the actual books module throw `.filter is not a function` during module evaluation. The list-state predicate accepts `{query: '', filters: null}` because `typeof null === 'object'`; the actual settings module returned that value rather than `EMPTY_LIST`. Callers such as [branchList.ts:51](../../mobile/src/lib/branchList.ts#L51) expect a usable filter object. Audio manifests, saved quiz runs, reader places and zoom values also rely on typed reads without complete shape/range/version checks.

Suggested fix: add small explicit decoders at each persisted boundary, with schema/version migration and a recoverable default for invalid state. Reuse the existing boolean/theme/prayer validators in settings as precedent. Validate nested fields, finite numeric bounds and arrays, not just the outer object. Preserve or quarantine invalid user content where possible rather than wiping the entire store. Test valid JSON of the wrong type, partial older records and incompatible saved runs.

### Q05. Audio operations can overlap without a reciter-level transaction

**Severity: medium. Evidence: checked call paths; harmful interleavings are inferred, not native-reproduced.**

Locations: [listenFiles.ts:83](../../mobile/src/lib/listenFiles.ts#L83), [listenFiles.ts:102](../../mobile/src/lib/listenFiles.ts#L102), [listenFiles.ts:151](../../mobile/src/lib/listenFiles.ts#L151), and [ListenSheet.tsx:159](../../mobile/src/components/ListenSheet.tsx#L159), including delete-all at 162.

The busy key is `reciter:kind`, so whole-Quran, surah and memorized downloads for the same reciter may run together. Each can call `sync`, which reads a checkpoint before awaiting the network and later rewrites it. `syncPacks` is another entry. Workers can target the same ayah file. Delete-all removes committed packs but does not stop in-flight workers, so a running download can later add a pack again. `running` helps sweeping preserve active keys; it does not serialize writes or cancel work.

Suggested fix: serialize sync/file mutations per reciter and give each operation an identity/cancellation state. Define whether delete-all cancels outstanding downloads; the visible action should not be undone by a late completion. Test delayed concurrent sync replies, overlapping pack keys, delete during download and repeated stop/retry. Reuse existing per-pack progress UI; this does not require another downloader screen.

### Q06. Directory errors escape the audio download error handling

**Severity: medium. Evidence: checked code; failure on a real full disk was not run.**

Locations: [listenFiles.ts:118](../../mobile/src/lib/listenFiles.ts#L118), before the worker catch; caller [ListenSheet.tsx:55](../../mobile/src/components/ListenSheet.tsx#L55).

Creating the reciter directory is outside the catch used for sync and outside the worker catches. If that operation throws, `downloadPack` rejects, `running`/`busy` remain set, and the event handler does not handle the rejected promise. The progress row can remain downloading instead of failed. Q01 concerns corrupt completion; this is a separate uncaught setup failure in the same operation.

Suggested fix: put operation setup, worker execution and cleanup under one `try/catch/finally`, preserving stopped versus failed versus completed states. Handle the returned promise at the UI boundary. Test directory creation failure and cleanup of the progress state, not only network rejection.

### Q07. Playback state does not model load or playback failure

**Severity: medium. Evidence: checked code; native failure presentation is inferred.**

Locations: [listen.ts:38](../../mobile/src/lib/listen.ts#L38), [listen.ts:46](../../mobile/src/lib/listen.ts#L46), [listen.ts:62](../../mobile/src/lib/listen.ts#L62), and [ListenBar.tsx:33](../../mobile/src/components/ListenBar.tsx#L33).

The status callback handles only `didJustFinish`; the public state is primarily `playing`/`quiet`. `go` requests replace/play and immediately emits `playing: true`. A missing local file, failed stream or unsupported audio source has no corresponding visible loading/error/retry state. The current `loaded === state.key` guard also identifies only an ayah, not a reciter/load revision. It does not prove an old completion event cannot advance a new load of that same ayah.

Suggested fix: represent loading, ready, paused and failed states from the actual player API. Bind completion to the current load and consume it once. Keep the intentionally app-wide player outside page mounts. Test failed stream/offline file, stale completion after reciter change, repeats of one ayah, interruptions and background resume. The latter cases need native checks, not only a mocked status object.

### Q08. Debounced personal state has no app-background flush

**Severity: medium. Evidence: checked debounce/cleanup code; loss at OS suspension is inferred.**

Locations: [soloStore.ts:18](../../mobile/src/lib/soloStore.ts#L18), write delay at 24, and [NoteSheet.tsx:19](../../mobile/src/components/NoteSheet.tsx#L19), edit at 28. The note editor flushes on closing/unmounting; this is already better than a timer alone.

Quiz state waits 400 ms before writing. Notes also use a pending timeout. Neither module registers an AppState transition to flush pending personal state. Backgrounding an app does not guarantee a component unmount or another JS timer tick before process termination. The last input can therefore remain memory-only. This is separate from Q03's storage refusal after a write is attempted.

Suggested fix: expose a flush operation and call it on app inactivity/background as well as appropriate close/unmount events. Flush an old note before changing its target. Keep write coalescing during typing. Test typing followed immediately by background/close, editing two targets, and restoring the last committed quiz state. Do not write the whole run synchronously on every keystroke.

### Q09. The reused reader pager lacks explicit host gesture capabilities

**Severity: medium. Evidence: checked gesture configuration; conflict on a device is inferred.**

Locations: [ReaderPager.tsx:79](../../mobile/src/components/ReaderPager.tsx#L79), [book.tsx:156](../../mobile/src/screens/book.tsx#L156), and [stackOptions.ts:20](../../mobile/src/lib/stackOptions.ts#L20).

Tree/matrix pagers use `BACK_EDGE_SLOP` to leave the iOS right edge to native navigation. ReaderPager's horizontal pan has no such exclusion. This also affects its reuse inside the pushed book screen, which does have a native back destination. The root mushaf tab is a different navigation context; it is not evidence that every reader swipe needs to go back.

The book host also passes `zoom={1}` and `onZoom={() => {}}`, while [ReaderPager.tsx:112](../../mobile/src/components/ReaderPager.tsx#L112) still enables pinch. A pinch that settles above 1 calls the no-op callback. Its preview is reset when `zoom` changes or when the pinch settles at the existing zoom; neither happens in that path. The code therefore leaves a scale preview set for a host that does not implement zoom. The native visual consequence was not rendered here.

Suggested fix: disable pinch for hosts without zoom support, or restore the preview explicitly when a requested zoom is not accepted. Also make the pager's edge policy explicit for its host and apply the existing native-stack convention to pushed readers. Verify right-edge back, interior page turns, enlarged-page vertical scroll and pinch together on iOS. Preserve Android system back. Do not introduce a global full-screen back gesture that takes card swipes away.

### Q10. Derived book cache invalidation depends on a mounted reader observing removal

**Severity: medium. Evidence: checked cache ownership; the remove/reinstall sequence is inferred from it.**

Locations: [readerBook.ts:12](../../mobile/src/lib/readerBook.ts#L12), cache hit at 22, hook eviction at 39, and [books.ts:78](../../mobile/src/lib/books.ts#L78).

The decoded-book cache `made` lives outside React, but only `useReaderBook`'s effect clears it when `on` becomes false. If a reader is unmounted while a book is removed and downloaded again, that hook need not observe the off state. On the next open, `made.get(id)` can return the previous book without reading the replacement file. Raw `loaded` and derived `made` have different owners and invalidation rules. Deleted downloaded text can also remain retained in the derived map.

Suggested fix: invalidate both representations at the book install/remove/version boundary, independently of screen lifetime, and key them by content revision. Test open, unmount, remove, install different content under the same ID, reopen; verify text, page offsets and released references. Keep native file I/O outside shared code, but share pure revision/decoder logic where both platforms need it.

### Q11. A downloaded book's schema and page mapping are not version-checked

**Severity: medium. Evidence: checked code; a specific live bad download was not observed.**

Locations: [books.ts:40](../../mobile/src/lib/books.ts#L40), [books.ts:65](../../mobile/src/lib/books.ts#L65), [books.ts:93](../../mobile/src/lib/books.ts#L93), and [readerBook.ts:13](../../mobile/src/lib/readerBook.ts#L13).

A new download only has to expose an `entries` array. A later disk read uses a generic cast without the same validation. The reader applies bundled page breaks to downloaded text and filters out offsets that exceed entry length; equal-length changed text can still accept the wrong offset. The comment acknowledges different builds but there is no explicit revision compatibility check. Source navigation can become misleading even when JSON parses.

Suggested fix: validate each book's actual schema and pair content with its page-break revision/hash. Preserve the current incomplete-download rejection, add atomic installation, and show an explicit incompatible/damaged state rather than silently discarding page breaks. Test malformed entries, changed text with unchanged length, truncated books and incompatible revisions. Reuse the existing books manager, not a second per-feature fetch/cache layer.

### Q12. Video requests and native share errors are not tied to one request lifecycle

**Severity: medium. Evidence: checked code; late-message race is inferred.**

Locations: [VideoSheet.tsx:26](../../mobile/src/components/VideoSheet.tsx#L26), unvalidated message at 33, share action at 57, [VideoFrame.tsx:8](../../mobile/src/components/VideoFrame.tsx#L8), and [shareVideo.ts:18](../../mobile/src/lib/shareVideo.ts#L18).

The font promise and recorder messages have no request/generation check. Input changes reset video state, but an old async result or an old recorder's final message can still update that state. Parsed message fields are implicitly `any` and can be accepted without checking data/mime. The share handler discards the promise while file creation/write/share can reject. This is an error/state issue, not evidence of an externally exploitable WebView attack.

Suggested fix: associate font loading, recorder completion and share results with a request ID; cancel or ignore obsolete work. Validate the small message union, handle native file/share errors in the existing sheet, and release obsolete video payloads. Test close/reopen during font load, switching input before completion, malformed messages and rejected share operations.

## Architecture, loading and performance

### Q13. Background warming eventually imports every registered screen, including tooling

**Severity: medium. Evidence: checked import/scheduling paths; device stalls are inferred.**

Locations: [lazyScreen.ts:15](../../mobile/src/lib/lazyScreen.ts#L15), [lazyScreen.ts:25](../../mobile/src/lib/lazyScreen.ts#L25), [AppShell.tsx:24](../../mobile/src/components/AppShell.tsx#L24), [tree-sizes route:4](../../mobile/src/app/tree-sizes.tsx#L4), and [tree-sizes screen:1](../../mobile/src/screens/tree-sizes.tsx#L1).

The loading-screen split and lazy wrappers are useful and already implemented. However, every `lazyScreen` call joins the warm queue; 1.5 seconds after home mounts, all queued screens are synchronously required one at a time, 120 ms apart. This includes the tree-size measurement tool and book/search modules. The gap yields between requires; it cannot interrupt an expensive require itself. `made`, data indices and module-level imports can remain resident afterwards. Warming a screen does not mount it, so it does not itself run its hook effects or draw the debug trees.

Suggested fix: keep the existing wrapper and make warming selective, excluding developer tooling and expensive optional features. Measure current release first-frame/first-home/first-feature timings and memory before choosing what to warm. Move a URL constant such as `WEBSITE` out of [branches.ts](../../mobile/src/lib/branches.ts) so downloads do not need that feature's import graph. Do not quote old bundle/Node timings as current native measurements. R0038 documents the exact import-chain failure to avoid.

### Q14. A supposedly page-lazy lookup eagerly reads all 604 mushaf pages

**Severity: medium. Evidence: checked implementation and measured source bytes; timing impact is inferred.**

Locations: [mushaf.ts:5](../../mobile/src/lib/mushaf.ts#L5), [mushaf.ts:27](../../mobile/src/lib/mushaf.ts#L27), [mushaf.ts:33](../../mobile/src/lib/mushaf.ts#L33), and cache at 9.

`pageData` is lazy individually, but the first `pageOfAyah` or `firstAyahOfPage` constructs its map with `Array.from(...pageData...)` for all 604 pages. That path fills the page cache and retains the mapping. It is used by navigation, sharing and audio-follow behavior. The page files total **1,623,681 raw bytes**, before JS objects and layout models. Thus “only a few pages loaded” is not a valid general statement about a reader session after one ayah lookup.

Suggested fix: use a compact derived ayah-to-page index from the same canonical page data, or incrementally build it without pulling every page through the runtime cache. Do not create another stored copy of Quran text. Test all ayah/page lookups against the canonical pages and measure retained memory after first navigation. This is an index proposal, not a new Quran renderer or an architectural guard.

### Q15. Home feed growth retains many fully mounted cards

**Severity: medium. Evidence: checked mounting structure and cap; memory/FPS cost is inferred.**

Locations: [home index:55](../../mobile/src/app/(tabs)/(home)/index.tsx#L55), [HomeFeed.tsx:465](../../mobile/src/components/HomeFeed.tsx#L465), posts loop at 495, and [feedSeen.ts:30](../../shared/feedSeen.ts#L30).

The outer home is a ScrollView. The feed grows to `FEED_AHEAD = 60` batches and constructs all previous posts as React nodes, including tree/matrix/story/quiz components. It is bounded, not infinite, but can retain many costly card subtrees and their local state. `memo` avoids some renders; it does not virtualize mounting or release off-screen layout/data.

Suggested fix: represent the feed as stable item descriptors and virtualize through the existing platform list facilities, preserving visit order, stable IDs, saved-card snapshots and quiz answers. Test scrolling away/back without lost state, refresh, near-end loading and nested card swipes. Measure peak memory and frame timing on a low-memory phone before setting the retained window.

### Q16. Search builds duplicate indices and runs synchronously on the JS thread

**Severity: medium. Evidence: checked code; visible keyboard stalls are inferred.**

Locations: [ReaderSheets.tsx:25](../../mobile/src/components/ReaderSheets.tsx#L25), [searchSources.ts:25](../../shared/quran/searchSources.ts#L25), tree search at 54, and [search screen:147](../../mobile/src/screens/search.tsx#L147).

Reader search and the shared all-app search each own an `IndexedAyah[]` cache built with `indexAyat` over the same corpus. The global search debounces 150 ms, but `searchApp` is still synchronous inside that timer. `warmSearch` likewise delays a synchronous full index build; it does not run off-thread. Expanded groups are rendered inside a ScrollView, up to 100 hits per group. Those bounds are good, but do not establish smooth typing or scrolling.

Suggested fix: share the pure corpus-index provider used by both search entry points, preserving query/result semantics. Measure indexing and worst-case multi-group queries on Hermes. Precompute compact metadata or chunk work where measurements justify it; use existing list virtualization for expanded results. Keep stale-query/cancellation behavior explicit if search becomes asynchronous. Tests must cover both search entry points, Arabic normalization, ranking and result navigation, not just index existence.

### Q17. Large components combine interaction state, persistence and rendering

**Severity: medium. Evidence: checked responsibilities and line counts; maintenance risk is inferred.**

Locations: [Reader.tsx:90](../../mobile/src/components/Reader.tsx#L90), [HomeFeed.tsx:308](../../mobile/src/components/HomeFeed.tsx#L308), [TreePager.tsx:171](../../mobile/src/components/TreePager.tsx#L171), and [book.tsx:60](../../mobile/src/screens/book.tsx#L60).

Reader is 505 lines and owns restored position, recite/write state, selection/actions, audio following, zoom/scroll anchoring and several sheets. HomeFeed is 512 lines and mixes data selection, quiz initialization and several post renderers. TreePager is 385 lines and combines pagination, studio ownership, persistence, connectors and video/share orchestration. Book is 341 lines with reader, source navigation and search. Size alone is not a defect; the difficult part is testing transitions across these responsibilities while many effects suppress dependency linting.

Suggested fix: after the concrete bugs above, extract one behavior at a time into focused hooks and pure transitions. Begin with reader restore/intent/follow transitions and download/book lifecycle ownership. Pure filter/date/quiz/text decisions belong in `shared/` when both clients need them; React hooks, native gestures/files and layout measurements stay platform-specific. Do not move whole screens into shared or introduce a new state library solely to reduce line counts. Coordinate recite-control extraction with its current owner.

### Q18. Video export holds several full-size copies of a recording

**Severity: medium. Evidence: checked encoding/bridge path; device OOM is inferred.**

Locations: [scene.ts:422](../../mobile/src/lib/scene.ts#L422), [VideoSheet.tsx:22](../../mobile/src/components/VideoSheet.tsx#L22), [VideoFrame.tsx:11](../../mobile/src/components/VideoFrame.tsx#L11), and [shareVideo.ts:18](../../mobile/src/lib/shareVideo.ts#L18).

The recorder accumulates chunks, creates a Blob and converts it to a data URL, then sends base64 through the WebView bridge into React state and writes it back to a native file. Base64 expands the binary representation and can coexist with the original chunks/blob, font-inlined HTML and native copies. This is a measurable design cost, not proof that every export exceeds memory. Existing page-video partitioning must be retained.

Suggested fix: profile peak memory for the longest supported export and preserve bounded recording parts. Prefer a supported file/stream transfer where the platform permits it; otherwise cap retained payloads and release previous recordings promptly. Test cancel/restart and consecutive parts. Do not redesign the shared tree/video painters under this audit or confuse a string-content test with a successful encoded video.

## Duplication and drift, with the existing UI effort noted

### Q19. Ordinary icon buttons and top bars have several contracts

**Severity: low. Evidence: checked code and styles; overlap with the current UI inventory.**

Locations: [Button.tsx:21](../../mobile/src/components/Button.tsx#L21), private [Reader.tsx:79](../../mobile/src/components/Reader.tsx#L79), [Studio.tsx:9](../../mobile/src/components/Studio.tsx#L9), [BackBar.tsx:14](../../mobile/src/components/BackBar.tsx#L14), and [TopBar.tsx:28](../../mobile/src/components/TopBar.tsx#L28).

The standard Button supplies minimum dimensions, variants and pressed/disabled styling. Reader's icon button has a circular selected fill and opacity-based disabled state; Studio's has padding-only geometry and `pressed` for selection. BackBar draws an opaque ruled 52-pixel header with its own back control; TopBar owns blur, hide-on-scroll and hub/back variants. These are concrete contract/style differences, not proof that every bar should look identical. `ActButton` has a deliberate icon-over-name menu role and should not be flattened into an ordinary action just because both use Pressable.

Suggested fix: add these callers and their actual states to the existing inventory and use its agreed components. Preserve context-specific behavior. Do not start another button/bar redesign or duplicate the ongoing recite-control merge. A visual change needs the owner's agreed reference and accessibility/pressed/disabled checks.

### Q20. Repeated settings/download rows have local async-state conventions

**Severity: low. Evidence: checked code; overlap with the UI inventory.**

Locations: [SettingsSheet.tsx:39](../../mobile/src/components/SettingsSheet.tsx#L39), [ListenSheet.tsx:49](../../mobile/src/components/ListenSheet.tsx#L49), and [Books.tsx:11](../../mobile/src/components/Books.tsx#L11).

Settings links/tour rows and audio/book rows each compose icon, label, description, pressable area and busy/selected affordances locally. Audio reports progress/failure, books use their own on/off/downloading/failed contract, and ordinary settings use shared Toggle. The duplicate concern is row composition and async feedback consistency; different operations do need different state machines. Most feature sheets already compose [Sheet.tsx](../../mobile/src/components/Sheet.tsx), so they are not all independent modal implementations. Full-screen image/video sharing is a different presentation.

Suggested fix: give these facts to the assigned UI effort. Reuse its row/sheet contracts once agreed, without replacing proven download/persistence behavior. Keep failure states and labels accessible. This report's Q01–Q12 can be fixed underneath that work without redesigning its controls.

### Q21. Quran font/conversion bypasses remain known pipeline debt

**Severity: medium. Evidence: checked against the existing guard baseline, not a claim of a new regression.**

Locations: [AyahShare.tsx:16](../../mobile/src/components/AyahShare.tsx#L16), [NoteSheet.tsx:52](../../mobile/src/components/NoteSheet.tsx#L52), [quranText.ts:1](../../mobile/src/lib/quranText.ts#L1), and [search.tsx](../../mobile/src/screens/search.tsx). Existing authority: [oneQuranText.test.ts](../../shared/quran/oneQuranText.test.ts) and [baseline](../../shared/quran/oneQuranText.baseline.json).

The baseline still records mobile components that set Quran fonts or convert words outside the intended Quran text entry. They are existing tracked exceptions. Direct text rendering makes signs, number medallions, spacing and word-position mapping harder to keep consistent across ayah cards, notes, search and sharing. This audit did not prove a new textual omission in each listed component. The shared tree rule is already guarded separately; it should not be replaced with another tree implementation.

Suggested fix: finish migration through the **already agreed** Quran module at its appropriate page/ayah/copied level and shrink existing exceptions as each caller moves. Coordinate with the Quran text and UI efforts. Do not enlarge the baseline to make a new bypass pass, and do not treat this audit as approval for a new renderer or guard.

### Q22. Pure display helpers and search decisions remain in multiple client locations

**Severity: low. Evidence: checked duplicate definitions; drift risk is inferred.**

Locations: [ListenBar.tsx:16](../../mobile/src/components/ListenBar.tsx#L16), [listen.ts:32](../../mobile/src/lib/listen.ts#L32), web [ListenBar.tsx:17](../../src/app/quran/read/ListenBar.tsx#L17), and the index caches in Q16.

Surah/ayah and range naming is rebuilt in the playback module and both bars. Platform playback APIs legitimately differ, while the label/order/range decisions are pure. Similar candidates for shared ownership include the filter-draft transformations in [branchList.ts:71](../../mobile/src/lib/branchList.ts#L71). Do not move these merely because they are in `lib`; first establish that a second client needs the exact same policy.

Suggested fix: reuse existing shared number/name/recitation utilities and extract only a duplicated pure decision whose callers can consume one contract. Test labels across surah boundaries, Arabic numerals and empty/invalid references. Leave native player, React state and navigation adapters outside shared. Recite UI consolidation remains with its current owner.

## Types and tests

### Q23. Critical native adapters have little executable behavior coverage

**Severity: medium. Evidence: checked test inventory and configuration.**

Locations: [vitest.config.mts:11](../../vitest.config.mts#L11), [mobile tsconfig:11](../../mobile/tsconfig.json#L11), [listenFiles.ts](../../mobile/src/lib/listenFiles.ts), [listen.ts](../../mobile/src/lib/listen.ts), [books.ts](../../mobile/src/lib/books.ts), [usePageTouch.ts](../../mobile/src/lib/usePageTouch.ts), and [useWriteBoxes.tsx:14](../../mobile/src/lib/useWriteBoxes.tsx#L14).

The 23 mobile test files exercise useful pure logic, including compare, growth, search and tree sizes. No colocated tests were found for the native download/storage/player lifecycle modules above or native React components. Root Vitest aliases `@/` to website `src`, not mobile `src`, so simply adding a mobile hook test without a proper project/adapter setup can import the wrong module. The mobile tsconfig excludes `*.test.ts`; a separate pure-lib config exists. That separation is intentional, but it means native typecheck is not proof that all tests typecheck under mobile aliases.

Suggested fix: establish a small correctly aliased native-adapter test setup, with explicit filesystem/audio/AppState doubles and deferred promises. Add the Q01–Q12 behavior cases in their fix PRs. Test timer cleanup in `useWriteBoxes`, which schedules focus without cancelling its 50 ms timer. Keep the pure tests and strict app typecheck. Avoid a mock that reimplements the algorithm it is meant to verify.

### Q24. Some video tests prove generated strings, not recording behavior

**Severity: low. Evidence: checked tests.**

Locations: [scene.test.ts:36](../../mobile/src/lib/scene.test.ts#L36), especially `function outro(` and pause-string assertions at 38/46; corresponding recorder [scene.ts:422](../../mobile/src/lib/scene.ts#L422).

Checking embedded branding/escaping is useful. Asserting a function's spelling or that a pause branch appears in HTML does not prove pause/resume, completion, Blob output or an error message works. A recorder can retain those strings while its state machine fails.

Suggested fix: keep the escaping/branding assertions, replace function-name checks with behavior where practical, and add a bounded recorder smoke case that exercises start/pause/resume/finish/error. Validate output MIME and a playable/nonempty artifact on supported platforms. Do not delete useful tests merely because they inspect generated text.

### Q25. Browser UI coverage cannot certify native gestures, and retries can hide lost presses

**Severity: medium. Evidence: checked test configuration and helpers; no flakiness rate measured.**

Locations: [e2e config:17](../../e2e/playwright.config.ts#L17), [mushaf.spec.ts:11](../../e2e/app/mushaf.spec.ts#L11), [books.spec.ts:24](../../e2e/app/books.spec.ts#L24), and [fixtures.ts:61](../../e2e/app/fixtures.ts#L61).

The app UI suite runs an **Expo web export in Chromium**, using localStorage and browser behavior. It does not run SQLite, native audio/files, native stack swipes or iOS text rasterization. Some long-press tests repeat the input inside `toPass` until the toolbar appears; comments explicitly say a press during layout can be lost. Such a test proves eventual success after retries, not that the first real press works. A delay used to hold a long press is intentional and is not itself evidence of a flaky sleep. #842's matrix/default quiz updates were integrated; those existing fixes are not reported as missing.

Suggested fix: keep the web suite for web-export behavior. Wait for a meaningful layout-ready condition, perform one deliberate press, and assert its result for gesture reliability cases. Add native release smoke coverage for pinch/reflow/scroll, book edge-back, interrupted downloads and background audio/state. Describe retries and platform coverage honestly; do not claim measured flakiness without repeated runs. R0045 explains why sharp browser screenshots previously missed iPhone blur.

## Dead code and consistency

### Q26. A small set of exports has no production callers

**Severity: low. Evidence: checked repository reference searches; deletion remains a proposal.**

Locations:

| Export | Location | Reference result |
| --- | --- | --- |
| `Shelf` | [HomeCards.tsx:67](../../mobile/src/components/HomeCards.tsx#L67) | No production caller found |
| `GestureSheet` | [ReaderSheets.tsx:212](../../mobile/src/components/ReaderSheets.tsx#L212) | No production caller found; the underlying GestureSettings is still used |
| `booksOn` | [books.ts:37](../../mobile/src/lib/books.ts#L37) | No production caller found |
| `nodeKeys` | [growth.ts:111](../../mobile/src/lib/growth.ts#L111) | No import/call of this export found; other local variables share the name |
| Native `stepAyah` | [listen.ts:106](../../mobile/src/lib/listen.ts#L106) | No mobile caller found; the separate website export is a different symbol |
| `compareTargetFor` | [compare.ts:174](../../mobile/src/lib/compare.ts#L174) | Referenced by a test, but no production caller found |

Suggested fix: confirm against the UI/recite branch before removing unused exports and their exclusive imports/tests. Remove `compareTargetFor`'s test if its unused wrapper is removed, retaining tests of the live multi-target function. Do not call an entire file dead when it also exports active code. No unused persisted setting or large dataset was proven safe to delete in this review. The unlinked tree-size route is a real measurement tool used by scripts, not dead data; Q13 concerns warming it in the public app.

### Q27. Palette ownership and hard-coded UI language need an explicit mobile policy

**Severity: low. Evidence: checked definitions/strings; future cross-client drift is inferred.**

Locations: [theme.ts:9](../../mobile/src/lib/theme.ts#L9), website [theme.css](../../src/app/theme.css), [Utilities.tsx:268](../../mobile/src/components/Utilities.tsx#L268), [Utilities.tsx:300](../../mobile/src/components/Utilities.tsx#L300), [SettingsSheet.tsx:20](../../mobile/src/components/SettingsSheet.tsx#L20), and [search.tsx:164](../../mobile/src/screens/search.tsx#L164).

The native palette repeats CSS values in TypeScript. This is a separate platform representation, not evidence that the current word-match colors are wrong. Kaaba artwork uses literal ink/gold colors outside palette tokens. Black shadows and translucent dimming elsewhere are compositing values and should not automatically be treated as forbidden semantic colors. Most reviewed UI labels are Arabic literals; the native app has no equivalent general language switch in these paths, despite AGENTS describing a bilingual product.

Suggested fix: agree whether mobile currently promises English UI before a broad translation task. Reuse existing shared labels where they exist, keep classical quotations unchanged and centralize new reusable UI strings. Give intentional artwork colors a named home if they are meant to track themes. If palette values change, review both platform representations together. Do not mass-rewrite inline layout objects into a style framework or alter the established paper theme during these bug fixes.

## Existing strengths and findings not treated as bugs

- **Checked:** strict mobile TypeScript passes after installing its current lockfile. Zero explicit production `any` nodes were found. Generated static JSON assertions are not all runtime defects; focus validation on persisted/network boundaries and production data checks.
- **Checked:** the shared tree builder/platform BranchTree and existing one-tree guard are present. The Quran module/baseline is an existing migration, not grounds to build another renderer.
- **Checked:** root layout draws the loading screen before requiring AppShell, route wrappers defer screen code, and settings no longer imports branch inventory for its empty-list constant. Q13 concerns later warming and retained work, not a claim that the earlier R0038 fix is absent.
- **Checked:** #844 adds the native scroll gesture, pinch coordination and `onScrollBeginDrag` cancellation. The previously identified missing vertical-drag cancellation is resolved in code. [R0058](../records/R0058-a-pinch-inside-react-natives-scroll-view-loses-to-the-scroll.md) leaves the native outcome open until the owner confirms it on a phone. This report does not re-propose the merged fix.
- **Checked:** ReaderPager keeps three page views rather than mounting all 604. Zoom commits to font reflow and uses a temporary transform only during the pinch. Do not “fix” it by restoring image-like permanent scaling.
- **Checked:** shared prayer calculations, recitation stepping/sync transformations, quiz grading and Arabic search already exist. Reuse them. Keyboard subscriptions, `useHeading`, `usePageTouch`, IrabSheet and Kashshaf async reads have meaningful cleanup/live-result checks.
- **Checked:** `startAlerts` is guarded as an app-lifetime singleton. Its permanent subscriptions are not a repeatedly added effect leak. The player is also intentionally global so page turns do not stop audio. A future explicit teardown for tests is different from stopping them on every screen unmount.
- **Checked:** shared settings validate several values already; source/book metadata and local data are not evidence of a login requirement. This report proposes no login, cloud sync, new state framework or replacement UI system.

## Reproduction and verification

Temporary probes lived outside the repository and used the actual modules with mocked React subscription hooks, native filesystem, device storage and fetch. They did not download real recitations, corrupt installed books, change app code or contact a database. Results:

```text
partial audio retry:
  first attempt failed
  retry committed one pack
  total download calls remained 1
  retained bytes were the partial file; localAyah returned it

failed changed-file sync:
  old good file removed; replacement rejected
  new token and syncedAt saved
  immediate syncPacks made no additional download attempt

malformed persisted state:
  books-hidden = {} -> .filter is not a function
  branches-list = {query: '', filters: null} -> accepted by the setting predicate

failing shared storage adapter:
  write returned without error; readBack remained []; nothing persisted
```

The partial-file scenario follows Android behavior documented by the installed Expo FileSystem version; it is not a claim that iOS leaves partial downloads in the same way. The other mocks establish the JS control flow, not native API performance or callback timing.

Measured raw source sizes at the reviewed revision:

| File/data | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| `shared/data/quran/trees.json` | 6,441,156 | 1,255,490 |
| `shared/data/quran/mutashabih.json` | 3,446,512 | 329,086 |
| `shared/data/quran/words.json` | 409,266 | 138,019 |
| `shared/data/quran/compareCards.js` | 1,143,968 | 206,412 |
| Built-in al-Sa'di JSON | 6,873,123 | 1,775,823 |
| All 604 mushaf page JSON files | 1,623,681 total | Not measured as a deployment archive |

Raw sizes use file byte counts; gzip sizes use Python `gzip.compress` on each file. These are file/compression sizes, not shipped Hermes size, parsed heap usage or startup milliseconds. Some imports are deferred; the old [mobile startup audit](mobile-startup-bundle-audit.md) has a different baseline and must not be presented as today's measured launch. No new cold-start measurement was made.

Independent documentation review reproduced the temporary probe results, corrected link targets, confirmed removal of the #844-resolved tap finding and identified the fixed-zoom book pinch contract issue now included in Q09. Final checks on `fcc8e3a6` passed: `npm run lint`, root `npx tsc --noEmit`, `npm test`, `npm run build`, and `npx tsc --noEmit -p mobile/tsconfig.json`. Vitest reported 446 passing files, 4,616 passed tests and one skipped test. The production build used the local preview PostgreSQL instance. Relative report links and line bounds were checked. The final diff contains only this report. No UI test file or visited UI code changed in this PR. The browser/native coverage limitations above remain even if lint, tests and builds pass.

Records used in forming the recommendations: R0038 for import boundaries, R0045 for reflow zoom and native verification, R0047 for native back stacks, R0054 for checking all paths, R0055 for card/action composition, and R0056 for keeping playback/follow state independent of page mounts, and R0058 for the newly landed native scroll/pinch arbitration fix. This report adds no record because it resolves no new implementation problem.

Architectural guards are **not approved or implemented by this report**. Existing guards retain their current authority. If an implementation needs a new pipeline guard or a new shared-components-table row, AGENTS requires a separate concrete proposal, a fresh second agent's vote that searches for missed callers and attempts to restore the old path, and the owner's sign-off before building it. The independent documentation review for this PR is not that guard vote, and this report must not be read as the owner's sign-off.

## Top 10 fixes, each scoped as a PR

All are proposals. Tests named here belong with their fix, not in a separate later “test cleanup” PR. The UI inventory and recite-control merge already have another owner and should receive Q19–Q22/Q26 as overlap notes.

| Order | PR-sized change | Scope, reuse and acceptance |
| --- | --- | --- |
| 1 | Verify and install audio files before declaring a pack complete | Q01/Q06. Fix the actual file-worker/install path, partial cleanup and setup-error cleanup. Reuse existing progress rows and shared sync transforms. Tests cover partial-file retry, missing requested rows, directory failure and offline local-file selection |
| 2 | Separate audio metadata sync from file repair and serialize reciter mutations | Q02/Q05. Keep the current sync protocol; add pending repair and reciter operation ownership. Tests cover failed replacement followed by immediate retry, out-of-order sync replies, overlapping packs, stop/delete and source removal |
| 3 | Decode persisted mobile state at its boundaries | Q04. Start with book IDs, audio manifest, reader place/zoom, branch list and saved solo run; reuse existing setting validators. Add explicit migrations/defaults and malformed-state tests, preserving recoverable personal content |
| 4 | Make personal-data saves observable and flush pending edits on background | Q03/Q08. Extend the existing shared storage contract and native adapter, retaining coalescing. Update note/quiz/settings callers with a recoverable failure state. Test disk refusal, immediate background, retry and reopen |
| 5 | Model native playback load/failure/completion explicitly | Q07. Keep the app-wide player and shared repeat/step logic. Add source-revision handling and failure feedback within the existing listening controls. Test stale completion, repeated ayah, offline load, interruption and native background resume; coordinate controls with their owner |
| 6 | Verify the landed reader gesture fix and fix host-specific zoom/back behavior | Q09. Reuse current pager, edge convention and reflow zoom. Retain #844's scroll/pinch coordination and disable or reset unsupported book zoom. Add native checks for delayed tap versus vertical scroll, interior page turning, pushed book back swipe and pinch anchoring. Do not redesign recite controls or turn the page into a scaled bitmap |
| 7 | Give downloaded books one revision-aware install/cache lifecycle | Q10/Q11. Reuse books manager and reader adapter, pair text with page maps, and invalidate raw/derived caches independently of mounted hooks. Test unmounted remove/reinstall, mismatched page-map revision and damaged disk content |
| 8 | Bound eager warmup and reuse compact lookup/search indices | Q13/Q14/Q16. Keep lazyScreen, make warming selective, exclude tooling, reuse one pure search index and avoid loading all pages solely to answer a page lookup. Add lookup equivalence/first-use tests and measure native first-frame, first-feature and retained memory before/after |
| 9 | Virtualize the growing home feed without losing card state | Q15. Change the outer list/item representation using existing platform lists and stable visit/item IDs. Test saved snapshots, quiz answers after recycling, refresh, nested swipes and near-end loading. Measure low-memory-phone behavior at the 60-batch cap |
| 10 | Bound and version one video recording request | Q12/Q18/Q24. Add request identity, validated messages, surfaced file/share errors and prompt payload release, preserving existing painters and page-video partitioning. Add recorder behavior tests and a supported native export/share smoke case |
