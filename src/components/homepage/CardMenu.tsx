'use client';

import { useEffect, useRef } from 'react';
import type { LucideProps } from 'lucide-react';
import Button from '@/components/common/Button';
import styles from './Homepage.module.css';

export type MenuItem = { id: string; Icon: React.ComponentType<LucideProps>; label: string; href?: string; on?: boolean; onClick?: () => void };

/** A homepage card's click: a row of icons over the card, like a chat app's reaction menu and the reader's ayah buttons. */
export default function CardMenu({ x, y, label, items, onClose }: { x: number; y: number; label: string; items: MenuItem[]; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    box.current?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
    const away = (event: FocusEvent) => { if (event.relatedTarget instanceof Node && !box.current?.contains(event.relatedTarget)) onClose(); };
    box.current?.addEventListener('focusout', away);
    const outside = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node)) onClose(); };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); onClose(); } };
    document.addEventListener('pointerdown', outside, true);
    window.addEventListener('keydown', key);
    window.addEventListener('resize', onClose);
    window.addEventListener('scroll', onClose, true);
    const menu = box.current;
    return () => {
      menu?.removeEventListener('focusout', away);
      if (opener?.isConnected && (document.activeElement === document.body || menu?.contains(document.activeElement))) opener.focus({ preventScroll: true });
      document.removeEventListener('pointerdown', outside, true);
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', onClose);
      window.removeEventListener('scroll', onClose, true);
    };
  }, [onClose]);
  const half = items.length * 26 + 8;
  const left = typeof window === 'undefined' ? x : Math.min(window.innerWidth - half, Math.max(half, x));
  return (
    <div ref={box} role="dialog" aria-label={label} className={styles.cardMenu} style={{ left, top: Math.max(64, y) }}>
      {items.map(({ id, Icon, label: itemLabel, href, on, onClick }) => {
        const icon = <Icon aria-hidden fill={on && id === 'saved' ? 'currentColor' : 'none'} />;
        const done = () => { onClick?.(); onClose(); };
        return href
          ? <Button key={id} size="lg" variant={on ? 'primary' : 'muted'} href={href} aria-label={itemLabel} title={itemLabel} onClick={done}>{icon}</Button>
          : <Button key={id} size="lg" variant={on ? 'primary' : 'muted'} aria-label={itemLabel} title={itemLabel} aria-pressed={on} onClick={done}>{icon}</Button>;
      })}
    </div>
  );
}
