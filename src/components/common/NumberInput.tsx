'use client';

import { Minus, Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';
import styles from './PaperPage.module.css';
import { useLanguage } from '@/components/language/LanguageContext';

type NumberInputProps = {
  label: string;
  iconFamily?: 'fontawesome' | 'lucide';
  min: number;
  max: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  draftValue?: string;
  onDraftChange?: (value: string) => void;
  onChange?: (value: number) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
};

export default function NumberInput({ label, iconFamily = 'fontawesome', min, max, step = 1, value, defaultValue, draftValue, onDraftChange, onChange, name, id, disabled, className }: NumberInputProps) {
  const { language } = useLanguage();
  const initial = draftValue ?? value ?? defaultValue ?? min;
  const [draft, setDraft] = useState(String(initial));
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (draftValue !== undefined) setDraft(draftValue);
    else if (value !== undefined) setDraft(String(value));
  }, [value, draftValue]);
  const ceiling = min + Math.floor((max - min) / step) * step;
  const bounded = (next: number) => Math.min(ceiling, Math.max(min, min + Math.round((next - min) / step) * step));
  const current = draft.trim() && Number.isFinite(Number(draft)) ? Number(draft) : value ?? defaultValue ?? min;
  const commit = (next: number) => {
    const result = bounded(next);
    setDraft(String(result));
    if (input.current) input.current.value = String(result);
    onDraftChange?.(String(result));
    if (result !== value) onChange?.(result);
  };
  const ar = language === 'ar';
  return (
    <span className={`${styles.controls} inline-flex items-center gap-1 ${className ?? ''}`} dir="ltr">
      <Button size="icon" disabled={disabled || current <= min} aria-label={ar ? `تقليل ${label}` : `Decrease ${label}`} onClick={() => commit(current - step)}>
        {iconFamily === 'lucide' ? <Minus size={16} aria-hidden /> : <FontAwesomeIcon icon={faMinus} aria-hidden />}
      </Button>
      <input
        ref={input}
        id={id}
        name={name}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        required
        disabled={disabled}
        value={draft}
        aria-label={label}
        className="w-16 rounded border border-[var(--home-rule)] bg-[var(--home-paper)] px-1 py-1.5 text-center text-sm tabular-nums text-[var(--home-ink)] [appearance:textfield] focus:outline-2 focus:outline-[var(--home-accent)] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        onChange={(event) => { setDraft(event.target.value); onDraftChange?.(event.target.value); }}
        onBlur={() => { if (!onDraftChange) commit(current); }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !onDraftChange) commit(current);
          const next = { ArrowUp: current + step, ArrowDown: current - step, Home: min, End: max }[event.key];
          if (next !== undefined) {
            event.preventDefault();
            commit(next);
          }
        }}
      />
      <Button size="icon" disabled={disabled || current >= ceiling} aria-label={ar ? `زيادة ${label}` : `Increase ${label}`} onClick={() => commit(current + step)}>
        {iconFamily === 'lucide' ? <Plus size={16} aria-hidden /> : <FontAwesomeIcon icon={faPlus} aria-hidden />}
      </Button>
    </span>
  );
}
