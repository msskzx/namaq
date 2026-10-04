// docs/adr/0021-a-span-selects-text-by-quote.md
export interface Span {
  exact: string;
  prefix?: string;
  suffix?: string;
}

const FOOTNOTE = /\(\s*[٠-٩0-9]+\s*\)/g;
const MIN_EXACT = 12;
const NOT_LETTER = /[^\p{L}]/gu;

function fold(text: string) {
  const dropped = new Array<boolean>(text.length).fill(false);
  for (const m of text.matchAll(FOOTNOTE)) {
    dropped.fill(true, m.index, m.index + m[0].length);
  }
  let out = '';
  const at: number[] = [];
  for (let i = 0; i < text.length; i += 1) {
    if (dropped[i] || /\s/.test(text[i])) {
      if (out && !out.endsWith(' ')) {
        out += ' ';
        at.push(i);
      }
    } else {
      out += text[i];
      at.push(i);
    }
  }
  return { text: out.trimEnd(), at };
}

export function matchForm(text: string) {
  return fold(text).text;
}

export function resolveSpan(body: string, { exact, prefix = '', suffix = '' }: Span) {
  const { text, at } = fold(body);
  const needle = matchForm(exact);
  const before = matchForm(prefix);
  const after = matchForm(suffix);
  if (!needle) throw new Error('span has an empty quote');
  if (needle.replace(NOT_LETTER, '').length < MIN_EXACT && !before && !after) {
    throw new Error(`a quote under ${MIN_EXACT} letters needs a prefix or suffix: "${needle}"`);
  }
  const hits: number[] = [];
  for (let i = text.indexOf(needle); i !== -1; i = text.indexOf(needle, i + 1)) {
    const head = text.slice(0, i).trimEnd();
    const tail = text.slice(i + needle.length).trimStart();
    if (head.endsWith(before) && tail.startsWith(after)) hits.push(i);
  }
  if (hits.length !== 1) {
    throw new Error(`span resolves ${hits.length} times, expected exactly one: "${needle}"`);
  }
  return { start: at[hits[0]], end: at[hits[0] + needle.length - 1] + 1 };
}

export function renderSpan(body: string, span: Span) {
  const { start, end } = resolveSpan(body, span);
  return matchForm(body.slice(start, end));
}
