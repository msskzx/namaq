// docs/plans/hadith-in-the-database.md
import { hadithView, listUnits, type HadithUnitView } from '@/lib/model/hadithView';
import { prisma } from '@/lib/prisma';

export async function loadUnitView(unit: string): Promise<HadithUnitView | null> {
  const row = await prisma.modelUnit.findUnique({ where: { unit } }).catch(() => null);
  return row ? (row.view as unknown as HadithUnitView) : hadithView(unit);
}

export async function loadUnitList() {
  const rows = await prisma.modelUnit
    .findMany({ select: { unit: true, book: true }, orderBy: { unit: 'asc' } })
    .catch(() => []);
  return rows.length > 0 ? rows.map((r) => ({ id: r.unit, book: r.book })) : listUnits();
}
