import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { branch, listOpenings, sharedOpenings, type BranchAyah } from '@/lib/quran/branches';
import ayat from './ayat.json';
import BranchTree from './BranchTree';
import OpeningSearch from './OpeningSearch';
import { NOTE } from '../panel';

export const metadata: Metadata = {
  title: 'القرآن: فواتح الآيات المشتركة',
};

const groups = sharedOpenings(ayat as BranchAyah[]);
const openings = listOpenings(groups);
const DEFAULT = 'ان المتقين';

export default async function QuranBranchesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { o } = await searchParams;
  const id = typeof o === 'string' && groups.has(o) ? o : DEFAULT;
  const group = groups.get(id)!;
  const numbers = [...new Set(group.map(ayah => Number(ayah.key.split(':')[0])))];
  const rows = await prisma.surah.findMany({ where: { number: { in: numbers } }, select: { number: true, name: true } });

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-4 text-gray-900 dark:text-gray-200">
      <header>
        <h1 className="text-3xl mb-2">فواتح الآيات المشتركة</h1>
        <p className={NOTE}>
          آيات تبدأ بالكلمتين نفسيهما، تتفرع حيث تختلف كلماتها حتى تنتهي كل آية. تُقارن الكلمات بلا تشكيل ولا علامات وقف، والنص برواية حفص كما في صفحة القراءة. هذا تطابق في اللفظ وحده.
        </p>
      </header>
      <OpeningSearch openings={openings} current={id} />
      <BranchTree
        tree={branch(group)}
        names={Object.fromEntries(rows.map(row => [row.number, row.name]))}
        pages={Object.fromEntries(group.map(ayah => [ayah.key, ayah.page]))}
      />
    </div>
  );
}
