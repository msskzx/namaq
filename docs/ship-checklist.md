# Ship checklist

Run this before opening any PR. Tick only the sections your change touches,
and paste the ticked sections (or "none apply") into the PR body under
`## Checks`.

It holds the owner's feedback and standing rules from 2026-11-05 to 2026-11-19,
compiled from project memory, this repo's AGENTS.md and records, the project
chat and the phone checklist, then reviewed by two separate agents. Rules a
test already enforces are not repeated here: they run with `npm test` and
`npm run test:ui`. Rules that could become tests are proposed in
[plans/guard-proposals.md](plans/guard-proposals.md); until the owner signs one
off, check it here by hand.

Source tags, where a line has one: `owner 11-18` is the owner's word on that date, `R00xx` a record
in [records](records/README.md), `AGENTS` a rule already in AGENTS.md.

## 1. Content and sources

- [ ] Only correct, established information. If the book's author or editor calls something weak or unknown, reports it only "for wonder", or gives it by a broken chain with no grade, it does not ship. (owner 11-18, 11-19)
- [ ] A disputed point is shown attributed, as one answer holding every opinion with its reference («قيل فيه كذا، عند فلان»). It is not dropped and not stated as settled. A two-year date reads «السنة ٥ أو ٦». (owner 11-18)
- [ ] If you cannot tell whether a point is disputed, word it attributed and add it to `/mnt/project-files/data-review/review-list.md`. (owner 11-18)
- [ ] Every source we found for a fact is cited, not just one. (owner 11-18)
- [ ] Hadith, poems and sayings: weak ones stay out. Start with al-Bukhari, Muslim, or a named scholar's sahih grade, quoted word for word per scholar and route. Reports whose wording, line order or speaker differ wait. (owner 11-17, 11-18)
- [ ] Sense may spot an error, but every fix names its source and is recorded as [wrong, right, witness page]. With no source, keep the printed text and raise it. Where editions differ, the cited edition wins. (owner 11-19)
- [ ] No AI-written explanation, topic, link, grouping or purpose. Each one quotes a book. Groupings use the scholars' own categories, and anything of ours is marked as ours. (owner 11-13, 11-16)
- [ ] A book's passage on an ayah is shown whole, not as hand-picked sentences. Any lighting inside it follows a fixed rule taken from the author's words. (owner 11-16)
- [ ] A quote is pinned only to an item the quoted sentence itself names, not the page around it. A quote that fits several ayat lists every place, with no cap. (R0026, R0044, owner 11-18)
- [ ] Only the author's text: modern editors' footnotes stripped, no chain attached to words that lack one, and a book whose attribution is disputed labelled «المنسوب».
- [ ] Modern works (al-Muyassar, Hisn al-Muslim, al-Albani's annotated books) ship only with written permission. Until then, quote a short attributed line and link out. A public-domain author's own text may ship whole, with its page and a link to the edition. (AGENTS)
- [ ] Every page shows its sources, inline where something is quoted, each section with its own reference. A reference is collapsed to the book name (and author); a tap opens volume, page, edition and link. No global sources sheet. (owner 11-16, 11-19)
- [ ] A reference gives the surah name first, then the ayah: «الطور ١٧». (owner 11-14)
- [ ] No review labels ("unreviewed", "pending") in the UI. A value without a book page still shows plainly; its review status stays in the data (ADR 0008). (owner 11-17, 11-18)
- [ ] Prophets carry «عليه السلام» and the Prophet ﷺ. ﷺ is the only honorific kept as a sign; the others are spelled out.
- [ ] Tarajim: one speaker per virtue, and the Prophet's words inside a report are credited to him. A mention is tied to a catalog person only when the page makes it certain. Al-Waqidi is used only for maghazi facts.
- [ ] An ayah-to-person link carries its kind and the source's wording. Tafsir and asbab sources are graded through a named scholar. (owner 11-18)
- [ ] Sira stories: the whole report, split into moments word for word, with the isnad in the reference line and other reports full but folded. Plain paragraphs, people chips once under the title, enough background to follow. Fitna battles show only name, year, place and people. (owner 11-18, 11-19)
- [ ] Doctrinally loaded tafsir (al-Kashshaf's Mu'tazili readings) is not shown by default without asking the owner. Al-Sa'di stays the default.
- [ ] Qira'at: Shatibiyya and Durra routes only. Route doubts are settled from the route books. Pronunciation-only details stay off the cards. (R0033)
- [ ] Wording is plain for a lay reader («ما صلة محمد من علي»), and a relation's direction is stated in words. (owner 11-19)
- [ ] The owner's terms: «مواضع», never «روايات», for a story's places in the Quran. Tree groups are never «العائلات». The hadith tabs are «الرسم» and «النص كاملًا», never «الإسناد». Feature names: «مشاهد», «مدونتي», «المتشابهات», «دوّن».
- [ ] A set of events with no known order is called a grouping, not a timeline. (owner 11-11)

## 2. Quran text

- [ ] Each ayah view takes the highest level the space allows: whole page, then a page slice, then the ayah as set on the page, then the ayah copied. A reader snippet uses the reader's own layout. (owner 11-17)
- [ ] The copied level drops only the page position. It keeps the tashkeel, the number medallion and every waqf, sajda and hizb sign, in tree and matrix boxes too. (owner 11-17)
- [ ] KFGQPC Hafs for every Quran word (ayat, tree nodes, quiz choices and leaves, typed answers, Quran words in prompts), set only by the Quran module. Amiri for everything else, surah and prophet names included. No third font. (owner 11-11)
- [ ] Ayat are justified like the mushaf, with one number mark per ayah, the number never written as a word, and the sajda sign on the right word.
- [ ] Reader highlights are continuous bands, not boxes per word. Only hidden recite words get boxes. A saved ayah shows a purple number, a forgotten ayah an accent band, and a plain number is muted. (owner 11-10)
- [ ] Nothing of ours is drawn in the reader's text area, in the app or on the website. The reader background matches its surroundings. (owner 11-17)
- [ ] Recite: the last word and the ayah number are separate boxes, and the number box looks different, so an empty page still shows where each ayah ends. (owner 11-09, 11-10)
- [ ] Page size stays the same from page to page: a hizb chip does not change it, and the header has a fixed height. (owner 11-10)
- [ ] Matching uses general rules on mushaf marks, not word lists. Search goes through the one matcher and the one surah-name search, surah names first.

## 3. Quizzes

- [ ] Read every new or changed question. Drop any where a wrong choice could also be right, is ambiguous, or is too close to the answer. The owner checks a sample before it ships. (owner 11-18)
- [ ] No question gives its answer away: not in its prompt, not in another question of the same quiz, not in data sent to party phones before the reveal. (owner 11-19, R0029)
- [ ] Wrong choices come from the same scope and filters the questions come from: a juz 30 quiz never offers a juz 29 surah. (owner 11-19)
- [ ] A weak question gets new wrong choices first. Drop it only if that fails. (owner 11-18)
- [ ] Wrong choices are plainly wrong but plausible: from the same book, the same sex for a virtue, the same rhyme for a verse. Never a broad term that covers the answer, and never another companion who also narrates it.
- [ ] Meaning quizzes: no wrong choice from the question's own ayah, and pointer meanings («يعني: القرآن») are never wrong choices. A meaning given for a non-Hafs reading, or followed by «ويقال» or «وقيل», is not asked. (owner 11-18)
- [ ] Tafsir quiz: short, whole tafsir entries only, with no snipping. The ayah's own words are hidden, the choices are whole ayat, and no wrong choice says what the passage says. (owner 11-18)
- [ ] A disputed point is asked only when the right answer holds every valid opinion («٤ أو ٥ هـ») and the wrong choices are far from all of them. (AGENTS)
- [ ] Big refrains (an ayah repeated many times in one surah) are not asked. Kunya questions are never asked first.
- [ ] Question banks are built once by a script into a data file (places and ids only), never generated at runtime. (owner 11-18)
- [ ] Kinds mix as chips inside solo and party, never as separate quizzes. Quizzes show trees in the matrix view only. (owner 11-13, 11-17)
- [ ] Every typed Quran answer (recite, write, tree leaves, compare blanks) uses the recite-mode write boxes, in the same colour. No quiz builds its own writing field. (owner 11-17, 11-19)
- [ ] A tree question's prompt is not bigger than the tree. Corrections sit inside each asked node.
- [ ] Look-up: tapping «ابحث عن الجواب» counts as the attempt. Party scores 10 a question and 5 after a look; solo has no penalty; nothing extra for speed. After the reveal, everyone sees the feature's full view under the answer. Memory kinds (which-surah, compare, recite) have no look-up. (owner 11-19)
- [ ] Answer buttons sit on the right. Players move between questions by swiping. The result never says "passed" or "failed". (owner 11-17)

## 4. Feed cards

- [ ] The feature ships with its home-feed card and, if it has something to ask, a quiz kind, both shown in the sketch. A feature with no card is named in the PR with the reason, and [feed-cards.md](feed-cards.md) is updated. (AGENTS)
- [ ] The card draws the feature's own shared view component, never a text-only stand-in or a redraw. Its taps open the real page at that item. (owner 11-13, 11-19, R0031)
- [ ] The card has a UI test that uses it (swipe, zoom, typing, the tap that opens its page), not just a screenshot. (R0031)
- [ ] One item per card. The card grows with its content up to screen height, with no inner scroll below that. Ayah cards stay small and open a sheet on tap. (owner 11-14, 11-18)
- [ ] Card buttons sit under the card, never inside it. (owner 11-15)
- [ ] The feed learns nothing from taps yet. Only open rules move a card, and any hidden logic becomes a setting. (owner 11-19)
- [ ] No stats, counts, streaks, likes or forgot-counts anywhere. Counters are live only (adhkar).
- [ ] Questions use the memorized range. Pondering cards may use everything but prefer the memorized range. Trees are always drawn whole. (owner 11-13)

## 5. UI and design

- [ ] New UI copies the app's look and checks the app first. Read [palette.md](palette.md) and use only theme tokens. (owner 11-13)
- [ ] Light and dark both work. Dark detection uses the palette's scheme, never a colour comparison. The black tint makes every background black, not only cards, and the selected-ayah band stays neutral. (AGENTS for light and dark)
- [ ] Every new text has Arabic and English versions, and Arabic sits on the right on phone and PC. (AGENTS for both languages)
- [ ] Card and row controls start at the right edge. Save first; share (paper airplane) last and leftmost. Popups open from the start side. (owner 11-10, 11-11)
- [ ] Top bar: all buttons on the right, back first on the right, help on the far left, logo only on home. No page title on tabs, settings only in the home bar, no border on dropdowns in the bar. (owner 11-17)
- [ ] Nothing stays pinned: on a scrolling screen the top bar hides on scroll down and returns on scroll up, through the shared mechanism. Bars are frosted, with no rule line, and the bottom bar sits on the bottom edge. (owner 11-12, 11-15)
- [ ] A new tab page or overlay leaves room for the floating tab bar (`useTabBarSpace`) and registers `useTabRetap`: a retap goes to the top, and a retap at the top resets filters. (owner 11-13)
- [ ] Tabs, small menus and buttons on dense pages are icon-only and large, with accessible names. Content cards keep their text.
- [ ] Long-press and card menus use `FloatingMenu` with `ActButtons` (icon, label under). An "on" action shows in the mark colour, with no square behind.
- [ ] Where a parent clips (`overflow: hidden`, or Android bounds), the box itself is 44 pt. Neighbouring hit slops do not overlap. (AGENTS, owner 11-19)
- [ ] Chips, pills and buttons in one row share one size. No card inside a card. Keep the 12 pt margin, padding and card borders.
- [ ] A new card is built from the shared `Card` (one 14 px radius, the card colour) and the compare page's mark styles. No new card style and no background highlight for matches. (owner 11-13, 11-14)
- [ ] Colours mark kinds of sameness by the mutashabih books' categories, with al-Zarkashi's terms in the legend. Colouring goes word by word. Matrix: words every row shares in full colour, words some rows share faded, a tapped word lit in every row. (owner 11-11, 11-13, 11-14)
- [ ] Whether ayat make a group at all is a separate rule: it weighs how many words they share and what kind of words they are (the books' mutashabih, or for «تدبّر» a few rare words). The colouring rule never decides it. (owner 11-18, 11-20)
- [ ] Toggles run left to right everywhere: on means the knob is on the right. (owner 11-09)
- [ ] Numbers on the phone are picked with `NumberPicker` or chips, never typed, and there are no +/- steppers. The party join code is the one exception. (owner 11-10)
- [ ] The keyboard never covers a filter, sheet or submit button. Search does not auto-focus, and tapping empty space dismisses the keyboard. (owner 11-10, 11-11)
- [ ] Surah pickers search by name and number and show both once picked. Pages share the range, saved and kind filters. A changed filter drops a stale selection, and a two-surah page shows only when both surahs are in range. (owner 11-09, 11-10)
- [ ] Each card has its own toggles (view, rotate, surrounding ayat). Settings hold only the defaults. (owner 11-14)
- [ ] No animation the owner did not ask for. 0.5× is the slowest speed. A studio plays only on press and stays open until ✕. One hide motion. `LoadingDots` on every wait, URL-only updates included.
- [ ] Every section has a collapse chevron, empty ones too. An empty part never looks like a failed load. A card holds continuous ayat, and any gap gets a separator showing its range. (owner 11-12)
- [ ] No "coming soon", no repeated or useless subtitles and tags, and no hidden cap that cuts content (a reader search shows every result). The one allowed cap is `MAX_BRANCHES` 10 in the branch quiz. (owner 11-18)
- [ ] Book text, names and lists are never cut with "…". Where a UI label really needs a line limit, use `numberOfLines` or line-clamp, never a container height. (owner 11-18, R0030)
- [ ] Videos and share images use the app's own components and measured layout, through the one recorder and timeline. A video shows the logo only on its outro. A share image is the card in the user's theme with the logo and «نمق» under it, without the card's buttons. Neither shows an app or website link. (R0036, R0037)

## 6. Gestures and phone

- [ ] Swipes follow the finger with a peek of the next item. A released drag continues from where it was. Swiping also works from the empty space under a short card. (owner 11-10)
- [ ] Swipes replace prev/next buttons. Step buttons appear only on the PC website. (owner 11-09, 11-10)
- [ ] On a page that does not scroll, pulling down opens the page's main action (search or filter). (owner 11-10)
- [ ] Back is a native swipe from the right edge with a peek. A page with a back arrow lives in a stack, gestures inside a page do not block it, and the mushaf reader has no swipe-back. (R0047, owner 11-09, 11-15)
- [ ] Switching pages keeps state. (R0056, owner 11-09)
- [ ] Long press opens floating buttons only, showing every ayah option. Sheets open only from a button. A second tap on the selected ayah deselects it. A selection is a temporary state that actions act on, and «نسيت» needs no pop-up. (owner 11-14, 11-19)
- [ ] A feature uses the same gestures everywhere it appears (the home recall card uses the reader's recite gestures).
- [ ] Trees render on first open, not only after switching views. A lit path's ayat card sits under the save/share row so buttons do not move. Paths light only from a tap. The animation starts at the first node and grows only to shown children. Pinch to zoom; a tree opens at reading scale and pans. (owner 11-10, R0046)
- [ ] Starting recite hides the top and bottom bars, from every way into it. (owner 11-10)
- [ ] For native-only behaviour (alignment, flex sizing, gestures, clipping), the web export proves nothing. Reason from React Native, and add a line to `/mnt/project-files/app-hardening/real-phone-checks.md`.
- [ ] A new app screen lives in `mobile/src/screens` with a `lazyScreen` route file. Theme, settings and `_layout` import no data module, not even a type. (R0038)
- [ ] The app works offline, with no login and no usage stats. No heavy outside APIs: a static map image, not Google Maps.

## 7. Website parity

- [ ] Every phone feature also ships on the website in the same build, unless a browser cannot do it (the qibla compass). No "website later". (owner 11-19)
- [ ] No page lives only on the website, apart from the owner's review tools. (AGENTS)
- [ ] A port carries all of the feature's behaviour (highlighting, node buttons and the rest), not a reduced copy. (owner 11-10, 11-11)
- [ ] The bottom bar holds at most five buttons (Quran hub, Hadith, home, Tarajim, Quizzes), and the website nav lists the same groups. (owner 11-13, 11-18)

## 8. Shared pieces

- [ ] Look in `mobile/src/ui/` and `src/components/common/` before building any control or box. A missing variant is a prop, and every existing caller still looks the same. A new piece is built there first and listed in the README. (owner 11-17, AGENTS)
- [ ] Shared feature components (TiesRing, the tree, the recite pieces, the Quran module) are never copied to change them. Add a prop instead. (owner 11-19)
- [ ] Word matching goes through `shared/quran` (`likeness` in `wordMatch.ts`, `ayahContexts` and `sharedByAll` in `ayahContext.ts`), called with the feature's own criteria. No new matcher module, threshold dashboard or second engine. Curation is a layer after it. (owner 11-07)
- [ ] The PR body has `Shared pieces: used ...; added ...` (or `none`) before `Records used:`. (AGENTS)

## 9. Tests

The rule itself is in AGENTS.md under Testing ("Only meaningful tests",
owner 2026-11-19). These lines check it.

- [ ] You can say in one sentence what each test in your feature's files protects: an owner rule or a past bug. If you cannot, rewrite it or delete it.
- [ ] Hard-coded counts are replaced by a rule that holds for every item, plus "there is at least one" so an empty list cannot pass. Or the test is removed.
- [ ] Removed: render-only, copy, class-name, config-mirror, duplicate and dead-helper tests. Each removal is listed in the PR with what it covered. (owner 11-09, AGENTS)
- [ ] App changes, and website pages the UI tests visit, ran `npm run test:ui`. Each flow added or changed has a test there, and a UI test broken by a UI change is fixed in the same PR. (AGENTS)
- [ ] Tests read Quran text and surah names from shared data (`surahName`), never hand-typed.
- [ ] Where a rule must hold for all the data, the test walks every item, not a sample.
- [ ] A guard counts only if it fails when the old bug is put back. Try that once before keeping it. (AGENTS)
- [ ] You ran lint, `tsc --noEmit`, `npm test` and `npm run build` yourself, plus `npm run typecheck` in `mobile/` for app changes. A subagent's "green" is not enough. (AGENTS, R0010)
- [ ] No new guard written alone. A proposal gets a second agent's vote, then the owner's sign-off. (AGENTS)

What counts as a meaningful test (proposal for the owner):

- Meaningful: it fails when a real mistake comes back, and it is named after that rule or bug. Example: `shared/quiz/branchAnswers.test.ts`, "rejects a different word with the same consonants" (typed «قال» must not pass for «قُلْ»).
- Meaningful: it checks a rule over all the data (every question, every tree), not a sample or a total. Example: `shared/quiz/integrity.test.ts` rebuilds every ayah of every tree question from prompt plus answer and catches dropped words, changed marks and cut text.
- Meaningful: it goes through the one real entry point (the shared piece, the real builder), not a copy or mocked internals.
- Meaningful: a UI test does what a person does and checks what they see.
- Filler: it repeats a constant. Example: `shared/tapSize.test.ts` checks `MIN_TAP` is 44. The tests after it, which check every press goes through `Tap`, are the meaningful part.
- Filler: a hard-coded count. Examples: "fifteen distinct items" in `shared/adhkar.test.ts`, `toHaveLength(61 + 60 + 28 * 3)` in `shared/tajwid/questions.test.ts`, `toBeGreaterThan(50)` in `shared/quiz/whichSurah.test.ts`, `> 850` pages in `shared/bookReader.test.ts`, `>= 20` in `shared/quran/oneQuranText.test.ts`. The better version: `whichSurah.test.ts` checks `count(whole)` equals the number of distinct ayat asked, which holds whatever the data size.
- Filler: class names, styling, or "it renders". Example: `src/components/common/LoadingDots.test.tsx` checks the classes and that there are three dots. Its "tells screen readers it is loading" check is the part worth keeping.
- Filler: a second test of something another test already covers.
- Not a magic number: a guard's shrink-only baseline. It is the list of known breaks, and it may only get shorter.

## 10. Process and handoffs

- [ ] Plan and sketch first. Visual changes get a sketch in one theme (dark) and wait for the owner's go. Ask before the PR, not through it. Discuss before building a new system, and do not invent a redesign the owner has not settled (for example, do not propose merging the branches and compare pages). (owner 11-11, 11-13, 11-17, AGENTS)
- [ ] You searched [records](records/README.md) before starting and again after a first fix failed. The PR ends with `Records used: R00xx` (or `none`). (AGENTS)
- [ ] One review cycle by a subagent that did not write the code. A second only if the first needed a code or test change. Never a third. (AGENTS)
- [ ] For a bug that came back: say why it happened and what stops it recurring. If the fix would repeat in another feature, bring a one-entry proposal, not a new record. Tell the coordinator about similar places. (R0054, AGENTS)
- [ ] Before resolving: every piece of the approved sketch you handed to another thread was built, and every data piece you built reaches its screen. (owner 11-19)
- [ ] Merge your own PR once the checks and review pass, unless a real open question remains or the owner said he wants to review it. Post dark, phone-size screenshots with the result. (owner 11-10, 11-16, 11-17)
- [ ] After a squash merge, confirm origin/main has the change. Check `git status` before `git add -A`.
- [ ] Open questions go to `/mnt/project-files/compare-refine/open-questions.md`, data doubts to `/mnt/project-files/data-review/review-list.md`, and only the doubtful cases go to the owner. Clear bugs are fixed without asking, and a thread with no open question goes on to its next agreed step. (owner 11-17, 11-18)
- [ ] Owner-facing messages: plain English. Arabic goes in its own line or inline code, never mid-sentence. Surah names inside an English sentence may be transliterated; Quran words in verdicts and reasons are always in Arabic script. Refs are numbers (56:74). If the owner says "still broken" on the phone, ask him to fully reopen Expo Go first. (owner 11-07, 11-08, 11-18)
- [ ] Docs: code is the source of truth, each rule has one home, and ADRs are only for real decisions. No back-compatibility layers before release. (AGENTS, R0004)

## 11. Data work

- [ ] Big jobs are split into batches, each with a written guide and checks, and each reviewed by a second agent. No single agent converts 250+ entries alone. (owner 11-18)
- [ ] While the app has no users, a data batch or change applies without asking the owner once a second agent has checked it against the method; the agent runs `history:approve` itself. Clear duplicates merge without asking. (owner 11-18)
- [ ] Each mutashabih book entry becomes a card (none dropped), read by one agent and rechecked by a second. Heuristics alone are not trusted. (owner 11-18)
- [ ] Branches has two categories: «في كتب المتشابهات» (the books, default) and «تدبّر» (ours). «تكرار» is a tag for a kind of difference, not a category. (owner 11-19)
- [ ] Tree and matrix are one ayat group seen two ways. A small tight tree is the mutashabih and is never hidden under a common-opening tree. (owner 11-12)
- [ ] Cards are judged by meaning (could a reciter slip from one place to the other?), not by length or thresholds. No magic-number rules except clearly huge cases (20+ ayat goes to search only). (owner 11-07, 11-12, 11-18)
- [ ] Every verdict, keep or drop, carries a reason that states the point. A group can be fixed (drop rows, split) instead of kept or dropped. (owner 11-18)
- [ ] Verdict passes: agents judge everything, a second agent rechecks, and the owner sees only the unsure cases, the disagreements and a random sample. Publish only verdicts the owner named. (owner 11-17, 11-18)
- [ ] Owner review pages append a line to a log per click and never rewrite the data files or commit per click. (owner 11-07, 11-08)
- [ ] Data problems are fixed by curating the data, never by a rerun that overwrites curated data. Curate the case rather than bending a general rule to one example. (owner 11-12, 11-15)
- [ ] One representation of each dataset, built ahead of time, with no parallel derived copies. (owner 11-17, 11-18)
- [ ] One model from many books, not the Siyar alone. A person's own birth and death are person fields, not event rows. (owner 11-18)
- [ ] An extraction rebuilds its entry word for word. Each source build is checked against the source and throws on impossible ranges. Arabic is normalized to NFC before matching, and book quotes keep the book's spelling. (AGENTS, R0008, R0043, R0050)
- [ ] A script that writes data files refuses to overwrite an existing slug. (a story file was overwritten, 11-18)
- [ ] When the cloud cannot reach a source, ask the owner to upload the PDF. Do not guess. Outside research prompts ask for word-for-word quotes only.
