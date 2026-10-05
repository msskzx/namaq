import HadithIndex from '@/components/hadith/HadithIndex';
import { loadUnitList } from '@/lib/modelUnits';

export const dynamic = 'force-dynamic';

export default async function HadithPage() {
  return <HadithIndex units={await loadUnitList()} />;
}
