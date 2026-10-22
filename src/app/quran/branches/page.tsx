import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ZoomOut } from 'lucide-react';
import Button from '@/components/common/Button';
import { branch, branchesHref, listOpenings, listPage, listPhrases, pieces, sharedOpenings, spelledAs, startingWith, TOP, variants, widerPhrases, type BranchAyah } from '@/lib/quran/branches';
import { inJuzRange, parseJuzRange, type JuzRange } from '@/lib/quran/juz';
import ayat from './ayat.json';
import BranchTree from './BranchTree';
import JuzFilter from './JuzFilter';
import Pagination from '@/components/common/Pagination';
import PieceList from './PieceList';
import BranchOrdering from './BranchOrdering';
import BranchHeading from './BranchHeading';
import OpeningSearch from './OpeningSearch';
import { num } from '@/lib/quran/arabicNumber';
import styles from '@/components/common/PaperPage.module.css';

const PER_PAGE = 10;

export const metadata: Metadata = { title: 'القرآن: فواتح الآيات المشتركة' };

const views = new Map<string, ReturnType<typeof build>>();

function build(range: JuzRange | null) {
  const groups = sharedOpenings(range ? (ayat as BranchAyah[]).filter(ayah => inJuzRange(ayah.key, range)) : (ayat as BranchAyah[]));
  const openings = listOpenings(groups);
  const shared = [...groups.values()].flat();
  return { shared, byKey: new Map(shared.map(ayah => [ayah.key, ayah])), openings, phrases: listPhrases(groups), pieces: pieces(groups) };
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
  const grouped = params.g === 'opening';
  if (params.v === 'list') redirect(branchesHref('', juz, { grouped, page: Number(first(params.p)) || 1 }));
  const { shared, byKey, openings, phrases, pieces: cut } = view(range);
  const id = first(params.o) ?? '';
  const partition = first(params.r) ?? undefined;
  const matches = phrases.filter(phrase => phrase.id === id && (partition === undefined || phrase.partition === partition || (!phrase.partition && startingWith(shared, id, partition).length >= 2)));
  const ambiguous = matches.length > 1;
  const unavailable = !!id && matches.length === 0;
  const group = id && !unavailable && !ambiguous ? startingWith(shared, id, partition ?? matches[0]?.partition) : [];
  const own = spelledAs(group, first(params.w));
  const drawn = own.length > 0 ? own : group;
  const spelling = own.length > 0 ? first(params.w)! : undefined;
  const { page, pageCount } = listPage(first(params.p), cut.length, PER_PAGE);
  const state = { grouped, page, spelling, partition: matches.length === 1 ? (matches[0].partition ?? partition) : partition };
  if (params.apply === 'juz') redirect(branchesHref(id, juz, state));
  const wider = !group.length ? [] : [...(own.length > 0 ? matches : []), ...widerPhrases(phrases, id, group)];
  const numbers = id ? [...new Set(group.map(ayah => Number(ayah.key.split(':')[0])))] : undefined;
  const rows = await prisma.surah.findMany({ where: numbers ? { number: { in: numbers } } : undefined, select: { number: true, name: true } });
  const names = Object.fromEntries(rows.map(row => [row.number, row.name]));
  const ordered = grouped ? openings.flatMap(opening => cut.filter(piece => piece.opening.id === opening.id && piece.opening.partition === opening.partition)) : cut;
  const shown = ordered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const shownAyat = new Map(shown.flatMap(piece => piece.keys.map(key => [key, byKey.get(key)!] as const)));

  return (
    <div id="quran-branches" dir="rtl" className={`${styles.page} w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-4`}>
      <BranchHeading />
      <OpeningSearch top={openings.slice(0, TOP)} phrases={phrases} current={id} juz={range} unavailable={unavailable} view={state} alternatives={ambiguous ? matches : []} />
      <div className="flex flex-wrap items-center gap-3">
        <JuzFilter range={range} phrase={id} view={state} />
        {!id && <BranchOrdering grouped={grouped} juz={range} view={state} />}
      </div>
      {!id ? <>
        <PieceList pieces={shown} openings={grouped ? openings : undefined} ayat={shownAyat} names={names} juz={range} view={state} />
        <Pagination iconFamily="lucide" scrollTarget="quran-branches" page={page} pageCount={pageCount} hrefs={Array.from({ length: pageCount }, (_, i) => branchesHref('', juz, { grouped, page: i + 1 }))} />
      </> : <>
        {wider.length > 0 && <nav aria-label="عبارات أعم" className="flex flex-wrap items-center gap-2">
          {wider.map(phrase => <Button key={`${phrase.id}:${phrase.partition ?? ''}`} size="sm" href={branchesHref(phrase.id, juz, { ...state, spelling: undefined, partition: phrase.partition })}>
            <ZoomOut size={16} aria-hidden />
            {`${phrase.text} (${num(phrase.count)})`}
          </Button>)}
        </nav>}
        {!unavailable && !ambiguous && <BranchTree tree={branch(drawn)} variants={variants(drawn)} names={names} pages={Object.fromEntries(drawn.map(ayah => [ayah.key, ayah.page]))} juz={range} view={state} />}
      </>}
    </div>
  );
}
