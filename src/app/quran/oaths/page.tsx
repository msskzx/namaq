import type { Metadata } from 'next';
import { buildOaths } from '@shared/quran/oaths';
import data from '@shared/data/quran/oaths.json';
import OathsView from './OathsView';

export const metadata: Metadata = {
  title: 'الأقسام في القرآن',
};

export default function QuranOathsPage() {
  return (
    <div dir="rtl" className="mx-auto w-full max-w-3xl px-4 py-6 text-[var(--home-ink)]">
      <OathsView allah={buildOaths('allah', data)} others={buildOaths('others', data)} />
    </div>
  );
}
