'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { LightbulbOff, Play } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { ayahHref, readAyahMarks, serverAyahMarks, subscribeAyahMarks } from '@/lib/ayahMarks';
import { num } from '@shared/quran/arabicNumber';
import { forgottenOrder } from '@/lib/quran/recite';
import { LAST_RECITE_KEY } from '../ReaderView';

const readLast = () => { try { return localStorage.getItem(LAST_RECITE_KEY); } catch { return null; } };
const noLast = () => null;
const subscribe = (listener: () => void) => { window.addEventListener('storage', listener); return () => window.removeEventListener('storage', listener); };

/** Continue the last recitation, or review the ayat marked as forgotten. */
export default function ReciteShortcuts() {
  const ar = useLanguage().language !== 'en';
  const last = useSyncExternalStore(subscribe, readLast, noLast);
  const marks = useSyncExternalStore(subscribeAyahMarks, readAyahMarks, serverAyahMarks);
  const forgotten = useMemo(() => forgottenOrder(Object.keys(marks)), [marks]);
  if (!last && !forgotten.length) return null;
  return <div className="mb-5 flex flex-wrap gap-2">
    {last?.startsWith('/quran/read/') && <Button href={last}><Play size={18} aria-hidden />{ar ? 'تابع من حيث توقفت' : 'Continue where you stopped'}</Button>}
    {forgotten.length > 0 && <Button href={`${ayahHref(forgotten[0])}?recite=${forgotten[0]}&review=1`}>
      <LightbulbOff size={18} aria-hidden />{ar ? `راجع ما نسيت (${num(forgotten.length)})` : `Review what you forgot (${forgotten.length})`}
    </Button>}
  </div>;
}
