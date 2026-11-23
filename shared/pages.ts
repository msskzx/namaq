/**
 * Every page of the app and the website, side by side (guard proposal 22, R0018: every phone feature also ships on the
 * website). `app` names route files under mobile/src/app, `web` page folders under src/app ('' is the home page). A page
 * on one side only says why with `only`: something a browser cannot do, or a review tool. shared/pages.test.ts checks
 * that every route and page is listed, and that a page missing a side is marked or waits on the shrink-only list.
 */
export type PageEntry = {
  id: string;
  app?: string[];
  web?: string[];
  /** Why the page lives on one side only. */
  only?: { side: 'app' | 'web'; why: 'browser-impossible' | 'review-tool'; note: string };
};

export const PAGES: readonly PageEntry[] = [
  { id: 'home', app: ['(tabs)/(home)/index.tsx'], web: [''] },
  { id: 'search', app: ['(tabs)/(home)/search.tsx'], web: ['search'] },
  { id: 'utilities', app: ['(tabs)/(home)/utilities.tsx'], web: ['utilities'] },
  { id: 'library', app: ['(tabs)/(home)/library.tsx'], web: ['library'] },
  { id: 'ayah', app: ['ayah.tsx'] },
  { id: 'books', app: ['(tabs)/(library)/books.tsx'], web: ['quran/books'] },
  { id: 'book', app: ['(tabs)/(library)/book.tsx'], web: ['quran/books/[id]', 'quran/books/[id]/[page]'] },
  { id: 'hadith', app: ['(tabs)/(hadith)/hadith.tsx'], web: ['hadith'] },
  { id: 'hadith-unit', app: ['(tabs)/(hadith)/hadith-unit.tsx'], web: ['hadith/[unit]'] },
  { id: 'hadith-forty', app: ['(tabs)/(hadith)/hadith-forty.tsx'], web: ['hadith/forty/[n]'] },
  { id: 'hadith-book', app: ['(tabs)/(hadith)/hadith-book.tsx'], web: ['hadith/sahih/[book]', 'hadith/forty'] },
  { id: 'hadith-kitab', app: ['(tabs)/(hadith)/hadith-kitab.tsx'], web: ['hadith/sahih/[book]/kitab/[kitab]'] },
  { id: 'hadith-sahih', app: ['(tabs)/(hadith)/hadith-sahih.tsx'], web: ['hadith/sahih/[book]/[n]'] },
  { id: 'quran', app: ['(tabs)/(quran)/quran.tsx'], web: ['quran'] },
  { id: 'read', app: ['(tabs)/read.tsx'], web: ['quran/read', 'quran/read/[page]', 'quran/read/ayah/[surah]/[ayah]'] },
  { id: 'recite-start', web: ['quran/read/recite'] },
  { id: 'branches', app: ['(tabs)/(quran)/branches.tsx'], web: ['quran/branches'] },
  { id: 'compare', app: ['(tabs)/(quran)/compare.tsx'], web: ['quran/compare'] },
  { id: 'lataif', app: ['(tabs)/(quran)/lataif.tsx', 'scene.tsx'], web: ['quran/lataif'] },
  { id: 'oaths', app: ['(tabs)/(quran)/oaths.tsx'], web: ['quran/oaths'] },
  { id: 'openings', app: ['(tabs)/(quran)/openings.tsx'], web: ['quran/openings'] },
  { id: 'order', app: ['(tabs)/(quran)/order.tsx'], web: ['quran/order'] },
  { id: 'prophets', app: ['(tabs)/(quran)/prophets.tsx'], web: ['quran/prophets'] },
  { id: 'prophet', app: ['prophets/[slug].tsx'], web: ['quran/prophets/[slug]'] },
  { id: 'qiraat', app: ['(tabs)/(quran)/qiraat.tsx'], web: ['quran/qiraat'] },
  { id: 'terms', app: ['(tabs)/(quran)/terms.tsx'], web: ['quran/terms'] },
  { id: 'term', app: ['(tabs)/(quran)/term.tsx'], web: ['quran/terms/[name]'] },
  { id: 'tuhfa', app: ['(tabs)/(quran)/tuhfa.tsx'], web: ['quran/tajwid/tuhfat-al-atfal'] },
  { id: 'words', app: ['(tabs)/(quran)/words.tsx', '(tabs)/(quran)/word.tsx'], web: ['quran/words'] },
  { id: 'tarajim', app: ['(tabs)/(tarajim)/tarajim.tsx'], web: ['biographies'] },
  { id: 'people', app: ['(tabs)/(tarajim)/people.tsx'], web: ['people'] },
  { id: 'person', app: ['(tabs)/(tarajim)/person.tsx'], web: ['people/[slug]'] },
  { id: 'life', app: ['(tabs)/(tarajim)/life.tsx'], web: ['life', 'people/[slug]/life'] },
  { id: 'nasab', app: ['(tabs)/(tarajim)/nasab.tsx'], web: ['people/[slug]/nasab', 'nasab'] },
  { id: 'ties', app: ['(tabs)/(tarajim)/ties.tsx'], web: ['people/[slug]/ties'] },
  { id: 'between', app: ['(tabs)/(tarajim)/between.tsx'], web: ['between', 'graphs'] },
  { id: 'battles', app: ['(tabs)/(tarajim)/battles.tsx'], web: ['battles'] },
  { id: 'battle', app: ['(tabs)/(tarajim)/battle.tsx'], web: ['battles/[slug]'] },
  // Phone only while the website is paused (owner, 2026-11-23); ported with the other phone pages later.
  { id: 'atlas', app: ['(tabs)/(tarajim)/atlas.tsx'] },
  { id: 'stories', app: ['(tabs)/(tarajim)/stories.tsx'], web: ['stories'] },
  { id: 'story', app: ['(tabs)/(tarajim)/story.tsx'], web: ['stories/[slug]'] },
  { id: 'events', web: ['events', 'events/[slug]'] },
  { id: 'titles', web: ['titles'] },
  { id: 'quizzes', app: ['(tabs)/quizzes.tsx', 'quiz/solo.tsx', 'quiz/play.tsx'], web: ['quizzes'] },
  { id: 'party', app: ['quiz/party/index.tsx'], web: ['quizzes/party'] },
  { id: 'party-room', app: ['quiz/party/[code].tsx'], web: ['quizzes/party/[code]'] },
  { id: 'cards-review', web: ['quran/cards-review'], only: { side: 'web', why: 'review-tool', note: 'the owner\'s review of every tree and compare card' } },
  { id: 'question-bank', web: ['quizzes/questions'], only: { side: 'web', why: 'review-tool', note: 'the owner\'s review of the question bank' } },
  { id: 'tree-sizes', app: ['tree-sizes.tsx'], only: { side: 'app', why: 'review-tool', note: 'a measuring tool for scripts, not a screen people open' } },
  { id: 'sources', web: ['sources', 'sources/[slug]'] },
  { id: 'about', app: ['about.tsx'], web: ['about'] },
  { id: 'attributions', app: ['attributions.tsx'], web: ['attributions'] },
  { id: 'privacy', app: ['privacy.tsx'], web: ['privacy'] },
];
