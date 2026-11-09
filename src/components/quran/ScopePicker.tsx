'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { normalizeWord } from '@shared/quran/normalize';
import { toggleFilter } from '@shared/quran/mutashabih/browse';

export type ScopeOption = { number: number; name: string; nameEn?: string };

export default function ScopePicker({ name, value, onChange, options }: { name: string; value?: string; onChange: (value: string) => void; options: ScopeOption[] }) {
  const ar = useLanguage().language === 'ar';
  const [query, setQuery] = useState('');
  const picked = (value ?? '').split(',').filter(Boolean).map(Number);
  const title = (name: string) => normalizeWord(name.trim()).replace(/^سوره\s+/, '').replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
  const needle = title(query);
  const matches = options.filter(option => !picked.includes(option.number) && (String(option.number) === needle || title(option.name).includes(needle) || title(option.nameEn ?? '').toLowerCase().includes(needle.toLowerCase())))
    .sort((a, b) => Number(title(b.name) === needle) - Number(title(a.name) === needle));
  const toggle = (number: number) => {
    setQuery('');
    onChange(toggleFilter(value, String(number)));
  };
  return <div className="flex min-w-0 flex-1 flex-col gap-1">
    <input aria-label={name} placeholder={name} value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && query.trim()) { event.preventDefault(); if (matches[0]) toggle(matches[0].number); } }}
      className="h-10 w-full rounded border border-[var(--home-rule)] bg-[var(--home-paper)] px-2 py-1.5 text-base" />
    <div className="flex flex-wrap gap-1">
      {picked.flatMap(number => {
        const option = options.find(item => item.number === number);
        return option ? [<Button key={number} size="sm" variant="neutral" active onClick={() => toggle(number)}><X size={12} aria-hidden />{!ar && option.nameEn ? option.nameEn : option.name}</Button>] : [];
      })}
      {needle && matches.slice(0, 5).map(option =>
        <Button key={option.number} size="sm" variant="neutral" onClick={() => toggle(option.number)}><Plus size={12} aria-hidden />{!ar && option.nameEn ? option.nameEn : option.name}</Button>)}
    </div>
  </div>;
}

