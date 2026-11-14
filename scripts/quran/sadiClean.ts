// docs/plans/sadi-tafsir.md: turns one page piece of Quranpedia's al-Sa'di dump into plain text. Quran quotes keep their
// ﴿…﴾ marks, which is how the readers find them; everything the modern edition added on the page goes.

/** The book's own pages run from al-Fatiha (39) to an-Nas (937); the dump hangs the front and back matter on 114:1. */
export const FIRST_PAGE = 39;
export const LAST_PAGE = 937;

// The heading the next surah opens with ("تفسير سورة الفيل / وهي مكية"), which the dump appends to the page piece
// before it. It sits after a line break, a centred line or at the start, never after "تم" (the author's closing).
const NEXT_HEADING = /(?:^|<br\s*\/?>|<\/p>)\s*(?:<p class="text-center">بسم الله الرحمن الرحيم<\/p>)?\s*(?:<strong>)?تفسير (?:سورة|الفاتحة)(?:(?!\{|﴿|<span)[\s\S])*$/;
// A surah's own heading before its first range marker ("تفسير سورة المائدة / وهي مدنية / {١} …").
const OWN_HEADING = /^\s*(?:<strong>)?تفسير (?:سورة|الفاتحة)[^{﴿]*(?=\{)/;

/** The edition's footnotes and the marks that point to them in the prose; a numbered line of the author's own stays. */
const FOOTNOTES = /<div class="foot-notes">[\s\S]*?(?:<\/div>|$)/g;
const MARKS = /(?<!<br \/>\s*)[ \u00a0]*\([٠-٩]+\)/g;

export function cleanPiece(html: string): string {
  let text = html.replace(/\r/g, '').replace(FOOTNOTES, '').replace(MARKS, '');
  text = text.replace(/-\[[٠-٩]+\]-/g, '');
  text = text.replace(NEXT_HEADING, '').replace(OWN_HEADING, '');
  text = text
    .replace(/<\/td>\s*<td>/g, ' … ')
    .replace(/<br\s*\/?>|<\/?(?:p|h3|tr|table)\b[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, '');
  return text.replace(/[ \t\u00a0]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').trim();
}

/**
 * Page pieces of one passage, joined: a piece that breaks mid-sentence carries on after a space. A few quotes come in
 * plain braces; they get the Quran marks like the rest. Braces round digits are the edition's range markers.
 */
export const joinPieces = (pieces: string[]) => pieces.filter(Boolean).join(' ')
  .replace(/ *\n */g, '\n')
  .replace(/\{([^{}٠-٩]+)\}/g, '﴿$1﴾');
