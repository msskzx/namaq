import type { Metadata } from 'next';
import { type Poem } from '@shared/tajwid/poem';
import poem from '@shared/tajwid/tuhfat-al-atfal.json';
import PoemView from './PoemView';

export const metadata: Metadata = { title: 'تحفة الأطفال والغلمان' };

export default function TuhfatAlAtfalPage() {
  return <PoemView poem={poem as Poem} />;
}
