// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import itqan from '@shared/data/quran/itqanBalagha';
import { exampleReference } from '@shared/quran/lataif';
import { examples } from '@shared/quran/iltifat';
import { mushafText } from '@shared/quran/mushafText';
import LataifView, { VOICE_COLOR } from './LataifView';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(cleanup);

const views = examples();
const references = Object.fromEntries(views.map(view => [view.key, exampleReference(view, itqan)]));
const card = (name: string) => screen.getByRole('article', { name });

describe('LataifView', () => {
  it('gives each example its own card, in mushaf order, with mushaf and share buttons', () => {
    render(<LataifView views={views} references={references} />);
    expect(screen.getAllByRole('article').map(a => a.getAttribute('aria-label'))).toEqual(['الفاتحة ٢–٧', 'يونس ٢٢', 'يوسف ٨٠–٨٣', 'الإسراء ١', 'فاطر ٩', 'الزخرف ٢٢–٢٣', 'الفتح ٨–٩']);
    const fatiha = card('الفاتحة ٢–٧');
    expect(within(fatiha).getByRole('link', { name: /المصحف/ }).getAttribute('href')).toBe('/quran/read/ayah/1/2');
    expect(within(fatiha).getByRole('button', { name: 'مشاركة' }).closest('[data-share-skip]')).toBeTruthy();
    expect(fatiha.hasAttribute('data-share-card')).toBe(true);
  });

  it('draws the pronoun chips of al-Isra in order: he, we, he', () => {
    render(<LataifView views={views} references={references} />);
    const chips = within(card('الإسراء ١')).getByRole('list', { name: 'ترتيب الضمائر' }).querySelectorAll('li');
    expect([...chips].map(li => li.getAttribute('aria-label'))).toEqual(['هو: غيبة', 'نحن: تكلم', 'هو: غيبة']);
  });

  it('colours a word with the colour of its chip', () => {
    render(<LataifView views={views} references={references} />);
    const word = within(card('فاطر ٩')).getByText(mushafText('فَسُقۡنَـٰهُ'));
    expect(word.getAttribute('style')).toContain(VOICE_COLOR.we);
  });

  it('shows al-Zukhruf as a trunk and two leaves, the differing letter in the accent', () => {
    render(<LataifView views={views} references={references} />);
    const leaves = within(card('الزخرف ٢٢–٢٣')).getAllByRole('listitem');
    expect(leaves.map(li => li.textContent)).toEqual([expect.stringContaining('قالوا'), expect.stringContaining('قال مترفوها')]);
    expect(leaves.map(li => li.querySelector('.text-\\[var\\(--home-accent\\)\\]')!.textContent![0])).toEqual(['ه', 'ق']);
  });

  it('plays Yusuf 80-83 as a dialog: the eldest, a scene cut, the brothers to their father, then his reply', () => {
    render(<LataifView views={views} references={references} />);
    const yusuf = card('يوسف ٨٠–٨٣');
    expect(within(yusuf).getAllByRole('figure').map(f => f.querySelector('figcaption')!.textContent)).toEqual(['كبيرهم، لإخوته', 'إخوته، لأبيهم', 'أبوهم، يرد']);
    expect(within(yusuf).getByText('عند أبيهم')).toBeTruthy();
    for (const n of ['٨٠', '٨١', '٨٢', '٨٣']) expect(within(yusuf).getByText(new RegExp(`^\\s*${n}$`))).toBeTruthy();
  });

  it('groups the cards under iltifat with its colours and al-Suyuti\'s definition, and gives each card its reference', () => {
    render(<LataifView views={views} references={references} />);
    const iltifat = screen.getByRole('region', { name: 'الالتفات' });
    expect(within(iltifat).getByRole('list', { name: 'ألوان الضمائر' }).children).toHaveLength(3);
    expect(within(iltifat).getByText('الالتفات في الإتقان للسيوطي ٣/٢٨٩')).toBeTruthy();
    expect(within(iltifat).getAllByText('الإتقان للسيوطي ٣/٢٩٠–٢٩١')[0].tagName).toBe('SUMMARY');
    expect(within(iltifat).getByText('تفسير القرطبي')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'الكل' }).getAttribute('aria-selected')).toBe('true');
  });
});
