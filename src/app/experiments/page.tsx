import type { Metadata } from 'next';
import Experiments from './Experiments';

export const metadata: Metadata = {
  title: 'تجارب | Experiments',
  robots: { index: false, follow: false },
};

export default function ExperimentsPage() {
  return <Experiments />;
}
