# Quran recitation playback audit

Date: 2026-11-17. Research only. Repository baseline: `ffe123be44b86d26a6cb7c9667869d6afea72f27`.

## Decision

**Inferred recommendation:** use Quran Foundation's Content API and Content Sync as the audio source, initially Mishari al-Afasy in Hafs, and `expo-audio` matched to Expo SDK 58 as the phone playback library. Use per-ayah MP3s for finite repetition and range playlists. Add word highlighting only for recordings whose own timing data passes the mapping checks below. Budget about **0.86 to 1.73 GB of audio per reciter at 64 to 128 kbit/s for a 30-hour recording**, plus metadata. These are planning estimates, not measured Quran Foundation totals. Show actual download bytes before the user downloads.

**Checked:** SDK 58 now documents `AudioPlaylist` and gapless playback support. Older advice that Expo Audio has no queue is outdated for this repo. EveryAyah is easy to integrate but does not establish a recording licence in the material checked. QUL explicitly reports missing copyright information for the two examined resources. Neither an open-source player licence nor downloadable files establish rights in a recording. [E1, E2, E3, T1, T2, P1]

**Inferred:** the first implementation should prove finite repeats, configurable pauses and lock-screen operation on physical iOS and Android devices before committing to the library. No device playback, battery, audible-gap or timing-accuracy measurements were performed in this research.

## Evidence labels and repository fit

- **Checked** means the linked primary source or the repository file was read. A documented capability is not a device test.
- **Inferred** means a design recommendation, calculation, interpretation of missing evidence, or behavior still needing verification.
- **Unknown** means the checked sources did not establish the answer. It is not permission or proof of absence.

**Checked:** `AGENTS.md`, `docs/palette.md`, the records index and records R0022, R0031 and R0045 informed this report. `mobile/package.json` uses Expo `~58.0.23`, React Native `0.88.1`, and already includes `expo-file-system` and `expo-sqlite`. It declares none of the three audio players. The existing reader's “recite” mode reveals hidden text; it is not audio playback. Relevant files are `mobile/src/components/Reader.tsx`, `MushafPageView.tsx`, `ReaderPager.tsx`, `ReaderSheets.tsx` and `mobile/src/lib/mushaf.ts`.

**Checked:** in reading mode, a tap selects an ayah's continuous highlight band; a second tap can clear it. Long press also records the touched word and invokes the configured action. The reader has configurable gestures, so the current stored/default configuration matters. Its action overlay already contains save, notes, comparisons, readings and other actions. The band includes gaps between words. Word positions in `ayahMushafWords` exclude the `۞` mark and can span pages.

**Inferred:** the phone app defines the interaction to copy to `src/app/quran/read`. Keep the user's stated “no stats” principle: playback adds no listening history dashboard, streak, score, minutes target or completion percentage. A temporary “repeat 2 of 5” indicator and downloaded byte count describe the current operation; they are not persistent study statistics. This is a task constraint, not a claim that every existing feature avoids counters.

## 1. Audio sources

### Source and timing comparison

| Source | Per-ayah files and word timings | Reciters and riwayat checked | Format and size | Offline status |
| --- | --- | --- | --- | --- |
| EveryAyah | **Checked:** MP3s named by surah and ayah, for example `001001.mp3`. Its legacy timing ZIPs must not be called word timings. Downloaded `Husary_Timings.zip`; `002.txt` contains one increasing scalar timestamp per line, not word-index/start/end triples. The disclaimer warns that later MP3 fixes affect accuracy. [E1, E2] | **Checked:** examples include al-Afasy, al-Husary in murattal/mujawwad/muallim sets, al-Minshawi, Abdul Basit, al-Sudais, al-Shuraym, Basfar, al-Shatri, al-Hudhaify, al-Muaiqly, Ayman Suwayd and Muhammad Ayyub. The separate Warsh directory names Abdul Basit, Ibrahim al-Dosary and Yassin al-Jazaery. **Unknown:** a verified riwaya field for every main-directory set. Do not infer it solely from a qari's name. The linked directory is the full edition/bitrate inventory. [E1, E4] | **Checked:** named bitrates vary, including 16/32/40/64/128/192 kbit/s. Alafasy 64 kbit/s ZIP is listed as 824 MB; sample ayat 1:1 and 1:7 are 47 KB and 104 KB. These are rounded directory labels. [E1, E3] | **Checked:** direct files and ZIP downloads exist. **Unknown:** blanket recording redistribution or app-offline permission. The timings' backlink requirement is explicit; it does not license the MP3s. [E2] |
| QuranicAudio | **Checked:** the site mainly supplies chapter MP3s. **Unknown:** an official, complete per-ayah plus word-timing feed on the checked pages. It is not a direct replacement for a timed ayah API. [A1, A2] | **Checked:** main catalog includes al-Afasy, al-Husary, al-Minshawi, Abdul Basit and many others. Non-Hafs catalog explicitly lists Abdul Basit/Warsh; al-Hudhaify/Qaloon; al-Husary and Noreen Siddiq/al-Doori; and Abdur-Rashid Sufi in Soosi, Khalaf, Abi al-Harith, al-Doori and Shu'bah. These are separate editions, not a promise of timed coverage. [A2, A3] | **Checked:** MP3. **Unknown:** an exact full-Quran byte total for a selected edition. **Inferred:** use the bitrate table below for budgeting; chapter files can be much larger than ayah files. | **Checked:** personal-use downloads are allowed free; commercial use is forbidden by the published notice. **Unknown:** permission to redistribute a pack through Namaq. [A1] |
| Quran.com / Quran Foundation API | **Checked:** separate ayah and chapter catalogs; ayah URLs with optional timing data, chapter URLs with optional verse timestamps and `[word_index, start_ms, end_ms]` segments. Timing availability is conditional. Isolated word pronunciation files are a different feature. [F1, F2] | **Checked:** the public ayah catalog returned 12 editions: Abdul Basit/murattal and mujawwad; al-Sudais; al-Shatri; Hani ar-Rifai; al-Husary/plain and muallim; al-Afasy; al-Minshawi/murattal and mujawwad; al-Shuraym; al-Tablawi. That response has no riwaya field. Chapter catalog schema includes `qirat.name`, with Hafs in its example. **Unknown:** a full current authenticated riwayat inventory. Do not promise all ten readings. [F3, F4] | **Checked:** chapter metadata exposes `format`, `file_size`, and URL; MP3 is documented. **Unknown:** measured full-reciter total. Live chapter requests from this environment returned HTTP 403. **Inferred:** 0.86–1.73 GB at the stated duration/bitrates, pending a real manifest. [F1] | **Checked:** offline recitation resources have an explicit Content Sync route and maintenance conditions. This is the best documented candidate here. [F5, F6] |
| Tarteel AI's EveryAyah dataset | **Checked:** ayah audio/transcription examples, not a documented word-alignment table. The sample exposes 16 kHz audio. No complete word timing coverage established. [T1] | **Checked:** sample reciter `abdulsamad`. **Unknown:** a documented complete reciter/riwaya roster on the card; it is not safe to equate it with today's entire EveryAyah directory. | **Checked:** Hugging Face presents Parquet data, 234,732 rows and 117 GB total. This is a research dataset total, not a phone reciter download size. **Inferred:** do not ship dataset shards for playback. [T1] | **Checked:** downloadable dataset. **Unknown:** recording licence and permission to redistribute recordings offline; its CC BY label excludes recordings. [T1] |
| Tarteel QUL | **Checked:** catalog has ayah and chapter resources with segments, plus JSON/SQLite metadata downloads. Examined resource 102 is al-Sudais ayah audio with word timings; resource 414 is al-Afasy chapter audio with word timings. The list showed 133 resources, 59 tagged with segments. A segment tag does not verify every ayah. [T2, T3] | **Checked:** those resources are tagged Hafs; catalog also includes Abdul Basit, al-Husary, al-Minshawi, Hady Toure and Yasser al-Dosary. **Unknown:** a complete verified riwayat inventory or complete timing coverage for each. | **Checked:** JSON/SQLite are metadata formats, not claims about audio codec. **Unknown:** full audio bytes and codec for each selected export without inspecting its URLs/files. | **Checked:** download UI exists, but both examined resource licence pages say copyright information is unavailable. **Unknown:** offline redistribution rights for either recording. [T2] |

### Licence wording and practical consequences

The following are exact short excerpts, with the full terms linked. Where no licence was found, there is no licence wording to invent.

| Source | Exact wording checked | What it establishes |
| --- | --- | --- |
| EveryAyah timing data | “You must link back to our site from your product and web-site to use these timings.” [E2] | **Checked:** attribution condition for timings. **Unknown:** recording licence, commercial rights and app redistribution rights. The disclaimer's old full-licence URL is not a substitute for readable current terms. |
| QuranicAudio | “downloaded and used for personal use free of charge”; “you may not use these files for commercial purposes” [A1] | **Checked:** personal download permission and commercial restriction. **Inferred:** a free public app is not automatically equivalent to personal use; obtain recording-specific permission before distributing packs. |
| Quran Foundation | “QF Content is not sold, sublicensed, or redistributed, except as expressly permitted below.” [F5, §2.2] | **Checked:** a service/content agreement, not an open recording licence. The permitted end-user application use and offline exception must be read together. |
| Tarteel EveryAyah dataset | “Licensing of the individual recordings is not documented.”; “The remainder of the dataset is CC BY 4.0.” [T1, Licensing information] | **Checked:** CC BY 4.0 does not clear the recordings. |
| QUL, resources 102 and 414 | “We don’t have copyright information for this resource.” [T2, Licence tabs] | **Checked:** neither examined resource provides a recording licence. QUL asks developers to review each resource's terms. [T3] |

**Checked, Quran Foundation terms dated 2026-10-11:** §2.2 permits an application's end-user presentation, including paid or ad-supported apps under conditions. Separately distributed data, content packages and raw API redistribution require a signed licence. §3.1 limits ordinary caching to one week. For a resource available through Content Sync, that is the required path for offline copies. Sync at least every seven days when connectivity permits, apply updates, and sync promptly after a longer outage; the previously synced copy may remain usable while disconnected. The exception does not authorize a prepackaged content database. [F5]

**Inferred implementation consequence:** recommend user-initiated in-app downloads maintained through Content Sync, not a bundled whole-Quran audio pack or a public Namaq mirror. Obtain production access, observe attribution and any recording-specific limits, and resolve pack distribution with QF if the intended download flow goes beyond its documented in-app cache. Do not treat QF as the copyright owner of every recitation. Its own support response disclaims that ownership. [F7]

### Storage budget

**Inferred calculation:** compressed audio bytes are approximately `duration_seconds × bitrate_bits_per_second / 8`. At 30 hours, before tags, filesystem overhead or timing metadata:

| Encoded bitrate | Audio per hour | Full 30-hour reciter |
| --- | --- | --- |
| 32 kbit/s | 14.4 MB | 432 MB |
| 64 kbit/s | 28.8 MB | 864 MB, about 0.80 GiB |
| 128 kbit/s | 57.6 MB | 1,728 MB, about 1.61 GiB |
| 192 kbit/s | 86.4 MB | 2,592 MB, about 2.41 GiB |

**Checked comparator sizes:** EveryAyah lists al-Sudais 64 kbit/s at 583 MB, al-Husary 64 at 1 GB, al-Husary 128 at 2 GB, and al-Afasy 128 at 1 GB for `000_versebyverse.zip`. Its coarse GB labels cannot establish exact bytes. These are EveryAyah editions, not measured sizes for Quran Foundation's recordings. Links: [Sudais](https://everyayah.com/data/Abdurrahmaan_As-Sudais_64kbps/), [Husary 64](https://everyayah.com/data/Husary_64kbps/), [Husary 128](https://everyayah.com/data/Husary_128kbps/), [Afasy 128](https://everyayah.com/data/Alafasy_128kbps/).

**Inferred:** for the recommended initial al-Afasy edition, reserve roughly 2 GB for audio and metadata until the actual manifest is measured. A 30-hour/604-page average is about 1.43 MB per page at 64 kbit/s or 2.86 MB at 128 kbit/s; real pages vary. Download by surah or selected range, reuse bytes for repeated ayat, and never count playlist repeats as extra storage. Compute the actual total from authoritative byte sizes or downloaded files, deduplicated by asset/version; count timing storage separately. Do not present these averages as exact per-page downloads.

## 2. Phone playback

### Expo and build comparison

All three require application logic for finite N repeats, range boundaries and user-selected pauses. None verifies Quran text or audio timings.

| Concern | `expo-audio`, SDK 58 | `expo-av` | `react-native-track-player` |
| --- | --- | --- | --- |
| Expo Go | **Checked:** included. Useful for foreground prototypes. **Inferred:** use actual builds for background acceptance. [P1] | **Checked:** removed from Expo Go in SDK 55; deprecated in favor of Audio/Video replacements. Not a supported SDK 58 choice. [P2] | **Checked:** requires a development client; Expo Go unsupported in the official Expo guide. [P3] |
| Development and release builds | **Checked:** config plugin supplies native background configuration. **Inferred:** install with `npx expo install expo-audio` to match the project's SDK. [P1] | **Checked:** legacy native package remains available but deprecated. **Unknown:** SDK 58/RN 0.88 compatibility; do not assume it compiles. [P2] | **Checked:** current v5 is a rewrite under `@rntp/player`, needs RN 0.76+ and New Architecture. V4 remains Apache-2.0; v5 requires a commercial licence for commercial use. **Unknown:** this repo's exact Expo 58/RN 0.88 compatibility without a build. [P4] |
| Background and lock screen | **Checked:** `shouldPlayInBackground`, background config and `setActiveForLockScreen`; Android needs controls for sustained background play or may stop after about three minutes. [P1] | **Checked:** legacy `staysActiveInBackground` exists. No equivalent documented first-party remote-control service was established in the legacy API. **Inferred:** extra integrations would defeat choosing it for a new implementation. [P2] | **Checked:** native background playback and remote controls. V4 listeners belong in its playback service because UI can unmount. Do not apply V4 service instructions verbatim to v5. [P3, P4, P5] |
| Ayah transitions | **Checked:** SDK 58 `AudioPlaylist` documents gapless support, with single/all loop modes. **Inferred:** use the native queue, not one React effect loading the next file. [P1] | **Inferred:** manually replacing/loading `Audio.Sound` at each end can introduce a loading gap. No native gapless queue was established in checked legacy docs. [P2] | **Checked:** v5 advertises preloading and gapless-like transitions. **Inferred:** this is not proof of sample-perfect joins. [P4] |
| Offline files | **Checked:** local sources work; `downloadFirst` is temporary preload/cache behavior, not a durable download manager. Use existing FileSystem for durable user downloads. [P1, P6] | **Checked:** legacy source supports local URI. **Inferred:** same separate download manager needed. [P2] | **Checked:** v5 advertises caching; v4's documented cache is Android-only. **Inferred:** persistent downloads need an app-owned manifest and files on both platforms. [P4, P7] |
| Battery | **Unknown:** no comparable measured battery benchmark. **Inferred:** native playlists, local files and suspended visual updates should avoid needless JS/network work. | **Unknown:** no measured comparison. **Inferred:** repeated JS loads and timers add work; deprecation is the deciding issue. | **Unknown:** no measured comparison. **Inferred:** native queues suit screen-off listening; cache size, preloading and wake settings still matter. |

**Checked:** Expo Audio's playlist exposes track changes, playback position, rate, seeking and lock-screen metadata. The config plugin supports disabling microphone permission and Android recording permission while enabling background playback. These are separate from runtime audio mode. [P8]

**Inferred:** own one playlist above the reader route so closing a sheet, turning a page or switching tabs does not destroy playback. Set interruptions to a non-mixing mode appropriate for spoken recitation, handle calls and headphone removal, and keep play/pause state synchronized with lock-screen actions. Disable recording configuration for this listening-only feature. Confirm Bluetooth and calls on release builds, not only a simulator.

### Gapless playback, repetition and pauses

**Inferred:** distinguish three things: avoiding a network load between files, avoiding decoder gaps, and removing silence already inside a recording. Native gapless support addresses transitions; it does not make a reciter's natural waqf disappear. Keep the original recording and its pauses. Do not crossfade Quran words or silently trim recitations.

**Inferred:** build a bounded queue of logical ayah occurrences for the selected range. Repeat each ayah N times, then repeat the range M times, with independent settings. Infinite repeat should recycle a bounded queue rather than allocate indefinitely. An occurrence has an ayah key and repeat index; a downloaded file has a recording/version identity. They are different identities.

**Inferred, needs a device proof:** represent configurable pauses with app-owned silent audio items between repeats so the native queue can continue while JS is suspended. A JS `setTimeout` after pausing is not a reliable screen-off scheduler. Silence must retain a predictable wall-clock length when speed changes; adjust its encoded duration or prove a native scheduling alternative. Test whether the OS keeps the session active during long silent items, whether remotes skip silence correctly, and whether pitch correction is available in the chosen playlist path. Do not claim these behaviors are supplied by a built-in “repeat N with delay” API. If that proof fails, ship reliable no-delay background playback first and label delayed repetition as foreground-only until fixed.

**Inferred offline design:** place completed, versioned files in the document directory, with a small SQLite manifest for URL, resource ID, expected bytes, version/hash where available, local URI and download state. Use temporary filenames, verify completion and rename; cancel, retry and delete explicitly. Keep an evictable streaming cache separate from user-pinned downloads. Respect free space, Wi-Fi preference and QF invalidations. Download the selected range and a small next-ayah buffer, not all reciters. QF sync metadata does not imply audio bytes are embedded in its JSON snapshot. [F6, P6]

**Inferred battery plan:** compare stream versus local playback over a fixed 30-minute range, same volume, screen off and release build, with/without word highlighting. Record device, OS, network, thermal state, energy and data bytes. Disable highlight polling offscreen; avoid waveform sampling, screen wake locks and continuous UI rerenders. No claimed percentage saving is justified yet.

## 3. Memorization features and reader behavior

These are examples from established apps, not a measured ranking of “best”.

| Feature | Checked existing behavior | Inferred Namaq behavior |
| --- | --- | --- |
| Repeat an ayah N times | Quran.com's iOS release notes describe repeat counts 1–100. QUL's recitation preview exposes “Repeat each ayah”. [M1, T2] | Offer once, 3, 5, 10 and custom; show current repeat only while playing. |
| Loop a range | QUL exposes start/end, repeat range and loop forever. Tarteel documents repeat/custom ranges and offline recitations. [T2, M2] | Start/end ayah in one sheet, visible inclusive range, independent ayah-repeat and range-repeat settings. Reject reversed or unavailable ranges. |
| Pause between repeats | Quran.com's iOS release notes explicitly describe configurable pauses. [M1] | Offer off, fixed seconds and a pause equal to the just-played ayah's listening duration. Specify whether pauses occur after each repeat, after each ayah, or between range passes. |
| Speed | Quran.com documents playback speed; current iOS release notes describe 0.25×–2×. [M1, M3] | Default 1×; initially offer a small useful range such as 0.75×–1.25× with pitch preservation where verified. Never recalculate word indexes from speed. |
| Synchronized words | Tarteel's product page lists ayah and word follow-along; QUL explicitly supplies timed resources for highlighting. [M4, T2] | Optional word emphasis over the existing ayah band. Fall back to ayah highlighting when timing/mapping is absent. |

**Inferred interaction:** retain tap selection and the configured long-press overlay. Add “استمع / Listen” and “كرّر / Repeat” to that overlay, with icons and accessible labels. The repeat action opens the range/settings sheet seeded with the pressed ayah. Do not make a tap unexpectedly play or seek. An optional “play from this word” action should appear only when timing and mapping are verified; it should not replace the word's existing tools.

**Inferred:** add a compact bottom playback bar with play/pause, current surah/ayah, repeat settings and a stop action. Reserve space above the safe area/tab bar so it cannot cover the last mushaf line or the existing recite pill. Keep playback position separate from the user's selected ayah and saved reading place. Offer explicit follow-playback; a manual page turn can suspend following until “Return to playing ayah”. In hidden-text/recite or write mode, audio must not reveal hidden words automatically.

**Inferred:** reuse the app's paper/ink surfaces, fig action color, existing band treatment and shared controls. Preserve Arabic/English, RTL, dark mode, large text and reduced motion. Avoid screen-reader announcements for every word; announce user actions and ayah changes when appropriate. Match these decisions on the website. R0031 argues for extending the real reader rather than drawing an audio-specific mushaf copy; R0045 requires remeasuring highlights after text reflow.

### Word timing rules

**Checked:** QF chapter timings can include `[word_index, start_ms, end_ms]`; ayah timing is a separate API path, and timing is optional. A chapter-reciter ID is not interchangeable with an ayah-recitation ID. [F1, F2, F4]

**Inferred:** join by exact recording edition, audio-file identity, surah, ayah and occurrence index. Establish whether timestamps are chapter-relative or ayah-relative for that response. Convert player seconds to milliseconds; do not multiply original-file position by playback rate again. Handle introductory basmala/isti'adha, surah 9, al-Fatihah numbering, ayah end signs, repeated words, repeated recitation segments and page-spanning ayat explicitly. Never reuse one reciter's timings with another MP3 or another edit by the same reciter.

**Inferred:** map source positions to Namaq's actual rendered mushaf words, excluding non-word marks as the reader already does. Check one-to-many/many-to-one token differences; text matching alone cannot distinguish repeated occurrences. R0022 changes this decision: occurrence indexes must remain explicit. Missing or suspect segments should disable word highlighting for that ayah while audio and ayah highlighting continue. On seek, rate change or foreground return, recompute from actual player position. A visible-only update interval around 100 ms is a prototype setting to measure, not an accuracy guarantee.

**Inferred acceptance sample:** listen and compare 1:1–7, a long verse such as 2:282, a page boundary, a surah boundary including 8→9, a repeated word, a repeated passage in muallim audio, and an ayah with no timings. Verify start/end offsets, segment order, visible token mapping and drift after seeking and speed changes. Whole-Quran coverage must be counted separately from this listening sample.

## 4. Website playback

**Inferred:** keep the phone's state model, range rules, repeat semantics, recording identities and timing mapper in dependency-free `shared/` code. Use a browser adapter around one persistent `HTMLAudioElement` mounted above the reader route. This is a platform adapter using browser APIs, not a second phone library recommendation. The Next.js reader keeps its existing components and gestures. Do not install Expo modules into the website merely to share the transport.

**Checked:** browser media supports playback position, seeking, rate and events. Audible autoplay can be blocked; `play()` is asynchronous and can reject. Start playback from a user action and show a recoverable play state. [W1, W2]

**Inferred:** reuse one audio element rather than creating it per ayah render; preload only the next file. For long uninterrupted listening, a matching chapter file and its own timestamps can avoid per-file switches, but range-end seeks and repeat delays remain browser scheduling operations. Do not describe separate HTML audio files as guaranteed sample-gapless. The website must not promise the phone's screen-off reliability.

**Checked:** Media Session can provide metadata and supported media actions, but availability varies. [W3] **Inferred:** feature-detect it; map play/pause/next/previous to logical ayat, never a silent delay item. A browser or mobile OS can suspend background JS, so foreground word highlights can catch up from `currentTime` on return, while delayed loops and boundary callbacks need real Safari/Chrome tests. A service worker is not a permanently running audio scheduler.

**Inferred:** use Cache Storage for complete permitted audio responses and IndexedDB for a download manifest and sync state. Serve offline bytes with correct MIME type and byte-range behavior, or use bounded local Blob URLs and revoke them after use. Simple cross-origin `<audio>` playback does not establish permission for JavaScript `fetch` or cache access; check CDN CORS, Range and response headers. If a backend is needed, keep it inside the end-user application flow and follow provider terms. Never embed QF client secrets in web bundles or the Expo app. QF's server SDK requires backend credentials. [F1]

**Checked:** browser storage can hit quota or be evicted. [W4] **Inferred:** show per-surah download state and actual bytes, use `navigator.storage.estimate()` and request persistence where supported, handle quota errors, and explain missing offline files in the UI. Browser “downloaded” is not a guarantee against OS eviction. Audio downloads alone do not make the current Next.js reader available offline; reader shell, text/font assets and route navigation also need an offline plan. Reuse the same QF Content Sync maintenance rules for browser copies.

## 5. Short build plan

All steps below are **inferred proposals**. This PR implements none of them.

1. Obtain QF production access. Select al-Afasy/Hafs in the correct ayah catalog, verify its complete ayah inventory and matching word segments, and obtain actual byte totals. Verify the recording/riwaya rather than relying on a qari name. Confirm the chosen in-app offline flow against current terms. Add the source and player attribution to `shared/sources.ts` when implementation actually starts.
2. Prove SDK 58 `expo-audio` in physical iOS and Android builds. Use a root-owned native playlist; test lock-screen controls for more than three minutes, interruption/headphone handling, gapless local ayah transitions, finite repeats, rate and native-queue delays. Keep the Expo Go prototype limited to what it can verify.
3. Implement one shared repeat/range state model and explicit occurrence-to-asset mapping. Test off-by-one boundaries, repeat counting, stop during delay, manual next/previous, source changes and cancellation. Choose a proven pause mechanism; do not depend on suspended JS timers.
4. Add user-initiated surah/range downloads through Content Sync plus FileSystem and SQLite. Validate bytes, recover interrupted downloads, apply source updates/deletions, show actual space and delete controls, and verify airplane-mode playback after restart.
5. Extend the existing phone overlay, reader band and bottom bar. Add optional word emphasis only after token/recording alignment checks. Test hidden-text modes, page following, font reflow, Arabic/English accessibility and both themes. Keep operational repeat state local and add no study statistics.
6. Implement the website adapter and copy the app's behavior. Test Safari on iPhone and desktop plus Chrome/Android for autoplay rejection, ranges, offline/quota behavior, CORS, lock-screen actions and foreground resync. Report platform limitations explicitly. Run the repository's required lint, type, unit, production-build and affected UI checks in the implementation PR.

## Verification limits

**Checked:** this audit read repository files, official docs, catalog/terms pages, public API responses and a small EveryAyah timing ZIP. It did not add dependencies to tracked manifests, player code, sources registrations or new records. The report is the only intended tracked change.

**Unknown:** current authenticated QF whole-reciter byte totals and complete timing/riwaya coverage. Public chapter API probes returned 403. Dataset and catalog pages establish availability, not listening accuracy. No claim here substitutes for physical-device background tests, recording-specific permission or measured battery results.

## Sources checked

Links were checked on 2026-11-17 unless a document's own date is stated above. Catalogs and terms can change.

- E1: [EveryAyah data catalog](https://everyayah.com/data/).
- E2: [Timing disclaimer](https://everyayah.com/data/timings_files/000_disclaimer.txt), [timing directory](https://everyayah.com/data/timings_files/) and [Husary timing ZIP](https://everyayah.com/data/timings_files/Husary_Timings.zip).
- E3: [Alafasy 64 kbit/s files and archive](https://everyayah.com/data/Alafasy_64kbps/).
- E4: [EveryAyah Warsh editions](https://everyayah.com/data/warsh/).
- A1: [QuranicAudio about and use notice](https://quranicaudio.com/about).
- A2: [QuranicAudio reciter catalog](https://quranicaudio.com/).
- A3: [QuranicAudio non-Hafs catalog](https://quranicaudio.com/section/3).
- F1: [QF Audio SDK guide, source selection, IDs and response fields](https://api-docs.quran.foundation/docs/sdk/javascript/audio/).
- F2: [QF chapter audio endpoint and segments](https://api-docs.quran.foundation/docs/content_apis_versioned/4.0.0/chapter-reciter-audio-file/).
- F3: [Public ayah-recitation catalog response](https://api.quran.com/api/v4/resources/recitations) and [current catalog contract](https://api-docs.quran.foundation/docs/content_apis_versioned/4.0.0/recitations/).
- F4: [Chapter-reciter catalog schema and qirat field](https://api-docs.quran.foundation/docs/content_apis_versioned/4.0.0/chapter-reciters/).
- F5: [Quran Foundation Developer Terms, §§2.2 and 3.1](https://api-docs.quran.com/legal/developer-terms/).
- F6: [Content Sync resource groups, identities, bootstrap and updates](https://api-docs.quran.com/docs/tutorials/content-sync/getting-started/) and [offline cache patterns](https://api-docs.quran.com/docs/tutorials/content-sync/offline-cache-patterns/).
- F7: [Quran.com response about recitation ownership](https://feedback.quran.com/reciters-request/p/permission-to-use-quran-recitations-by-mishary-alafasy-and-yasser-al-dosari-on-y).
- T1: [Tarteel EveryAyah dataset card, schema, licensing and size](https://huggingface.co/datasets/tarteel-ai/everyayah). The rendered current card includes the recording-rights caveat; older indexed README excerpts that only say CC BY 4.0 are insufficient.
- T2: [QUL audio catalog](https://qul.tarteel.ai/resources/recitation), [Sudais ayah resource](https://qul.tarteel.ai/resources/recitation/102), [its licence tab](https://qul.tarteel.ai/resources/recitation/102/licence), [Afasy chapter resource](https://qul.tarteel.ai/resources/recitation/414) and [its licence tab](https://qul.tarteel.ai/resources/recitation/414/licence).
- T3: [QUL FAQ](https://qul.tarteel.ai/faq) and [recitation tutorial](https://qul.tarteel.ai/docs/tutorial-recitation-end-to-end).
- P1: [Expo SDK 58 Audio API, playlist, background and lock screen](https://docs.expo.dev/versions/v58.0.0/sdk/audio/).
- P2: [Expo SDK 55 removal from Expo Go](https://expo.dev/changelog/sdk-55), [deprecated expo-av README](https://github.com/expo/expo-av), and [legacy Audio API source](https://github.com/expo/expo/blob/sdk-54/packages/expo-av/src/Audio.types.ts).
- P3: [RNTP official Expo guide, V4-era API](https://doublesymmetry.github.io/react-native-track-player/docs/next/guides/with-expo).
- P4: [RNTP current README, v5 package, requirements, licence and capabilities](https://github.com/doublesymmetry/react-native-track-player).
- P5: [RNTP V4-era background/service guide](https://doublesymmetry.github.io/react-native-track-player/docs/next/basics/background-mode).
- P6: [Expo SDK 58 FileSystem](https://docs.expo.dev/versions/v58.0.0/sdk/filesystem/).
- P7: [RNTP legacy lifecycle and cache platform table](https://doublesymmetry.github.io/react-native-track-player/docs/api/functions/lifecycle).
- P8: [Expo SDK 58 audio types](https://github.com/expo/expo/blob/sdk-58/packages/expo-audio/src/AudioModule.types.ts), [options](https://github.com/expo/expo/blob/sdk-58/packages/expo-audio/src/Audio.types.ts), [web implementation](https://github.com/expo/expo/blob/sdk-58/packages/expo-audio/src/AudioModule.web.ts), and [config plugin](https://github.com/expo/expo/blob/sdk-58/packages/expo-audio/plugin/src/withAudio.ts).
- M1: [Quran.com's iOS app description and release notes](https://apps.apple.com/us/app/quran-by-quran-com-%D9%82%D8%B1%D8%A2%D9%86/id1118663303).
- M2: [Tarteel free listening features](https://support.tarteel.ai/en/articles/12267535-can-i-use-tarteel-for-free).
- M3: [Quran.com audio settings](https://quran.com/en/product-updates/simplifying-word-by-word-and-audio-settings).
- M4: [Tarteel product feature comparison](https://tarteel.ai/en/pricing).
- W1: [HTMLMediaElement API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement).
- W2: [Browser autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).
- W3: [Media Session API and compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API).
- W4: [Browser storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).

Records used: R0022, R0031, R0045
