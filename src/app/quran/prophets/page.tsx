import type { Metadata } from 'next';
import OpenLastProphet from './OpenLastProphet';

export const metadata: Metadata = { title: 'قصص الأنبياء' };

export default function ProphetsPage() {
  return <OpenLastProphet />;
}
