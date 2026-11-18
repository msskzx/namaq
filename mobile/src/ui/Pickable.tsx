import type { ReactNode } from 'react';
import { Tap } from '@/ui/Tap';

/**
 * A block of a card that picks it on a tap, such as a book's paragraph that lights the ayah words it quotes (the balagha
 * and meaning sheets). The card's other controls (its folded reference) stay their own, outside it.
 */
export default function Pickable({ picked, onPick, children }: { picked: boolean; onPick: () => void; children: ReactNode }) {
  return <Tap onPress={onPick} accessibilityRole="button" aria-pressed={picked}>{children}</Tap>;
}
