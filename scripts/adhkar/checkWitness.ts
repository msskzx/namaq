/**
 * Checks shared/adhkar.ts against the two books themselves, not against our saved excerpts:
 * downloads the page-numbered Turath copies and confirms every shown word, quote, grade, printed page and link.
 * Run with `npm run adhkar:check` after changing the selection. Needs the network, so it is not part of `npm test`.
 */
import { ADHKAR, type AdhkarCitation } from '../../shared/adhkar';

type Book = { pages: { text: string; vol: string; page: number }[] };
const BOOKS = { 'adhkar-nawawi': 1956, 'nataij-afkar': 30108 } as const;

async function book(id: number): Promise<Book> {
  const response = await fetch(`https://files.turath.io/books-v3/${id}.json`);
  if (!response.ok) throw new Error(`Turath ${id}: ${response.status}`);
  return response.json() as Promise<Book>;
}

async function main() {
  const books = { 'adhkar-nawawi': await book(BOOKS['adhkar-nawawi']), 'nataij-afkar': await book(BOOKS['nataij-afkar']) };
  const problems: string[] = [];
  const check = (label: string, citation: AdhkarCitation, ...quotes: (string | undefined)[]) => {
    const index = Number(citation.url.split('/').pop());
    const page = books[citation.source].pages[index - 1];
    if (!page) return void problems.push(`${label}: no witness page ${index}`);
    if (page.page !== citation.page || Number(page.vol) !== citation.volume) {
      problems.push(`${label}: link ${index} is printed ${page.vol}/${page.page}, data says ${citation.volume}/${citation.page}`);
    }
    const text = page.text.replace(/<[^>]+>/g, '');
    for (const quote of quotes) if (quote && !text.includes(quote)) problems.push(`${label}: not on the page: ${quote.slice(0, 60)}`);
  };
  for (const item of ADHKAR) {
    check(item.id, item.citation, item.content.kind === 'text' ? item.content.text : undefined,
      item.occasionQuote, item.repeat?.quote, item.virtueQuote, item.instructionQuote);
    for (const grade of item.grades) check(`${item.id} / ${grade.scholar}`, grade.citation, grade.quote);
  }
  console.log(problems.length ? problems.join('\n') : `All ${ADHKAR.length} items match both books.`);
  process.exitCode = problems.length ? 1 : 0;
}

void main();
