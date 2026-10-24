import type { Metadata } from 'next';
import { type Poem } from '@/lib/tajwid/poem';
import poem from './poem.json';
import PoemView from './PoemView';

export const metadata: Metadata = { title: 'تحفة الأطفال والغلمان' };

export default function TuhfatAlAtfalPage() {
  return <PoemView poem={poem as Poem} />;
}
