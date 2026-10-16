import type { Metadata } from 'next';
import { faFont, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/common/Button';
import TextCompare from './TextCompare';
import ThemesCompare from './ThemesCompare';
import { modeHref } from './modeHref';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: مقارنة سورتين',
};

export default async function QuranComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const themes = query.mode === 'themes';

  return (
    <>
      <div dir="rtl" role="group" aria-label="نوع المقارنة" className="max-w-5xl mx-auto px-4 pt-4 flex gap-2">
        <Button size="sm" active={!themes} href={modeHref('text', query)}>
          <FontAwesomeIcon icon={faFont} />
          النص
        </Button>
        <Button size="sm" active={themes} href={modeHref('themes', query)}>
          <FontAwesomeIcon icon={faLayerGroup} />
          المواضيع
        </Button>
      </div>
      {themes ? <ThemesCompare query={query} /> : <TextCompare query={query} />}
    </>
  );
}
