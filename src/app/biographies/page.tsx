import type { Metadata } from 'next';
import SectionHub from '@/components/common/SectionHub';

export const metadata: Metadata = {
  title: 'التراجم',
};

export default function BiographiesPage() {
  return <SectionHub href="/biographies" />;
}
