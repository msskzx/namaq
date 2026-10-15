import type { Metadata } from 'next';
import NasabView from '@/components/nasab/NasabView';

export const metadata: Metadata = {
  title: 'النسب',
};

export default function NasabPage() {
  return (
    <div className="w-full px-4 py-8">
      <NasabView />
    </div>
  );
}
