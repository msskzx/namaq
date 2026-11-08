'use client';

import { useEffect, useRef } from 'react';
import { Bookmark, Check, LightbulbOff } from 'lucide-react';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import styles from './Mushaf.module.css';

/** The two icons for one ayah: forgot (with how often, and a check to clear it) and save. */
export default function AyahActions({ ayah, x, y, forgot, saved, ar, onForgot, onClear, onSave, onClose }: {
  ayah: string;
  x: number;
  y: number;
  forgot: number;
  saved: boolean;
  ar: boolean;
  onForgot: () => void;
  onClear: () => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node)) onClose(); };
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
  }, [onClose]);
  const [surah, number] = ayah.split(':').map(Number);
  const label = ar ? `الآية ${num(number)} من السورة ${num(surah)}` : `Ayah ${surah}:${number}`;
  const forgotLabel = forgot ? (ar ? `نسيتها مرة أخرى (نسيتها ${num(forgot)} من قبل)` : `Forgot again (${forgot} before)`) : (ar ? 'نسيتها' : 'I forgot it');
  const saveLabel = saved ? (ar ? 'أزلها من المحفوظات' : 'Remove from saved') : (ar ? 'احفظ الآية' : 'Save ayah');
  const clearLabel = ar ? 'تذكّرتها، أزلها من المراجعة' : 'I know it now, stop reviewing it';
  const left = typeof window === 'undefined' ? x : Math.min(window.innerWidth - 110, Math.max(110, x));
  return (
    <div ref={box} role="dialog" aria-label={label} className={styles.ayahActions} style={{ left, top: Math.max(64, y) }}>
      <Button size="lg" variant={forgot ? 'primary' : 'muted'} aria-label={forgotLabel} title={forgotLabel} onClick={() => { onForgot(); onClose(); }}>
        <LightbulbOff aria-hidden />{forgot > 0 && <span className="text-sm tabular-nums">{ar ? num(forgot) : forgot}</span>}
      </Button>
      {forgot > 0 && <Button size="lg" variant="muted" aria-label={clearLabel} title={clearLabel} onClick={() => { onClear(); onClose(); }}><Check aria-hidden /></Button>}
      <Button size="lg" variant={saved ? 'primary' : 'muted'} aria-label={saveLabel} title={saveLabel} aria-pressed={saved} onClick={() => { onSave(); onClose(); }}>
        <Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} />
      </Button>
    </div>
  );
}
