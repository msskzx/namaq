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
import { LOOKED_POINTS, POINTS } from '@shared/quiz/score';
import { plainName, type BalaghaTerm } from '@shared/quran/balaghaTerms';
import { TermQuotes } from '@/components/balagha/TermParts';
import { FortyCard, FortyHadith } from '@/components/hadith/FortyParts';
import type { FortyListItem, FortyPage } from '@/lib/forty';
import { searchForty } from '@shared/hadith';
import Empty from '@/components/common/Empty';
import { SearchField } from '@/components/common/Field';
import type { NasabView, PersonHead, TiesView, VirtuesView } from '@/lib/tarajim';
import { NasabTree, TiesRing, Virtues } from '@/components/tarajim/TarajimParts';

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

/** Al-Nawawi's Forty with a search over their words; a hadith opens whole, as on its page. Once shown, the asked one is open. */
function HadithLook({ mark }: { mark?: number }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(mark);
  if (open !== undefined) return <div className="flex flex-col gap-3.5">
    <Button className="self-start" onClick={() => setOpen(undefined)}>رجوع إلى الأحاديث</Button>
    <Fetched<FortyPage> url={`/api/forty?n=${open}`}>{page => <FortyHadith {...page} inset />}</Fetched>
  </div>;
  return <Fetched<FortyListItem[]> url="/api/forty">
    {list => {
      const found = searchForty(list, query);
      return <div className="flex flex-col gap-3">
        <SearchField label="ابحث في الأربعين" placeholder="ابحث بكلمات من الحديث" value={query} onChangeText={setQuery} />
        {found.length ? found.map(item => <FortyCard key={item.n} item={item} onClick={() => setOpen(item.n)} />) : <Empty text="لا حديث فيه هذه الكلمات." />}
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
const DRAWN: QuizLook['view'][] = ['story', 'battle', 'terms', 'hadith', 'word', 'irab', 'balagha', 'qiraat', 'tafsir', 'tuhfa', 'ties', 'nasab', 'virtues'];
export const canLook = (look: QuizLook | undefined): look is QuizLook => !!look && DRAWN.includes(look.view);

/** A person's ties round him (the app's TiesLook): anyone found by a search or clicked on the ring moves to the middle; the trail goes back. */
function TiesLook({ slug, mark }: { slug: string; mark?: string }) {
  const [trail, setTrail] = useState([slug]);
  const [query, setQuery] = useState('');
  const at = trail[trail.length - 1];
  const go = (to: string) => { setTrail([...trail, to]); setQuery(''); };
  const { data: found } = useSWR<PersonHead[]>(query.trim() ? `/api/tarajim?q=${encodeURIComponent(query.trim())}` : null, fetchJson, swr);
  const { data: view, error } = useSWR<TiesView>(`/api/tarajim?ties=${encodeURIComponent(at)}`, fetchJson, { ...swr, keepPreviousData: true });
  return <>
    <SearchField label="ابحث عن شخص" placeholder="ابحث عن شخص" value={query} onChangeText={setQuery} />
    {query.trim()
      ? found === undefined ? <Loading /> : found.length
        ? <Card className="flex flex-col px-3.5 py-1">{found.map(p => <Button key={p.slug} variant="ghost" className="justify-start" onClick={() => go(p.slug)}>{p.name}</Button>)}</Card>
        : <Empty text="لا أحد بهذا الاسم في التراجم المضافة." />
      : <>
        {trail.length > 1 && view && (
          <div className="flex flex-wrap items-center gap-x-1">
            <Button variant="ghost" size="sm" onClick={() => setTrail(trail.slice(0, -1))}>رجوع</Button>
            <Button variant="ghost" size="sm" onClick={() => setTrail([slug])}>إلى أول الصلات</Button>
          </div>
        )}
        {error ? <Failed /> : view ? <TiesRing view={view} marked={mark} onPick={go} /> : <Loading />}
      </>}
  </>;
}

/** The virtues each offered person's entry gives, one person at a time (the app's VirtuesLook); once shown, the asked one is green. */
function VirtuesLook({ slugs, mark }: { slugs: string[]; mark?: { slug: string; index: number } }) {
  const [at, setAt] = useState(mark?.slug ?? slugs[0]);
  return <Fetched<VirtuesView[]> url={`/api/tarajim?virtues=${slugs.map(encodeURIComponent).join(',')}`}>{people => {
    const person = people.find(p => p.slug === at) ?? people[0];
    if (!person) return null;
    return <>
      <div className="flex flex-wrap gap-2">
        {people.map(p => <Chip key={p.slug} role="tab" on={p.slug === person.slug} onClick={() => setAt(p.slug)}
          name={p.slug === mark?.slug ? `${p.name}، الجواب` : undefined}
          label={<>{p.slug === mark?.slug && <Check size={14} aria-hidden />}{p.name}</>} />)}
      </div>
      <Card className="flex flex-col gap-2.5 p-4">
        <h3 className="text-[0.9375rem] text-[var(--home-accent)]">{person.sex === 'FEMALE' ? 'مناقبها' : 'مناقبه'}</h3>
        {person.virtues.length
          ? <Virtues view={person} marked={mark?.slug === person.slug ? mark.index : undefined} />
          : <Empty text="لم تُنقل له مناقب بعد." />}
      </Card>
    </>;
  }}</Fetched>;
}

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
      case 'hadith': return <HadithLook key={shown ? look.mark ?? '' : ''} mark={shown ? look.mark : undefined} />;
      case 'ties': return <TiesLook key={`${look.slug}/${shown ? look.mark ?? '' : ''}`} slug={look.slug} mark={shown ? look.mark : undefined} />;
      case 'nasab': return <Fetched<NasabView> url={`/api/tarajim?nasab=${look.slugs.map(encodeURIComponent).join(',')}${shown && look.mark ? '' : '&meetings=0'}`}>{data => <NasabTree view={data} linked={false} />}</Fetched>;
      case 'virtues': return <VirtuesLook key={`${look.slugs.join()}/${shown ? look.mark?.slug ?? '' : ''}`} slugs={look.slugs} mark={shown ? look.mark : undefined} />;
      case 'tuhfa': return <TuhfaLook mark={shown ? look.mark : undefined} />;
      default: return null;
    }
  })();
  return <div dir="rtl" lang="ar" className="flex flex-col gap-2.5 text-[var(--home-ink)]">{view}</div>;
}

/**
 * «ابحث عن الجواب» under a question's choices (the app's LookButton): opens its view in a sheet, with a way back to the
 * question. `onLook` runs as it opens (a party counts the look then, found or not); `costs` says under the button what a
 * look costs in a party; `top` stays in sight above the view, such as a party's clock (owner, 2026-11-19).
 */
export function LookButton({ look, onLook, costs = false, top }: { look: QuizLook; onLook?: () => void; costs?: boolean; top?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="mt-3 flex flex-col items-start gap-1">
    <Button size="sm" onClick={() => { setOpen(true); onLook?.(); }}><Search size={16} aria-hidden />ابحث عن الجواب</Button>
    {costs && <p dir="rtl" lang="ar" className="text-sm text-[var(--home-muted)]">{`بعد البحث للإجابة الصحيحة ${num(LOOKED_POINTS)} نقاط بدل ${num(POINTS)}.`}</p>}
    <Sheet open={open} onClose={() => setOpen(false)} label="ابحث عن الجواب" className="overflow-y-auto">
      {open && <>
        {top && <div className="sticky top-0 z-10 flex justify-center bg-[var(--home-paper)] pt-3 pb-2">{top}</div>}
        <div className="flex flex-col gap-3 p-4">
          <LookView look={look} shown={false} />
          <Button className="self-start" onClick={() => setOpen(false)}>رجوع إلى السؤال</Button>
        </div>
      </>}
    </Sheet>
  </div>;
}

/** What a party player sees after looking (the app's LookedNote): a right answer now earns half the points. */
export function LookedNote() {
  return <p dir="rtl" lang="ar" className="mt-3 flex items-center gap-1.5 text-[var(--home-amber)]">
    <Search size={15} aria-hidden />{`بحثتَ عنه · للإجابة الصحيحة ${num(LOOKED_POINTS)} نقاط`}
  </p>;
}
