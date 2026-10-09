import type { Metadata } from 'next';
import QuranDemo from './QuranDemo';
import runs from './data/runs.json';
import ayat from './data/ayat.json';

export const metadata: Metadata = {
  title: 'القرآن: نصوص مشتركة بين السور (تجريبي)',
};

export default function QuranPage() {
  return <QuranDemo runs={runs} ayat={ayat} />;
}
