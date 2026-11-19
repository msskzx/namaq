'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Search } from 'lucide-react';
import Button from '@/components/common/Button';
import Sheet from '@/components/common/Sheet';
import LoadingDots from '@/components/common/LoadingDots';
import StoryView from '@/components/stories/StoryView';
import BattleView from '@/components/battles/BattleView';
import type { QuizLook } from '@shared/quiz/choiceKinds';
import type { AppStory } from '@shared/stories/story';
import type { AppBattle } from '@shared/battles/battle';
import type { AyatPage } from '@/lib/storyAyat';

type Looked = { story: AppStory; ayat: AyatPage[][] } | { battle: AppBattle };

const fetchLooked = async (url: string): Promise<Looked> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(url);
  return response.json();
};

/** The looks the website draws so far: the sira story and the battle. The app draws every kind (mobile/src/components/QuizLook.tsx). */
const urlOf = (look: QuizLook) => (look.view === 'story' ? `/api/sira?story=${encodeURIComponent(look.slug)}`
  : look.view === 'battle' ? `/api/sira?battle=${encodeURIComponent(look.slug)}` : null);
export const canLook = (look: QuizLook | undefined): look is QuizLook => !!look && urlOf(look) !== null;

/** The feature's own view a question is looked up in (the app's LookView): the sira story whole, its moments titled, or the battle. */
export function LookView({ look }: { look: QuizLook }) {
  const { data, error } = useSWR(urlOf(look), fetchLooked, { revalidateOnFocus: false });
  if (error) return null;
  if (!data) return <p className="py-6 text-center"><LoadingDots label="جارٍ التحميل" /></p>;
  return 'story' in data ? <div dir="rtl" lang="ar" className="text-[var(--home-ink)]"><StoryView story={data.story} ayat={data.ayat} titled /></div> : <BattleView battle={data.battle} />;
}

/** «ابحث عن الجواب» under a question's choices (the app's LookButton): opens its view in a sheet, with a way back to the question. */
export function LookButton({ look }: { look: QuizLook }) {
  const [open, setOpen] = useState(false);
  return <>
    <Button className="mt-3" size="sm" onClick={() => setOpen(true)}><Search size={16} aria-hidden />ابحث عن الجواب</Button>
    <Sheet open={open} onClose={() => setOpen(false)} label="ابحث عن الجواب" className="overflow-y-auto">
      {open && <div className="flex flex-col gap-3 p-4">
        <LookView look={look} />
        <Button className="self-start" onClick={() => setOpen(false)}>رجوع إلى السؤال</Button>
      </div>}
    </Sheet>
  </>;
}
