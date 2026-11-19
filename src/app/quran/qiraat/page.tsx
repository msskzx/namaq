import type { Metadata } from 'next';
import { loadReaderAyat } from '@/lib/quran/readerAyat';
import { qiraatAyat } from '@shared/quran/qiraatData';
import QiraatView from './QiraatView';

export const metadata: Metadata = {
  title: 'القرآن: القراءات',
};

export default async function QuranQiraatPage() {
  const ayat = await loadReaderAyat();
  const wanted = new Set(qiraatAyat());
  const texts = Object.fromEntries(ayat.filter(ayah => wanted.has(ayah.key)).map(ayah => [ayah.key, ayah.words]));
  return <QiraatView texts={texts} />;
}
