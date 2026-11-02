import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { surahList } from '@/lib/quran/surahList';
import { branchesHref, piecesHolding, textHolds, textIs, type BranchAyah, type BranchesView, type Opening } from '@/lib/quran/branches';
import { searchQuery } from '@/lib/quran/searchText';
import { inJuzRange, parseJuzRange, type JuzRange } from '@/lib/quran/juz';
import { parseOccurrences, resolveTree, scopeTree, subtreeLinks as subtreeLinksFor } from '@/lib/quran/branchTreeLinks';
import { buildPhraseGroups, buildTreeGroups, phrasePresentation, phraseSubtreeTargets, type TreeGroup } from '@/lib/quran/phraseTrees';
import { subtreeIndex, type Subtree } from '@/lib/quran/subtrees';
import treeData from './trees.json';
import BranchTree from './BranchTree';
import TreeSteps, { TreeMode } from './TreeSteps';
import BranchHeading, { MatchingRules } from './BranchHeading';
import AyahCards, { CardsLegend } from './AyahCards';
import OpeningSearch, { UnavailableNote } from './OpeningSearch';
import { NavActions, NavButtons } from '@/components/common/NavBar';
import NavSearch from '@/components/common/NavSearch';
import { AroundButton } from './Surroundings';
import { CardActions, FilterButton, NoTrees, SurahChip } from './Filters';
import { PathScope } from './Paths';
import PreloadQuranText from '@/components/quran/PreloadQuranText';
import styles from '@/components/common/PaperPage.module.css';

const SEARCHES = 50;

export const metadata: Metadata = { title: 'متشابهات القرآن' };

const source = treeData as { ayat: BranchAyah[]; trees: TreeGroup[]; subtrees: Subtree[] };
const views = new Map<string, ReturnType<typeof build>>();

function build(range: JuzRange | null) {
  const ayat = range ? source.ayat.filter(ayah => inJuzRange(ayah.key, range)) : source.ayat;
  const trees = range ? buildTreeGroups(ayat) : source.trees;
  const subtrees = range ? undefined : subtreeIndex(source.trees, source.subtrees);
  return { ayat, byKey: new Map(ayat.map(ayah => [ayah.key, ayah])), trees, subtrees, phrases: undefined as ReturnType<typeof buildPhraseGroups> | undefined, pieces: undefined as SharedPiece[] | undefined, searchable: undefined as SharedPiece[] | undefined, searches: new Map<string, SharedPiece[]>(), surahCounts: undefined as Record<number, number> | undefined };
}

type SharedPiece = Opening & { keys: string[]; phrase: TreeGroup; opening: Opening };

const surahOf = (key: string) => Number(key.split(':')[0]);

function countSurahs(pieces: SharedPiece[]) {
  const counts: Record<number, number> = {};
  pieces.forEach(piece => new Set(piece.keys.map(surahOf)).forEach(number => { counts[number] = (counts[number] ?? 0) + 1; }));
  return counts;
}

function toPieces(trees: TreeGroup[]): SharedPiece[] {
  return trees.map(tree => {
    const keys = [...new Set(tree.occurrences.map(occurrence => occurrence.key))];
    return { id: tree.id, text: tree.text, count: keys.length, opening: { id: tree.id, text: tree.text, textEn: tree.textEn, aliases: tree.aliases, count: keys.length }, keys, phrase: tree };
  });
}

const piecesFor = (built: ReturnType<typeof build>) => built.pieces ??= toPieces(built.trees);
const searchableFor = (built: ReturnType<typeof build>) => built.searchable ??= [...piecesFor(built), ...toPieces(built.subtrees?.groups ?? [])];

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
  const requestedOccurrences = parseOccurrences(first(params.at));
  const subtree = built.subtrees?.byId.get(requestedId);
  const subtreeHolds = subtree && requestedOccurrences.every(entry => subtree.occurrences.some(occurrence => entry.startsWith(`${occurrence.key}:`)));
  const resolved: TreeGroup | undefined = (subtreeHolds ? subtree : undefined) ?? resolveTree<TreeGroup>(requestedId, built.trees, () => built.phrases ??= buildPhraseGroups(built.ayat));
  const id = resolved?.id ?? requestedId;
  const query = (first(params.q) ?? '').trim();
  const picked = Number(first(params.s));
  const surah = Number.isInteger(picked) && picked >= 1 && picked <= 114 ? picked : undefined;
  const savedIds = (first(params.b) ?? '').split('|').filter(Boolean);
  const state: BranchesView = { occurrences: requestedOccurrences.length ? requestedOccurrences : undefined, query: query || undefined, surah, mode: params.m === 'cards' ? 'cards' : undefined, saved: savedIds.length ? savedIds : undefined };
  // The list view is gone: search results and surahs are swiped through as trees.
  if (id !== requestedId || params.m === 'list' || params.p || params.c || params.scope || params.kind || params.v || params.g || params.w || params.r || params.apply === 'juz') redirect(branchesHref(id, juz, state));
  const pieces = piecesFor(built);
  const needle = query ? (/[a-z]/i.test(query) ? query.toLowerCase() : JSON.stringify(searchQuery(query))) : '';
  if (needle && !built.searches.has(needle)) {
    if (built.searches.size >= SEARCHES) built.searches.delete(built.searches.keys().next().value!);
    built.searches.set(needle, piecesHolding(searchableFor(built), query));
  }
  const searched = needle ? built.searches.get(needle)! : pieces;
  // The saved-only switch: the trees bookmarked in this browser, newest first, sent in the address.
  const savedSet = savedIds.length ? new Map(searchableFor(built).map(piece => [piece.id, piece])) : undefined;
  const found = savedSet ? (needle ? searched.filter(piece => savedIds.includes(piece.id)) : savedIds.flatMap(saved => savedSet.get(saved) ?? [])) : searched;
  const cut = surah ? found.filter(piece => piece.keys.some(key => surahOf(key) === surah)) : found;
  const opening = query ? cut.find(piece => textIs(piece.text, query)) ?? cut[0] : cut[0];
  if (!id && opening) redirect(branchesHref(opening.id, juz, { query: state.query, surah, mode: state.mode, saved: state.saved }));
  const scoped = scopeTree(resolved, requestedOccurrences);
  const treeGroup = scoped && new Set(scoped.occurrences.map(occurrence => occurrence.key)).size >= 2 ? scoped : undefined;
  const unavailable = !!id && !treeGroup;
  const drawn = treeGroup ? [...new Set(treeGroup.occurrences.map(occurrence => occurrence.key))].map(key => built.byKey.get(key)!) : [];
  const presentation = treeGroup ? phrasePresentation(treeGroup, built.ayat, true, !range) : undefined;
  const tree = presentation?.tree ?? null;
  const subtreeLinks = tree && treeGroup ? subtreeLinksFor(treeGroup, tree, juz, phraseSubtreeTargets(tree, built.phrases ??= buildPhraseGroups(built.ayat), built.ayat), false, built.subtrees?.idsFor(treeGroup)) : undefined;
  const holding = tree && query ? drawn.filter(ayah => textHolds(ayah.words.join(' '), query)).map(ayah => ayah.key) : [];
  const marked = holding.length < drawn.length ? holding : [];
  const treeView = { ...state, query: undefined, surah: undefined, mode: undefined, saved: undefined };
  const cards = !!tree && state.mode === 'cards';
  const parent = built.subtrees?.byId.get(id)?.parent;
  const position = tree ? cut.findIndex(piece => piece.id === id || piece.id === parent) : -1;
  const stepTo = (index: number, card?: 'last') => cut[index] && branchesHref(cut[index].id, juz, { query: state.query, surah, mode: state.mode, saved: state.saved, card });
  const steps = position < 0 ? undefined : { previous: stepTo(position - 1, 'last'), next: stepTo(position + 1), position: position + 1, total: cut.length };
  const neighbourAt = (index: number) => {
    const phrase = steps && !cards && cut[index]?.phrase;
    return phrase ? phrasePresentation(phrase, built.ayat, true, !range) : undefined;
  };
  const neighbours = { previous: steps?.previous ? neighbourAt(position - 1) : undefined, next: steps?.next ? neighbourAt(position + 1) : undefined };
  const allSurahs = await surahList();
  const names = Object.fromEntries(allSurahs.map(row => [row.number, row.name]));
  const surahCounts = built.surahCounts ??= countSurahs(pieces);
  const surahs = allSurahs.filter(row => surahCounts[row.number]).map(row => ({ number: row.number, name: row.name, count: surahCounts[row.number] }));
  const switchTo = id && branchesHref(id, juz, { ...state, mode: cards ? undefined : 'cards' });
  const neighbourCard = (neighbour: typeof neighbours.next) => neighbour && <BranchTree tree={neighbour.tree} prefixes={neighbour.prefixes} offsets={neighbour.offsets} names={names} juz={range} view={treeView} surround={{ on: false }} />;

  return (
    <div id="quran-branches" dir="rtl" className={`${styles.page} w-full max-w-6xl mx-auto px-4 py-8 max-sm:py-3 [--tree-chrome:20rem] max-sm:[--tree-chrome:15rem] flex flex-col gap-3 overflow-x-clip`}>
      <PreloadQuranText />
      <BranchHeading />
      {/* The search box and the filter live in the site's top bar; the page's buttons in the side rail (the top bar on phones). */}
      <NavActions>
        <NavSearch>
          <OpeningSearch key={query} query={query} surahs={surahs} top={[]} current={id} juz={range} view={{ ...treeView, mode: state.mode, query: state.query, surah, saved: state.saved }} />
        </NavSearch>
        <FilterButton range={range} view={state} />
      </NavActions>
      <NavButtons>
        {switchTo && <TreeMode to={cards ? 'tree' : 'cards'} href={switchTo} />}
        <AroundButton />
      </NavButtons>
      <NavButtons bottom>
        <MatchingRules>{cards && <CardsLegend />}</MatchingRules>
      </NavButtons>
      {surah && names[surah] && <SurahChip surah={names[surah]} clear={branchesHref(id, juz, { query: state.query, mode: state.mode, saved: state.saved })} />}
      {!id && <NoTrees query={query} />}
      {unavailable && <UnavailableNote />}
      <PathScope key={marked.join(' ')} lit={marked}>
        {cards ? <AyahCards key={`${id}:${requestedOccurrences.join(',')}:${range?.from}-${range?.to}`} ayahKeys={drawn.map(ayah => ayah.key)} names={names} steps={steps} />
          : tree && <BranchTree key={`${id}:${requestedOccurrences.join(',')}:${range?.from}-${range?.to}`} tree={tree} prefixes={presentation?.prefixes} offsets={presentation?.offsets} subtreeLinks={subtreeLinks} names={names} juz={range} view={treeView} viewportHeight="clamp(18rem, calc(100svh - var(--tree-chrome)), 36rem)" header={steps && <TreeSteps steps={steps} />} surround={{ on: false, sync: true }} steppable={{ next: !!steps?.next, previous: !!steps?.previous, nextCard: neighbourCard(neighbours.next), previousCard: neighbourCard(neighbours.previous) }} label="شجرة العبارات المشتركة" />}
      </PathScope>
      {treeGroup && <CardActions id={id} text={treeGroup.text} />}
    </div>
  );
}
