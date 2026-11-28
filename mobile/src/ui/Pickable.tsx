import type { ReactNode } from 'react';
import { Tap } from '@/ui/Tap';

export default function Pickable({ picked, onPick, children }: { picked: boolean; onPick: () => void; children: ReactNode }) {
  return <Tap onPress={onPick} accessibilityRole="button" aria-pressed={picked}>{children}</Tap>;
}
