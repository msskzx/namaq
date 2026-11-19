import type { Metadata } from 'next';
import { loadAyahTokens } from '@/lib/quran/readerAyat';
import { qiraatAyat } from '@shared/quran/qiraatData';
import QiraatView from './QiraatView';

export const metadata: Metadata = {
  title: 'القرآن: القراءات',
};

export default async function QuranQiraatPage() {
  const words = await loadAyahTokens();
  const texts = Object.fromEntries(qiraatAyat().map(key => [key, words[key] ?? []]));
  return <QiraatView texts={texts} />;
}
