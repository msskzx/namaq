// docs/plans/hadith-in-the-database.md
import { hadithView, listUnits, type HadithUnitView } from '@/lib/model/hadithView';
import { prisma } from '@/lib/prisma';

export const quietIfMissing = <T>(fallback: T) => (error: unknown) => {
  if ((error as { code?: string })?.code !== 'P2021') console.error('model_units read failed', error);
  return fallback;
};

export async function loadUnitView(unit: string): Promise<HadithUnitView | null> {
  const row = await prisma.modelUnit.findUnique({ where: { unit } }).catch(quietIfMissing(null));
  return row ? (row.view as unknown as HadithUnitView) : hadithView(unit);
}

export async function loadUnitList() {
  const rows = await prisma.modelUnit
    .findMany({ select: { unit: true, book: true }, orderBy: { unit: 'asc' } })
    .catch(quietIfMissing([]));
  return rows.length > 0 ? rows.map((r) => ({ id: r.unit, book: r.book })) : listUnits();
}
