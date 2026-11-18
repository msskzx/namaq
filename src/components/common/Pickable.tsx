import type { ReactNode } from 'react';

/**
 * A block of a card that picks it on a click or Enter, such as a book's paragraph that lights the ayah words it quotes
 * (the balagha and meaning sheets). The card's other controls (its folded reference) stay their own, outside it. The
 * app has mobile/src/ui/Pickable.tsx.
 */
export default function Pickable({ picked, onPick, children }: { picked: boolean; onPick: () => void; children: ReactNode }) {
  return (
    <div role="button" tabIndex={0} aria-pressed={picked} onClick={onPick} className="cursor-pointer"
      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onPick(); } }}>
      {children}
    </div>
  );
}
