import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { branch, branchesHref, listOpenings, listPhrases, sharedOpenings, startingWith, startsWith, TOP, type BranchAyah } from '@/lib/quran/branches';
import ayat from './ayat.json';
import BranchTree from './BranchTree';
import OpeningSearch from './OpeningSearch';
import { num } from '@/lib/quran/arabicNumber';
import { NOTE } from '../panel';

export const metadata: Metadata = {
  title: 'القرآن: فواتح الآيات المشتركة',
};

const shared = ayat as BranchAyah[];
const groups = sharedOpenings(shared);
const top = listOpenings(groups).slice(0, TOP);
const phrases = listPhrases(groups);
const DEFAULT = 'ان المتقين';

export default async function QuranBranchesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { o } = await searchParams;
  const id = typeof o === 'string' && phrases.some(phrase => phrase.id === o) ? o : DEFAULT;
  const group = startingWith(shared, id);
  const wider = phrases.filter(phrase => phrase.id !== id && startsWith(id, phrase.id)).sort((a, b) => a.id.length - b.id.length);
  const numbers = [...new Set(group.map(ayah => Number(ayah.key.split(':')[0])))];
  const rows = await prisma.surah.findMany({ where: { number: { in: numbers } }, select: { number: true, name: true } });

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-4 text-gray-900 dark:text-gray-200">
      <header>
        <h1 className="text-3xl mb-2">فواتح الآيات المشتركة</h1>
        <p className={NOTE}>
          آيات تبدأ بالكلمتين نفسيهما، تتفرع حيث تختلف كلماتها حتى تنتهي كل آية. اضغط عبارة في الشجرة لترى ما يتفرع منها وحده. تُقارن الكلمات بلا تشكيل ولا علامات وقف، والنص برواية حفص كما في صفحة القراءة. هذا تطابق في اللفظ وحده.
        </p>
      </header>
      <OpeningSearch top={top} phrases={phrases} current={id} />
      {wider.length > 0 && (
        <nav aria-label="عبارات أعم" className="flex flex-wrap items-center gap-2">
          {wider.map(phrase => (
            <Button key={phrase.id} size="sm" href={branchesHref(phrase.id)}>
              <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
              {`${phrase.text} (${num(phrase.count)})`}
            </Button>
          ))}
        </nav>
      )}
      <BranchTree
        tree={branch(group)}
        names={Object.fromEntries(rows.map(row => [row.number, row.name]))}
        pages={Object.fromEntries(group.map(ayah => [ayah.key, ayah.page]))}
      />
    </div>
  );
}
