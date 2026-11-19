'use client';

import { Fragment, useState, type ReactNode } from 'react';
import useSWR from 'swr';
import { Check, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import Sheet from '@/components/common/Sheet';
import LoadingDots from '@/components/common/LoadingDots';
import StoryView from '@/components/stories/StoryView';
import BattleView from '@/components/battles/BattleView';
import type { QuizLook } from '@shared/quiz/choiceKinds';
import type { AppStory } from '@shared/stories/story';
import type { AppBattle } from '@shared/battles/battle';
import type { AyatPage } from '@/lib/storyAyat';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';
import ExternalLink from '@/components/common/ExternalLink';
import SadiText from '@/components/quran/SadiText';
import GharibPanel from '@/app/quran/read/GharibPanel';
import IrabPanel from '@/app/quran/read/IrabPanel';
import BalaghaPanel from '@/app/quran/read/BalaghaPanel';
import type { GharibAyah } from '@/app/quran/read/gharib';
import type { IrabAyah } from '@/app/quran/read/irab';
import type { BalaghaAyah } from '@/app/quran/read/balagha';
import { QiraatPlace } from '@/app/quran/qiraat/QiraatView';
import AyahLines, { useAyahPage } from '@/components/homepage/AyahLines';
import { PoemChapters } from '@/app/quran/tajwid/tuhfat-al-atfal/PoemView';
import poemStyles from '@/app/quran/tajwid/tuhfat-al-atfal/Poem.module.css';
import { numberVerses, type Poem } from '@shared/tajwid/poem';
import poemData from '@shared/tajwid/tuhfat-al-atfal.json';
import { QIRAAT_SOURCE } from '@shared/quran/qiraat';
import { tafsirSadiCredit, tafsirSadiPage, type TafsirPassage } from '@shared/quran/tafsirSadi';
import { SURAH_NAMES } from '@shared/quran/surahNames';
import { num } from '@shared/quran/arabicNumber';
import { plainName, type BalaghaTerm } from '@shared/quran/balaghaTerms';
import { TermQuotes } from '@/components/balagha/TermParts';

type Looked = { story: AppStory; ayat: AyatPage[][] } | { battle: AppBattle };

const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(url);
  return response.json();
};
const swr = { revalidateOnFocus: false };
const names: Record<number, string> = SURAH_NAMES;
const ayahName = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return `${names[surah] ?? num(surah)} ${num(ayah)}`; };
const TUHFA = numberVerses(poemData as Poem);

function Loading() {
  return <p className="py-6 text-center"><LoadingDots label="جارٍ التحميل" /></p>;
}
function Failed() {
  return <p role="alert" className="py-6 text-center text-[var(--home-muted)]">تعذّر التحميل، حاول مرة أخرى.</p>;
}
/** One fetched view: the dots while it loads, a line if it fails. */
function Fetched<T>({ url, children }: { url: string; children: (data: T) => ReactNode }) {
  const { data, error } = useSWR<T>(url, fetchJson, swr);
  // Keyed by its address, so a panel that keeps its own state (the picked word) starts afresh for another question.
  return error ? <Failed /> : data ? <Fragment key={url}>{children(data)}</Fragment> : <Loading />;
}

/** Al-Sa'di on each offered ayah, one at a time, as the reader's tafsir sheet shows him; once shown, the asked one first and checked. */
function TafsirLook({ keys, mark }: { keys: string[]; mark?: string }) {
  const [at, setAt] = useState(mark ?? keys[0]);
  return <div className="flex flex-col gap-3">
    <div className="flex flex-wrap gap-2">
      {keys.map(key => <Chip key={key} label={<>{key === mark && <Check size={13} aria-hidden />}{ayahName(key)}</>} on={key === at} role="tab" onClick={() => setAt(key)}
        name={key === mark ? `${ayahName(key)}، الجواب` : undefined} />)}
    </div>
    <Fetched<TafsirPassage> key={at} url={`/api/quran/tafsir?k=${encodeURIComponent(at)}`}>
      {passage => <Card className="flex flex-col gap-2 p-4">
        <SadiText text={passage.text} />
        <ExternalLink href={tafsirSadiPage(passage)} className="text-sm text-[var(--home-muted)]">{tafsirSadiCredit(passage)}</ExternalLink>
      </Card>}
    </Fetched>
  </div>;
}

/** The definition of each term offered, one at a time (the terms page's own card); once shown, the asked one first and checked. */
function TermsLook({ names, mark }: { names: string[]; mark?: string }) {
  const [at, setAt] = useState(mark ?? names[0]);
  return <Fetched<BalaghaTerm[]> url={`/api/terms?${names.map(name => `n=${encodeURIComponent(name)}`).join('&')}`}>
    {terms => {
      const term = terms.find(each => each.name === at || plainName(each.name) === plainName(at ?? '')) ?? terms[0];
      return <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {terms.map(each => <Chip key={each.name} role="tab" on={each === term} onClick={() => setAt(each.name)}
            label={<>{each.name === mark && <Check size={13} aria-hidden />}{plainName(each.name)}</>} name={each.name === mark ? `${plainName(each.name)}، الجواب` : undefined} />)}
        </div>
        <TermQuotes term={term} />
      </div>;
    }}
  </Fetched>;
}

/** The ayah in the mushaf's lines with each word the readers differ on, as the readings page and its feed card draw it. */
function QiraatLook({ ayah }: { ayah: string }) {
  const { pages } = useAyahPage(ayah);
  return <div className="flex flex-col gap-2">
    <QiraatPlace ayah={ayah} lines={pages ? <AyahLines ayah={ayah} pages={pages} shown whole checked={null} /> : <Loading />} />
    <ExternalLink href={QIRAAT_SOURCE.url} className="text-sm text-[var(--home-muted)]">{`المصدر: ${QIRAAT_SOURCE.name}`}</ExternalLink>
  </div>;
}

/** Tuhfat al-Atfal whole, as on its page; once marked, the chapter of the verse that answers, the verse lit. */
function TuhfaLook({ mark }: { mark?: number }) {
  const chapters = mark === undefined ? TUHFA : TUHFA.filter(chapter => chapter.verses.some(verse => verse.number === mark));
  return <div dir="rtl" lang="ar" className={poemStyles.poem}><PoemChapters chapters={chapters} mark={mark} /></div>;
}

/** The looks the website draws so far; the rest come with their features (the app draws every kind, mobile/src/components/QuizLook.tsx). */
const DRAWN: QuizLook['view'][] = ['story', 'battle', 'terms', 'word', 'irab', 'balagha', 'qiraat', 'tafsir', 'tuhfa'];
export const canLook = (look: QuizLook | undefined): look is QuizLook => !!look && DRAWN.includes(look.view);

/**
 * The feature's own view a question is looked up in (the app's LookView): the same drawing as the feature's page or the
 * reader's sheet. `shown` once the answer is: then what the look marks is lit.
 */
export function LookView({ look, shown }: { look: QuizLook; shown: boolean }) {
  const view = (() => {
    switch (look.view) {
      case 'story': return <Fetched<Looked> url={`/api/sira?story=${encodeURIComponent(look.slug)}`}>{data => 'story' in data && <StoryView story={data.story} ayat={data.ayat} titled inset />}</Fetched>;
      case 'battle': return <Fetched<Looked> url={`/api/sira?battle=${encodeURIComponent(look.slug)}`}>{data => 'battle' in data && <BattleView battle={data.battle} inset />}</Fetched>;
      case 'word': return <Fetched<GharibAyah> url={`/api/quran/gharib?k=${encodeURIComponent(look.key)}&w=${look.word}`}>{data => <GharibPanel data={data} />}</Fetched>;
      case 'irab': return <Fetched<IrabAyah> url={`/api/quran/irab?k=${encodeURIComponent(look.key)}&w=${look.word}`}>{data => <IrabPanel ayah={look.key} data={data} />}</Fetched>;
      case 'balagha': return <Fetched<BalaghaAyah> url={`/api/quran/balagha?k=${encodeURIComponent(look.key)}`}>{data => <BalaghaPanel ayah={look.key} data={data} />}</Fetched>;
      case 'qiraat': return <QiraatLook ayah={look.key} />;
      case 'tafsir': return <TafsirLook key={`${look.keys.join()}/${shown ? look.mark ?? '' : ''}`} keys={look.keys} mark={shown ? look.mark : undefined} />;
      case 'terms': return <TermsLook key={`${look.names.join()}/${shown ? look.mark ?? '' : ''}`} names={look.names} mark={shown ? look.mark : undefined} />;
      case 'tuhfa': return <TuhfaLook mark={shown ? look.mark : undefined} />;
      default: return null;
    }
  })();
  return <div dir="rtl" lang="ar" className="flex flex-col gap-2.5 text-[var(--home-ink)]">{view}</div>;
}

/** «ابحث عن الجواب» under a question's choices (the app's LookButton): opens its view in a sheet, with a way back to the question. */
export function LookButton({ look }: { look: QuizLook }) {
  const [open, setOpen] = useState(false);
  return <>
    <Button className="mt-3" size="sm" onClick={() => setOpen(true)}><Search size={16} aria-hidden />ابحث عن الجواب</Button>
    <Sheet open={open} onClose={() => setOpen(false)} label="ابحث عن الجواب" className="overflow-y-auto">
      {open && <div className="flex flex-col gap-3 p-4">
        <LookView look={look} shown={false} />
        <Button className="self-start" onClick={() => setOpen(false)}>رجوع إلى السؤال</Button>
      </div>}
    </Sheet>
  </>;
}
