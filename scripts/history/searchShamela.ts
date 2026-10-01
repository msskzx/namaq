import { JSDOM } from 'jsdom';

// فهرس الموضوعات page ids for كتاب سير أعلام النبلاء (book 10906).
// See docs/plans/unfinished-worktree-work.md.
const tocPages = [1431, 1985, 2300, 2614, 2806, 2849, 3084, 3158];

const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function fetchPage(bookId: string, pageId: number) {
  const url = `https://shamela.ws/book/${bookId}/${pageId}`;
  const response = await fetch(url, { headers: { 'User-Agent': userAgent } });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  const text = new JSDOM(await response.text()).window.document.body.textContent ?? '';
  return { url, text };
}

async function main() {
  const book = option('book') ?? '10906';
  const queries = process.argv
    .slice(2)
    .filter((arg, i, argv) => !arg.startsWith('--') && argv[i - 1] !== '--book');
  if (queries.length === 0) {
    throw new Error('usage: npm run history:search -- <term> [<term> ...] [--book <id>]');
  }

  for (const pageId of tocPages) {
    const { url, text } = await fetchPage(book, pageId);
    for (const query of queries) {
      let index = 0;
      while ((index = text.indexOf(query, index)) !== -1) {
        const start = Math.max(0, index - 100);
        const end = Math.min(text.length, index + 100);
        console.log(`\n=== ${url} :: "${query}" ===`);
        console.log(text.slice(start, end).replace(/\s+/g, ' '));
        index += query.length;
      }
    }
  }
  console.log('\nDone.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
