'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, Bookmark, Check, LightbulbOff } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import Button from '@/components/common/Button';
import { num } from '@shared/quran/arabicNumber';
import styles from './Mushaf.module.css';
import type { AyahLink } from './ayahLinks';

/**
 * The icons for one ayah: forgot (with how often, and a check to clear it), save, and where else it is:
 * its compare cards (a short list when several surahs hold one) and the trees that hold it. Those two show only when there are any.
 */
export default function AyahActions({ ayah, x, y, forgot, saved, ar, links, onForgot, onClear, onSave, onClose, onDismiss = onClose }: {
  ayah: string;
  x: number;
  y: number;
  forgot: number;
  saved: boolean;
  ar: boolean;
  links?: AyahLink;
  onForgot: () => void;
  onClear: () => void;
  onSave: () => void;
  onClose: () => void;
  /** A press outside closes the buttons; the page then ignores that press. */
  onDismiss?: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [choosing, setChoosing] = useState(false);
  useEffect(() => { if (choosing) box.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true }); }, [choosing]);
  useEffect(() => {
    box.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node)) onDismiss(); };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); onClose(); } };
    document.addEventListener('pointerdown', outside, true);
    window.addEventListener('keydown', key);
    window.addEventListener('resize', onClose);
    window.addEventListener('scroll', onClose, true);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', onClose);
      window.removeEventListener('scroll', onClose, true);
    };
  }, [onClose, onDismiss]);
  const [surah, number] = ayah.split(':').map(Number);
  const label = ar ? `الآية ${num(number)} من السورة ${num(surah)}` : `Ayah ${surah}:${number}`;
  const forgotLabel = forgot ? (ar ? 'نسيتها مرة أخرى' : 'Forgot again') : (ar ? 'نسيتها' : 'I forgot it');
  const saveLabel = saved ? (ar ? 'أزلها من المحفوظات' : 'Remove from saved') : (ar ? 'احفظ الآية' : 'Save ayah');
  const clearLabel = ar ? 'تذكّرتها' : 'I remember it now';
  const compareLabel = ar ? 'في المقارنة' : 'Also in compare';
  const treesLabel = ar ? 'أشجار هذه الآية' : 'Trees of this ayah';
  const compare = links?.compare ?? [];
  const half = choosing ? 150 : 130;
  const left = typeof window === 'undefined' ? x : Math.min(window.innerWidth - half, Math.max(half, x));
  if (choosing) return (
    <div ref={box} role="dialog" aria-label={compareLabel} className={`${styles.ayahActions} ${styles.ayahChoices}`} style={{ left, top: Math.max(64, y) }}>
      <p className="px-2 text-sm font-semibold">{ar ? 'افتح في المقارنة' : 'Open in compare'}</p>
      {compare.map(link => <Link key={link.href} href={link.href} onClick={onClose} className="rounded px-2 py-2 text-sm hover:bg-[var(--home-paper-deep)]">{ar ? link.label : link.labelEn}</Link>)}
    </div>
  );
  return (
    <div ref={box} role="dialog" aria-label={label} className={styles.ayahActions} style={{ left, top: Math.max(64, y) }}>
      <Button size="lg" variant={forgot ? 'primary' : 'muted'} aria-label={forgotLabel} title={forgotLabel} onClick={() => { onForgot(); onClose(); }}>
        <LightbulbOff aria-hidden />
      </Button>
      {forgot > 0 && <Button size="lg" variant="muted" aria-label={clearLabel} title={clearLabel} onClick={() => { onClear(); onClose(); }}><Check aria-hidden className="text-[var(--home-green)]" /></Button>}
      <Button size="lg" variant={saved ? 'primary' : 'muted'} aria-label={saveLabel} title={saveLabel} aria-pressed={saved} onClick={() => { onSave(); onClose(); }}>
        <Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} />
      </Button>
      {compare.length === 1 && <Button size="lg" variant="muted" href={compare[0].href} aria-label={compareLabel} title={compareLabel} onClick={onClose}><ArrowLeftRight aria-hidden /></Button>}
      {compare.length > 1 && <Button size="lg" variant="muted" aria-label={compareLabel} title={compareLabel} aria-haspopup="dialog" onClick={() => setChoosing(true)}><ArrowLeftRight aria-hidden /></Button>}
      {links?.trees && <Button size="lg" variant="muted" href={links.trees} aria-label={treesLabel} title={treesLabel} onClick={onClose}><TreeIcon aria-hidden /></Button>}
    </div>
  );
}
