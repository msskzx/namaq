import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch, faList, faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { branch, branchesHref, listOpenings, listPhrases, pickPhrase, sharedOpenings, shown, startingWith, TOP, variants, widerPhrases, type BranchAyah } from '@/lib/quran/branches';
import { inJuzRange, parseJuzRange, type JuzRange } from '@/lib/quran/juz';
import ayat from './ayat.json';
import BranchTree from './BranchTree';
import JuzFilter from './JuzFilter';
import OpeningList from './OpeningList';
import OpeningSearch from './OpeningSearch';
import { num } from '@/lib/quran/arabicNumber';
import { NOTE } from '../panel';

export const metadata: Metadata = {
  title: 'القرآن: فواتح الآيات المشتركة',
};

const views = new Map<string, ReturnType<typeof build>>();

function build(range: JuzRange | null) {
  const groups = sharedOpenings(range ? (ayat as BranchAyah[]).filter(ayah => inJuzRange(ayah.key, range)) : (ayat as BranchAyah[]));
  const openings = listOpenings(groups);
  return { groups, shared: [...groups.values()].flat(), openings, phrases: listPhrases(groups) };
}

function view(range: JuzRange | null) {
  const key = range ? `${range.from}-${range.to}` : '';
  if (!views.has(key)) views.set(key, build(range));
  return views.get(key)!;
}

const first = (value: string | string[] | undefined) => (typeof value === 'string' ? value : null);

export default async function QuranBranchesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const range = parseJuzRange(first(params.juzFrom), first(params.juzTo));
  const juz = range ?? undefined;
  const list = params.v === 'list';
  const { groups, shared, openings, phrases } = view(range);
  const id = pickPhrase(phrases, first(params.o));
  const group = id ? startingWith(shared, id) : [];
  const wider = widerPhrases(phrases, id, group);
  const numbers = list ? undefined : [...new Set(group.map(ayah => Number(ayah.key.split(':')[0])))];
  const rows = await prisma.surah.findMany({ where: numbers ? { number: { in: numbers } } : undefined, select: { number: true, name: true } });
  const names = Object.fromEntries(rows.map(row => [row.number, row.name]));

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-4 text-gray-900 dark:text-gray-200">
      <header>
        <h1 className="text-3xl mb-2">فواتح الآيات المشتركة</h1>
        <p className={NOTE}>
          آيات تبدأ بالكلمتين نفسيهما، تتفرع حيث تختلف كلماتها حتى تنتهي كل آية. اضغط عبارة في الشجرة لترى ما يتفرع منها وحده. تُجمع الآية المبدوءة بواو أو فاء عاطفة مع التي تبدأ بالكلمة نفسها دونها، وتظهر الصيغتان قبل الشجرة. تُقارن الكلمات بلا تشكيل ولا علامات وقف، والنص برواية حفص كما في صفحة القراءة. هذا تطابق في اللفظ وحده.
        </p>
      </header>
      <JuzFilter range={range} phrase={id} list={list} />
      <div role="group" aria-label="طريقة العرض" className="flex flex-wrap gap-2">
        <Button size="sm" href={branchesHref(id, juz)} active={!list} aria-current={!list ? 'page' : undefined}>
          <FontAwesomeIcon icon={faCodeBranch} />
          الشجرة
        </Button>
        <Button size="sm" href={branchesHref(id, juz, true)} active={list} aria-current={list ? 'page' : undefined}>
          <FontAwesomeIcon icon={faList} />
          {`كل الفواتح (${num(groups.size)})`}
        </Button>
      </div>
      {openings.length === 0 ? (
        <p className={NOTE}>لا تشترك آيتان في فاتحة داخل هذه الأجزاء.</p>
      ) : list ? (
        <OpeningList
          key={range ? `${range.from}-${range.to}` : ''}
          openings={openings.map(opening => ({ ...opening, ayat: startingWith(shared, opening.id).map(ayah => ({ key: ayah.key, page: ayah.page })) }))}
          names={names}
          juz={range}
        />
      ) : (
        <>
          <OpeningSearch top={openings.slice(0, TOP)} phrases={phrases} current={id} juz={range} />
          {wider.length > 0 && (
            <nav aria-label="عبارات أعم" className="flex flex-wrap items-center gap-2">
              {wider.map(phrase => (
                <Button key={phrase.id} size="sm" href={branchesHref(phrase.id, juz)}>
                  <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
                  {`${phrase.text} (${num(phrase.count)})`}
                </Button>
              ))}
            </nav>
          )}
          <BranchTree
            tree={branch(shown(group))}
            variants={variants(group)}
            names={names}
            pages={Object.fromEntries(group.map(ayah => [ayah.key, ayah.page]))}
            juz={range}
          />
        </>
      )}
    </div>
  );
}
