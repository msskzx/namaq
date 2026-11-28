import type { ReactNode } from 'react';
import { Tap } from '@/ui/Tap';

export default function Pickable({ picked, onPick, label, children }: { picked: boolean; onPick: () => void; label?: string; children: ReactNode }) {
  return <Tap onPress={onPick} accessibilityRole="button" accessibilityLabel={label} aria-pressed={picked}>{children}</Tap>;
}
