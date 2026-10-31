import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ayahEnds, branchesHref, keys, listPage, searchKey, searchPhrases, type BranchAyah, type BranchesView, type Opening } from '@/lib/quran/branches';
import { inJuzRange, parseJuzRange, type JuzRange } from '@/lib/quran/juz';
import { loadReaderAyat, surrounding } from '@/lib/quran/ayahContext';
import { buildPhraseGroups, buildTreeGroups, phrasePresentation, phraseSubtreeTargets, type TreeGroup } from '@/lib/quran/phraseTrees';
import treeData from './trees.json';
import BranchTree from './BranchTree';
import JuzFilter from './JuzFilter';
import Pagination from '@/components/common/Pagination';
import PieceList, { type SharedPiece } from './PieceList';
import BranchHeading from './BranchHeading';
import OpeningSearch from './OpeningSearch';
import SearchSummary from './SearchSummary';
import SurahPane from './SurahPane';
import { PathScope } from './Paths';
import CompareLayout from '../compare/CompareLayout';
import styles from '@/components/common/PaperPage.module.css';

const PER_PAGE = 10;
const SEARCHES = 50;

export const metadata: Metadata = { title: 'متشابهات القرآن' };

const source = treeData as { ayat: BranchAyah[]; trees: TreeGroup[] };
const views = new Map<string, ReturnType<typeof build>>();

function build(range: JuzRange | null) {
  const ayat = range ? source.ayat.filter(ayah => inJuzRange(ayah.key, range)) : source.ayat;
  const trees = range ? buildTreeGroups(ayat) : source.trees;
  return { ayat, byKey: new Map(ayat.map(ayah => [ayah.key, ayah])), trees, phrases: undefined as ReturnType<typeof buildPhraseGroups> | undefined, pieces: undefined as SharedPiece[] | undefined, searches: new Map<string, SharedPiece[]>() };
}

function piecesFor(built: ReturnType<typeof build>) {
  return built.pieces ??= built.trees.map(tree => {
    const keys = [...new Set(tree.occurrences.map(occurrence => occurrence.key))];
    return {
      id: tree.id,
      text: tree.text,
      count: keys.length,
      shared: tree.occurrences[0].end - tree.occurrences[0].start,
      opening: { id: tree.id, text: tree.text, textEn: tree.textEn, aliases: tree.aliases, count: keys.length },
      keys,
      phrase: tree,
      family: tree.family,
    };
  });
}

function view(range: JuzRange | null) {
  const key = range ? `${range.from}-${range.to}` : '';
  if (!views.has(key)) views.set(key, build(range));
  return views.get(key)!;
}

const first = (value: string | string[] | undefined) => typeof value === 'string' ? value : null;

export default async function QuranBranchesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const range = parseJuzRange(first(params.juzFrom), first(params.juzTo));
  const juz = range ?? undefined;
  const requestedId = first(params.o) ?? '';
  const built = view(range);
  const requestedKey = searchKey(requestedId);
  const withoutConjunction = /^[وف]/.test(requestedKey) ? requestedKey.slice(1) : requestedKey;
  const candidates = requestedId && !built.trees.some(tree => tree.id === requestedId) ? [...built.trees, ...(built.phrases ??= buildPhraseGroups(built.ayat))] : built.trees;
  const resolved = candidates.find(tree => tree.id === requestedId) ?? candidates
    .filter(tree => tree.id.startsWith(`${requestedKey} `) || tree.id === withoutConjunction || tree.id.startsWith(`${withoutConjunction} `))
    .sort((a, b) => new Set(b.occurrences.map(occurrence => occurrence.key)).size - new Set(a.occurrences.map(occurrence => occurrence.key)).size)[0];
  const id = resolved?.id ?? requestedId;
  const requestedOccurrences = first(params.at)?.split(',').filter(value => /^\d+:\d+:\d+$/.test(value)) ?? [];
  const query = id ? '' : (first(params.q) ?? '').trim();
  const picked = Number(first(params.s));
  const surah = !id && Number.isInteger(picked) && picked >= 1 && picked <= 114 ? picked : undefined;
  const state: BranchesView = { occurrences: requestedOccurrences.length ? requestedOccurrences : undefined, page: Number(first(params.p)) || 1, context: params.c === '1', query: query || undefined, surah };
  if (id !== requestedId || params.scope || params.kind || params.v || params.g || params.w || params.r || params.apply === 'juz') redirect(branchesHref(id, juz, state));
  const pieces = piecesFor(built);
  const needle = searchKey(query);
  if (needle && !built.searches.has(needle)) {
    if (built.searches.size >= SEARCHES) built.searches.delete(built.searches.keys().next().value!);
    const bareNeedle = /^[وف]/.test(needle) ? needle.slice(1) : needle;
    built.searches.set(needle, pieces.filter(piece => searchPhrases([piece.opening, piece], query).length > 0 || searchKey(piece.text).includes(bareNeedle)));
  }
  const found = needle ? built.searches.get(needle)! : pieces;
  const surahOf = (key: string) => Number(key.split(':')[0]);
  const counts: Record<number, number> = {};
  found.forEach(piece => new Set(piece.keys.map(surahOf)).forEach(number => { counts[number] = (counts[number] ?? 0) + 1; }));
  const cut = surah ? found.filter(piece => piece.keys.some(key => surahOf(key) === surah)) : found;
  const selected = resolved;
  const scoped = selected && requestedOccurrences.length ? { ...selected, occurrences: selected.occurrences.filter(occurrence => requestedOccurrences.includes(`${occurrence.key}:${occurrence.start}`)) } : selected;
  const treeGroup = scoped && new Set(scoped.occurrences.map(occurrence => occurrence.key)).size >= 2 ? scoped : undefined;
  const unavailable = !!id && !treeGroup;
  const drawn = treeGroup ? [...new Set(treeGroup.occurrences.map(occurrence => occurrence.key))].map(key => built.byKey.get(key)!) : [];
  const presentation = treeGroup ? phrasePresentation(treeGroup, built.ayat, true, !range) : undefined;
  const tree = presentation?.tree ?? null;
  const subtreeLinks = tree ? Object.fromEntries(Object.entries(phraseSubtreeTargets(tree, built.phrases ??= buildPhraseGroups(built.ayat), built.ayat)).map(([node, target]) => [node, branchesHref(target.id, juz, { occurrences: target.occurrences.map(occurrence => `${occurrence.key}:${occurrence.start}`) })])) : undefined;
  const position = tree ? built.trees.findIndex(candidate => candidate.id === id) : -1;
  const stepTo = (index: number) => built.trees[index] && branchesHref(built.trees[index].id, juz, { context: state.context });
  const steps = position < 0 ? undefined : { previous: stepTo(position - 1), next: stepTo(position + 1), position: position + 1, total: built.trees.length };
  const around = tree && state.context ? surrounding(await loadReaderAyat(), keys(tree), [...new Set(Object.values(ayahEnds(tree)))]) : undefined;
  const exact: Opening[] = needle ? built.trees.filter(candidate => [candidate.id, candidate.text, candidate.textEn ?? ''].some(text => searchKey(text) === needle)).map(candidate => ({ id: candidate.id, text: candidate.text, textEn: candidate.textEn, count: new Set(candidate.occurrences.map(occurrence => occurrence.key)).size })) : [];
  const { page, pageCount } = listPage(first(params.p), id ? Number.MAX_SAFE_INTEGER : cut.length, PER_PAGE);
  state.page = page;
  const numbers = id ? [...new Set(drawn.flatMap(ayah => {
    const number = surahOf(ayah.key);
    return [number === 1 ? 114 : number - 1, number, number === 114 ? 1 : number + 1];
  }))] : undefined;
  const rows = await prisma.surah.findMany({ where: numbers ? { number: { in: numbers } } : undefined, select: { number: true, name: true } });
  const names = Object.fromEntries(rows.map(row => [row.number, row.name]));
  const ayatBySurah: Record<number, number> = {};
  drawn.forEach(ayah => { ayatBySurah[surahOf(ayah.key)] = (ayatBySurah[surahOf(ayah.key)] ?? 0) + 1; });
  const shown = cut.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const shownAyat = new Map(shown.flatMap(piece => piece.keys.map(key => [key, built.byKey.get(key)!] as const)));
  const Scope = id ? PathScope : 'div';

  return (
    <div id="quran-branches" dir="rtl" className={`${styles.page} w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-4`}>
      <BranchHeading />
      <OpeningSearch key={query} query={query} top={built.trees.slice(0, 8).map(tree => ({ id: tree.id, text: tree.text, textEn: tree.textEn, count: new Set(tree.occurrences.map(occurrence => occurrence.key)).size }))} phrases={built.trees.map(tree => ({ id: tree.id, text: tree.text, textEn: tree.textEn, aliases: tree.aliases, count: new Set(tree.occurrences.map(occurrence => occurrence.key)).size }))} phraseCount={built.trees.length} current={id} juz={range} unavailable={unavailable} view={state} />
      <Scope>
        <CompareLayout title="السور" current={id ? 'سور هذه الشجرة' : surah ? names[surah] : 'كل السور'} change="اختر سورة" storageKey="branches-pane-hidden"
          pane={<SurahPane key="pane" counts={id ? ayatBySurah : counts} total={id ? drawn.length : found.length} names={names} surah={surah} juz={range} view={state} inTree={!!id} treeKeys={drawn.map(ayah => ayah.key)} />}>
          {!id ? <>
            <JuzFilter range={range} phrase={id} view={state} />
            {needle && <SearchSummary query={query} count={cut.length} complete={exact.map(phrase => ({ phrase, href: branchesHref(phrase.id, juz) }))} />}
            {(!needle || cut.length > 0) && <PieceList pieces={shown} ayat={shownAyat} names={names} juz={range} view={state} />}
            <Pagination iconFamily="lucide" scrollTarget="quran-branches" page={page} pageCount={pageCount} hrefs={Array.from({ length: pageCount }, (_, index) => branchesHref('', juz, { query, surah, page: index + 1 }))} />
          </> : <>
            <JuzFilter range={range} phrase={id} view={state} />
            {tree && <BranchTree key={`${id}:${requestedOccurrences.join(',')}:${range?.from}-${range?.to}:${state.context}`} tree={tree} prefixes={presentation?.prefixes} offsets={presentation?.offsets} subtreeLinks={subtreeLinks} names={names} juz={range} view={state} surround={{ on: !!state.context, sync: true, data: around }} steps={steps} label="شجرة العبارات المشتركة" />}
          </>}
        </CompareLayout>
      </Scope>
    </div>
  );
}
