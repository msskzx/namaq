'use client';

import { useState, useSyncExternalStore } from 'react';
import { Hand } from 'lucide-react';
import Segmented from '@/components/common/Segmented';
import { useLanguage } from '@/components/language/LanguageContext';
import { GESTURES, MODE_ACTIONS, readGestures, serverGestures, setGesture, subscribeGestures, type Gesture, type GestureAction, type ReaderMode } from '@shared/readerGestures';

const GESTURE_NAMES: Record<Gesture, [string, string]> = {
  tap: ['لمسة', 'Tap'],
  double: ['لمستان', 'Double tap'],
  long: ['ضغطة مطوّلة', 'Long press'],
};

const ACTION_NAMES: Record<GestureAction, [string, string]> = {
  tools: ['إظهار الأدوات أو إخفاؤها', 'Show or hide the tools'],
  'next-ayah': ['إظهار الآية التالية', 'Reveal the next ayah'],
  'next-word': ['إظهار الكلمة التالية', 'Reveal the next word'],
  back: ['الرجوع خطوة', 'Step back'],
  actions: ['أزرار الآية (نسيتها، احفظ)', 'Ayah buttons (forgot, save)'],
  forgot: ['نسيتها', 'Mark as forgotten'],
  save: ['حفظ الآية', 'Save the ayah'],
  none: ['لا شيء', 'Nothing'],
};

/** Settings sheet: what each touch does on the Quran reader's page, per mode, like a game's controls. */
export default function ReaderGestureSetting() {
  const ar = useLanguage().language === 'ar';
  const gestures = useSyncExternalStore(subscribeGestures, readGestures, serverGestures);
  const [mode, setMode] = useState<ReaderMode>('read');
  const name = ([arabic, english]: [string, string]) => (ar ? arabic : english);
  return <fieldset className="flex flex-col gap-2 px-3 py-2">
    <legend className="flex items-center gap-2 text-sm text-[var(--home-muted)]"><Hand size={16} aria-hidden />{ar ? 'اللمسات في المصحف' : 'Touches in the mushaf'}</legend>
    <Segmented label={ar ? 'الوضع' : 'Mode'} options={[
      { key: 'read', label: ar ? 'قراءة' : 'Reading', current: mode === 'read', onClick: () => setMode('read') },
      { key: 'recite', label: ar ? 'تسميع' : 'Reciting', current: mode === 'recite', onClick: () => setMode('recite') },
    ]} />
    {GESTURES.map(gesture => <label key={gesture} className="flex items-center justify-between gap-3 text-sm">
      <span>{name(GESTURE_NAMES[gesture])}</span>
      <select value={gestures[mode][gesture]} onChange={event => setGesture(mode, gesture, event.target.value as GestureAction)}
        className="max-w-[60%] rounded-md border border-[var(--home-rule)] bg-[var(--home-paper)] px-2 py-1.5 text-[var(--home-ink)]">
        {MODE_ACTIONS[mode].map(action => <option key={action} value={action}>{name(ACTION_NAMES[action])}</option>)}
      </select>
    </label>)}
  </fieldset>;
}
