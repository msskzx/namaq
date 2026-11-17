import type { Metadata } from 'next';
import { loadAyahText } from '@/lib/quran/readerAyat';
import QiraatView from './QiraatView';
import { variants } from './data/variants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: القراءات',
};

export default async function QuranQiraatPage() {
  const text = await loadAyahText();
  const entries = variants.map(variant => ({ variant, text: text(variant.surah, variant.ayah) }));
  return <QiraatView entries={entries} />;
}
