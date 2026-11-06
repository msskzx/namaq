import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { BRANCH_VIEW_COOKIE, BRANCH_CONNECTORS_COOKIE, parseBranchView } from '@/lib/quran/branchView';
import { redirect } from 'next/navigation';
import { surahList } from '@/lib/quran/surahList';
import { ayahEnds, branchesHref, piecesHolding, textHolds, textIs, type BranchAyah, type BranchesView, type Opening } from '@/lib/quran/branches';
import { searchQuery } from '@/lib/quran/searchText';
import { inJuzRange, parseJuzRange, type JuzRange } from '@/lib/quran/juz';
import { parseOccurrences, resolveTree, scopeTree, subtreeLinks as subtreeLinksFor } from '@/lib/quran/branchTreeLinks';
import { buildPhraseGroups, buildTreeGroups, phrasePresentation, phraseSubtreeTargets, type TreeGroup } from '@/lib/quran/phraseTrees';
import { subtreeIndex, type Subtree } from '@/lib/quran/subtrees';
import treeData from './trees.json';
import BranchTree from './BranchTree';
import TreeSteps, { TreeMode, TreeProgress } from './TreeSteps';
import BranchHeading, { MatchingRules } from './BranchHeading';
import { GroupConnections } from './GroupConnections';
import { GroupDetails } from './GroupDetails';
import { browseGroups, filteredAyat, groupFilters, hasGroupFilters } from '@/lib/quran/mutashabih/browse';
import type { Group } from '@/lib/quran/mutashabih/types';
import { groupPresentation } from '@/lib/quran/mutashabih/presentation';
import { groups } from '@/lib/quran/mutashabih/data';
import AyahCards, { CardsLegend } from './AyahCards';
import OpeningSearch, { UnavailableNote } from './OpeningSearch';
import { NavActions, NavButtons } from '@/components/common/NavBar';
import NavSearch from '@/components/common/NavSearch';
import { AroundButton, RotateButton } from './Surroundings';
import { CardActions, DoubleTapSave, FilterButton, NoTrees, SurahChip } from './Filters';
import { PathScope } from './Paths';
import PreloadQuranText from '@/components/quran/PreloadQuranText';
import styles from '@/components/common/PaperPage.module.css';

const SEARCHES = 50;

export const metadata: Metadata = { title: 'متشابهات القرآن' };

const source = treeData as { ayat: BranchAyah[]; trees: TreeGroup[]; subtrees: Subtree[] };
const groupsById = new Map(groups.map(group => [group.id, group]));
const allAyat = new Map(source.ayat.map(ayah => [ayah.key, ayah]));
const positions = new Map(source.ayat.map((ayah, i) => [ayah.key, i]));
const groupsByAyah = new Map<string, Group>();
for (const group of groups) for (const place of group.places) {
  const existing = groupsByAyah.get(place.key);
  if (!existing || group.citations.length > existing.citations.length) groupsByAyah.set(place.key, group);
}
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
  const filters = groupFilters(params);
  const range = parseJuzRange(first(params.juzFrom), first(params.juzTo));
  const juz = range ?? undefined;
  const requestedId = first(params.o) ?? '';
  const built = view(range);
  const requestedOccurrences = parseOccurrences(first(params.at));
  const subtree = built.subtrees?.byId.get(requestedId);
  const subtreeHolds = subtree && requestedOccurrences.every(entry => subtree.occurrences.some(occurrence => entry.startsWith(`${occurrence.key}:`)));
  const visibleAyat = filteredAyat(allAyat, filters, range);
  const withinScope = (key: string) => visibleAyat.has(key);
  const matchingGroups = browseGroups(groups, filters, allAyat, range);
  const requestedGroup = matchingGroups.find(group => group.id === requestedId) ?? groupsById.get(requestedId);
  const resolved: TreeGroup | undefined = requestedGroup?.tree ?? (subtreeHolds ? subtree : undefined) ?? resolveTree<TreeGroup>(requestedId, built.trees, () => built.phrases ??= buildPhraseGroups(built.ayat));
  const id = requestedGroup?.id ?? resolved?.id ?? requestedId;
  const query = (first(params.q) ?? '').trim();
  const picked = Number(first(params.s));
  const surah = Number.isInteger(picked) && picked >= 1 && picked <= 114 ? picked : undefined;
  const savedIds = (first(params.b) ?? '').split('|').filter(Boolean);
  const settings = await cookies();
  const defaultConnections = settings.get(BRANCH_CONNECTORS_COOKIE)?.value === 'on';
  const explicitMode = parseBranchView(first(params.m));
  const preferredMode = explicitMode ? undefined : parseBranchView(settings.get(BRANCH_VIEW_COOKIE)?.value);
  const mode = explicitMode ?? (preferredMode === 'cards' ? 'cards' : undefined);
  const state: BranchesView = { occurrences: requestedOccurrences.length ? requestedOccurrences : undefined, query: query || undefined, surah, mode, filters, saved: savedIds.length ? savedIds : undefined };
  if (resolved?.family && query && !textIs(resolved.text, query)) redirect(branchesHref(id, juz, { ...state, query: resolved.text }));
  // The list view is gone: search results and surahs are swiped through as trees.
  if (id !== requestedId || params.m === 'list' || params.p || params.c || params.scope || params.kind || params.v || params.g || params.w || params.r || params.apply === 'juz') redirect(branchesHref(id, juz, state));
  const groupPieces = toPieces(matchingGroups.map(group => ({ ...group.tree, id: group.id })));
  const legacy = searchableFor(built);
  const pieces = requestedId && !requestedGroup && !hasGroupFilters(filters) ? toPieces(built.trees) : groupPieces;
  const needle = query ? JSON.stringify([/[a-z]/i.test(query) ? query.toLowerCase() : searchQuery(query), filters]) : '';
  if (needle && !built.searches.has(needle)) {
    if (built.searches.size >= SEARCHES) built.searches.delete(built.searches.keys().next().value!);
    built.searches.set(needle, piecesHolding([...groupPieces, ...(hasGroupFilters(filters) ? [] : legacy)], query));
  }
  const searched = needle ? built.searches.get(needle)! : pieces;
  // The saved-only switch: the trees bookmarked in this browser, newest first, sent in the address.
  const savedSet = savedIds.length ? new Map([...pieces, ...(hasGroupFilters(filters) ? [] : legacy)].map(piece => [piece.id, piece])) : undefined;
  const found = savedSet ? (needle ? searched.filter(piece => savedIds.includes(piece.id)) : savedIds.flatMap(saved => savedSet.get(saved) ?? [])) : searched;
  const cut = surah ? found.filter(piece => piece.keys.some(key => surahOf(key) === surah)) : found;
  const opening = query ? cut.find(piece => textIs(piece.text, query)) ?? cut[0] : cut[0];
  const constrained = hasGroupFilters(filters) || !!requestedGroup && !!range;
  if ((!id || constrained && !cut.some(piece => piece.id === id)) && opening) {
    redirect(branchesHref(opening.id, juz, { ...state, occurrences: undefined }));
  }
  const selected = constrained && !opening ? undefined : resolved;
  const scoped = scopeTree(selected, requestedOccurrences);
  const treeGroup = scoped && new Set(scoped.occurrences.map(occurrence => occurrence.key)).size >= 2 ? scoped : undefined;
  const unavailable = !!id && !treeGroup;
  const drawn = requestedGroup && treeGroup
    ? [...new Set(requestedGroup.places.filter(place => treeGroup.occurrences.some(occurrence => occurrence.key === place.key)).flatMap(place => place.through ? [place.key, place.through] : [place.key]))].map(key => allAyat.get(key)!)
    : treeGroup ? [...new Set(treeGroup.occurrences.map(occurrence => occurrence.key))].map(key => built.byKey.get(key)!) : [];
  const presentation = treeGroup
    ? requestedGroup ? groupPresentation({ ...requestedGroup, tree: treeGroup }, allAyat, range, filters) : phrasePresentation(treeGroup, built.ayat, true, !range, withinScope)
    : undefined;
  const tree = presentation?.tree ?? null;
  const subtreeLinks = tree && treeGroup ? subtreeLinksFor(treeGroup, tree, juz, phraseSubtreeTargets(tree, built.phrases ??= buildPhraseGroups(built.ayat), built.ayat), false, built.subtrees?.idsFor(treeGroup), state.mode) : undefined;
  const holding = tree && query ? drawn.filter(ayah => textHolds(ayah.words.join(' '), query)).map(ayah => ayah.key) : [];
  const marked = holding.length < drawn.length ? holding : [];
  const treeView = { ...state, query: undefined, surah: undefined, saved: undefined };
  const cards = !!tree && state.mode === 'cards';
  const ends = tree && ayahEnds(tree);
  const passageKeys = cards ? presentation!.ayat.map(ayah => {
    const start = positions.get(ayah.key)!;
    const end = positions.get(ends![ayah.key])!;
    return source.ayat.slice(start, end + 1).map(item => item.key);
  }) : undefined;
  const parent = built.subtrees?.byId.get(id)?.parent;
  const position = tree ? cut.findIndex(piece => piece.id === id || piece.id === parent) : -1;
  const stepTo = (index: number, card?: 'last') => cut[index] && branchesHref(cut[index].id, juz, { ...state, occurrences: undefined, card });
  const steps = position < 0 ? undefined : { previous: stepTo(position - 1, 'last'), next: stepTo(position + 1), position: position + 1, total: cut.length };
  const neighbourAt = (index: number) => {
    const phrase = steps && !cards && cut[index]?.phrase;
    if (!phrase) return undefined;
    const group = matchingGroups.find(group => group.id === phrase.id);
    return group ? groupPresentation(group, allAyat, range, filters) : phrasePresentation(phrase, built.ayat, true, !range, withinScope);
  };
  const neighbours = { previous: steps?.previous ? neighbourAt(position - 1) : undefined, next: steps?.next ? neighbourAt(position + 1) : undefined };
  const allSurahs = await surahList();
  const names = Object.fromEntries(allSurahs.map(row => [row.number, row.name]));
  const surahCounts = built.surahCounts ??= countSurahs(legacy);
  const surahs = allSurahs.filter(row => surahCounts[row.number]).map(row => ({ number: row.number, name: row.name, count: surahCounts[row.number] }));
  const switchTo = id && branchesHref(id, juz, { ...state, mode: cards ? 'tree' : 'cards' });
  const viewportHeight = 'clamp(18rem, calc(100svh - var(--tree-chrome)), 36rem)';
  // The neighbour's card is drawn exactly as it will be once opened (same height and surrounding-ayat setting), so the swipe lands without a jump.
  const neighbourCard = (neighbour: typeof neighbours.next) => neighbour && <BranchTree ayat={neighbour.ayat} tree={neighbour.tree} prefixes={neighbour.prefixes} offsets={neighbour.offsets} names={names} juz={range} view={treeView} viewportHeight={viewportHeight} direction="auto" zoomInRail="preview" surround={{ on: false, sync: true }} />;

  return (
    <div id="quran-branches" dir="rtl" className={`${styles.page} w-full max-w-6xl mx-auto px-4 py-8 max-sm:py-3 [--tree-chrome:20rem] max-sm:[--tree-chrome:15rem] flex flex-col gap-3 overflow-x-clip`}>
      <PreloadQuranText />
      <BranchHeading />
      {/* The search box and the filter live in the site's top bar; the page's buttons in the side rail (the top bar on phones). */}
      <NavActions>
        <NavSearch active={!!query}>
          <OpeningSearch key={query} query={query} surahs={surahs} top={[]} current={id} juz={range} view={{ ...treeView, mode: state.mode, query: state.query, surah, saved: state.saved }} />
        </NavSearch>
        <FilterButton range={range} view={state} allSurahs={allSurahs.map(surah => ({ ...surah, nameEn: surah.nameTransliterated ?? undefined }))} />
      </NavActions>
      <NavButtons>
        {switchTo && <TreeMode to={cards ? 'tree' : 'cards'} href={switchTo} />}
        {!cards && tree && <RotateButton />}
        <AroundButton />
      </NavButtons>
      <MatchingRules>{tree && <CardsLegend />}</MatchingRules>
      {surah && names[surah] && <SurahChip surah={names[surah]} clear={branchesHref(id, juz, { ...state, surah: undefined })} />}
      {(!id || constrained && !opening) && <NoTrees query={query} grouped={constrained} />}
      {unavailable && !(constrained && !opening) && <UnavailableNote />}
      {steps && <TreeProgress steps={steps} />}
      <GroupConnections key={`${id}:${defaultConnections}`} group={requestedGroup} defaultOn={defaultConnections}>
      <DoubleTapSave id={id ?? ''} text={treeGroup?.text ?? ''}>
      <PathScope key={`${id}:${marked.join(' ')}`} lit={marked} organic>
        {cards ? <AyahCards key={`${id}:${requestedOccurrences.join(',')}:${range?.from}-${range?.to}`} ayahKeys={presentation!.ayat.map(ayah => ayah.key)} passageKeys={passageKeys} names={names} steps={steps} />
          : tree && <BranchTree key={`${id}:${requestedOccurrences.join(',')}:${range?.from}-${range?.to}`} tree={tree} ayat={presentation?.ayat} prefixes={presentation?.prefixes} offsets={presentation?.offsets} subtreeLinks={subtreeLinks} names={names} juz={range} view={treeView} viewportHeight={viewportHeight} header={steps && <TreeSteps key="steps" steps={steps} />} surround={{ on: false, sync: true }} steppable={{ next: !!steps?.next, previous: !!steps?.previous, nextCard: neighbourCard(neighbours.next), previousCard: neighbourCard(neighbours.previous) }} direction="auto" rotatable growable zoomInRail hideArrows={!!requestedGroup} groupLinks={requestedGroup ? undefined : Object.fromEntries(drawn.flatMap(ayah => { const group = groupsByAyah.get(ayah.key); return group ? [[ayah.key, branchesHref(group.id, undefined, { mode })]] : []; }))} label="شجرة العبارات المشتركة" />}
      </PathScope>
      </DoubleTapSave>
      {treeGroup && <CardActions id={id} text={treeGroup.text} details={requestedGroup && <GroupDetails key={id} group={requestedGroup} shownKeys={drawn.map(ayah => ayah.key)} />} />}
      </GroupConnections>
    </div>
  );
}
