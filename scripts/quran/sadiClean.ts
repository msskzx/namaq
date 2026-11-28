// see docs/plans/sadi-tafsir.md

export const FIRST_PAGE = 39;
export const LAST_PAGE = 937;

const NEXT_HEADING = /(?:^|<br\s*\/?>|<\/p>)\s*(?:<p class="text-center">بسم الله الرحمن الرحيم<\/p>)?\s*(?:<strong>)?تفسير (?:سورة|الفاتحة)(?:(?!\{|﴿|<span)[\s\S])*$/;
const OWN_HEADING = /^\s*(?:<strong>)?تفسير (?:سورة|الفاتحة)[^{﴿]*(?=\{)/;

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

export const joinPieces = (pieces: string[]) => pieces.filter(Boolean).join(' ')
  .replace(/ *\n */g, '\n')
  .replace(/\{([^{}٠-٩]+)\}/g, '﴿$1﴾');
