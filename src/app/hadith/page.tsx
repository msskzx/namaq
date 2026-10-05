import HadithIndex from '@/components/hadith/HadithIndex';
import { listUnits } from '@/lib/model/hadithView';

export const dynamic = 'force-dynamic';

export default function HadithPage() {
  return <HadithIndex units={listUnits()} />;
}
