import type { Metadata } from 'next';
import QuranHub from './QuranHub';

export const metadata: Metadata = {
  title: 'القرآن',
};

export default function QuranPage() {
  return <QuranHub />;
}
