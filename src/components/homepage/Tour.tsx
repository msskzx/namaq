'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, House, Play } from 'lucide-react';
import Button from '@/components/common/Button';
import Emblem from '@/components/common/Emblem';
import MushafText from '@/components/common/MushafText';
import BranchViewSetting from '@/components/quran/BranchViewSetting';
import { useLanguage } from '@/components/language/LanguageContext';
import BranchTree from '@/app/quran/branches/BranchTree';
import { PathProvider, usePaths } from '@/app/quran/branches/Paths';
import AyahCards from '@/app/quran/branches/AyahCards';
import StoryMap from '@/app/quran/prophets/[slug]/StoryMap';
import EventPlaces from '@/app/quran/prophets/[slug]/EventPlaces';
import MushafPage from '@/app/quran/read/MushafPage';
import mushaf from '@/app/quran/read/Mushaf.module.css';
import { num } from '@shared/quran/arabicNumber';
import { storyMap } from '@shared/quran/prophets/story';
import { pageModel, reciteView } from '@shared/quran/recitePage';
import type { RecitePosition } from '@shared/quran/recite';
import type { HomepageData } from '@/lib/homepageData';

export const TOUR_SEEN = 'tour-seen';
type Step = 'opening' | 'matrix' | 'tree' | 'view' | 'timeline' | 'recite';
type Props = { tour: HomepageData['tour']; story?: HomepageData['tourStory']; recite?: HomepageData['tourRecite']; names: Record<number, string> };

function seen() {
  try { return localStorage.getItem(TOUR_SEEN) === '1'; } catch { return true; }
}

/**
 * The first visit's tour, the app's steps: the logo and «ابدأ», the matrix of «إن المتقين في», the same ayat as a tree
 * (tap a node to light its path and see its ayah), tree or matrix as the default view, Adam's story map (tap a dot for
 * its ayat), and recite on the last mushaf page. «تخطَّ» moves on; the settings sheet plays it again.
 */
export default function Tour(props: Props) {
  const router = useRouter();
  const replay = useSearchParams().get('tour') === '1';
  // Each opening mounts a fresh body, so a replay starts with no lit path and no pick.
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!replay && seen()) return;
    setRun(value => value + 1);
  }, [replay]);

  if (!run) return null;
  function finish() {
    try { localStorage.setItem(TOUR_SEEN, '1'); } catch { /* the tour shows again next visit */ }
    setRun(0);
    if (replay) router.replace('/', { scroll: false });
  }
  return <TourBody key={run} {...props} onDone={finish} />;
}

function TourBody({ tour, story, recite, names, onDone }: Props & { onDone: () => void }) {
  const ar = useLanguage().language === 'ar';
  const steps: Step[] = ['opening', ...(tour ? ['matrix', 'tree', 'view'] as const : []), ...(story ? ['timeline'] as const : []), ...(recite ? ['recite'] as const : [])];
  const [step, setStep] = useState<Step>('opening');
  const [picked, setPicked] = useState(false);
  const [read, setRead] = useState(false);
  const [recited, setRecited] = useState(false);
  const paths = usePaths();
  const dialog = useRef<HTMLDivElement>(null);
  const tapped = [...paths.pinned.values()].at(-1);
  const byKey = useMemo(() => new Map(tour?.ayat.map(ayah => [ayah.key, ayah])), [tour]);

  // Modal: focus starts on «ابدأ», Tab stays inside, Escape ends the tour, and focus goes back where it was.
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLElement>('button')?.focus();
    return () => before?.focus?.();
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const element = dialog.current;
      if (event.key === 'Escape') { event.preventDefault(); onDone(); return; }
      if (event.key !== 'Tab' || !element) return;
      const items = [...element.querySelectorAll<HTMLElement>('button, a, [tabindex]:not([tabindex="-1"])')];
      const first = items[0], last = items[items.length - 1];
      if (!element.contains(document.activeElement)) { event.preventDefault(); first?.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  const at = steps.indexOf(step);
  const last = at === steps.length - 1;
  const next = () => (last ? onDone() : setStep(steps[at + 1]));
  const done = { opening: true, matrix: true, tree: !!tapped, view: picked, timeline: read, recite: recited }[step];
  const title = ar
    ? { opening: '', matrix: 'المصفوفة', tree: 'شجرة المتشابهات', view: 'أيهما تفضّل؟', timeline: 'قصص الأنبياء', recite: 'سمّع من المصحف' }
    : { opening: '', matrix: 'The matrix', tree: 'Similar-ayat tree', view: 'Which do you prefer?', timeline: 'Prophets’ stories', recite: 'Recite from the mushaf' };
  const hint = ar
    ? { tree: 'اضغط غصنًا', view: 'اختر أحدهما', timeline: 'اضغط نقطة لترى آياتها', recite: 'اضغط لتظهر الآية التالية' }
    : { tree: 'Tap a branch', view: 'Pick one', timeline: 'Tap a dot to see its ayat', recite: 'Tap to show the next ayah' };
  const where = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return `${names[surah] ?? num(surah)} ${num(ayah)}`; };
  const first = tapped && byKey.get(tapped[0]);

  return <div ref={dialog} role="dialog" aria-modal="true" aria-label={ar ? 'جولة تعريفية' : 'Tour'} dir={ar ? 'rtl' : 'ltr'}
    className="fixed inset-0 z-[60] flex flex-col bg-[var(--home-paper)] text-[var(--home-ink)]">
    {step === 'opening' ? <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <Emblem className="size-32" />
      <p className="mt-2 text-4xl font-bold">{ar ? 'نمق' : 'Namaq'}</p>
      <p className="text-lg text-[var(--home-muted)]">{ar ? 'تدبّر القرآن' : 'Ponder the Quran'}</p>
      <Button variant="primary" className="mt-9" onClick={next}><Play size={18} aria-hidden />{ar ? 'ابدأ' : 'Start'}</Button>
    </div> : <>
      <div className="mx-auto flex w-full max-w-2xl items-center px-4 pt-4">
        <h2 className="flex-1 text-xl font-bold">{title[step]}</h2>
        <button type="button" onClick={next} className="text-[var(--home-muted)]">{ar ? 'تخطَّ' : 'Skip'}</button>
      </div>
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-4 pt-3">
        {step === 'matrix' && tour && <div className="min-h-0 flex-1 overflow-y-auto" dir="rtl">
          <AyahCards ayahKeys={tour.ayat.map(ayah => ayah.key)} names={names} />
        </div>}
        {step === 'tree' && tour && <>
          {/* The tree card fills the room left between the title and the ayah, and its viewport takes what the card leaves,
              so the tree fits the window rather than its usual fixed height (which ran under the ayah on short screens). */}
          <div className="flex min-h-0 flex-1 flex-col [&>[data-tree]]:flex [&>[data-tree]]:min-h-0 [&>[data-tree]]:flex-1 [&>[data-tree]]:flex-col" dir="rtl">
            <PathProvider value={paths}>
              <BranchTree tree={tour.tree} prefixes={tour.prefixes} offsets={tour.offsets} names={names} viewportHeight="auto" surround={{ on: false, sync: true }} label={ar ? 'شجرة العبارات المشتركة' : 'Shared-phrase tree'} />
            </PathProvider>
          </div>
          {/* Room kept for the ayah from the start, so the tree does not jump when it shows. */}
          <div className="min-h-32 pt-3">{first && <div className="rounded-2xl border border-[var(--home-rule)] bg-[var(--home-card)] p-3 text-center" dir="rtl">
            <p className="font-quran text-2xl leading-loose" lang="ar"><MushafText>{first.words.join(' ')}</MushafText></p>
            <p className="text-sm text-[var(--home-muted)]">{tapped.map(where).join(' · ')}</p>
          </div>}</div>
        </>}
        {step === 'timeline' && story && <TourStory story={story} onRead={() => setRead(true)} />}
        {step === 'recite' && recite && <TourRecite recite={recite} onReveal={() => setRecited(true)} label={hint.recite} />}
        {step === 'view' && <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <BranchViewSetting onPick={() => setPicked(true)} />
          <p className="text-sm text-[var(--home-muted)]">{ar ? 'تغيّره متى شئت من الإعدادات' : 'Change it any time in settings'}</p>
        </div>}
      </div>
      <div className="flex flex-col items-center gap-4 px-4 pt-3 pb-8">
        {done
          ? <Button variant={last ? 'primary' : 'outline'} onClick={next}>{last ? <><House size={18} aria-hidden />{ar ? 'إلى الرئيسية' : 'Home'}</> : <>{ar ? <ArrowLeft size={18} aria-hidden /> : <ArrowRight size={18} aria-hidden />}{ar ? 'التالي' : 'Next'}</>}</Button>
          : <p className="rounded-full border-[1.5px] border-[var(--home-accent)] bg-[var(--home-card)] px-5 py-2">{hint[step as keyof typeof hint]}</p>}
        <div aria-hidden className="flex gap-2">
          {steps.slice(1).map(item => <span key={item} className={`h-1.5 rounded-full ${item === step ? 'w-4 bg-[var(--home-accent)]' : 'w-1.5 bg-[var(--home-rule)]'}`} />)}
        </div>
      </div>
    </>}
  </div>;
}

/** Adam's story map; a tapped dot shows that event's ayat under the map, as the prophets page does. */
function TourStory({ story, onRead }: { story: NonNullable<Props['story']>; onRead: () => void }) {
  const map = useMemo(() => storyMap(story.events), [story]);
  const [open, setOpen] = useState<{ event: number; surah?: number }>();
  const detail = useRef<HTMLDivElement>(null);
  const show = (event: number, surah?: number) => {
    setOpen({ event, surah });
    onRead();
    requestAnimationFrame(() => detail.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  return <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip pb-4" dir="rtl">
    <StoryMap map={map} events={story.events} phases={story.phases} onRead={show} current={open} />
    <div ref={detail} className="pt-4">
      {open && <EventPlaces slug="adam" compare={{}} event={story.events[open.event]} places={map.places[open.event]} phase={story.phases[story.events[open.event].phase]}
        focus={open.surah} hasPrev={open.event > 0} hasNext={open.event < story.events.length - 1} onStep={dir => show(open.event + dir)} />}
    </div>
  </div>;
}

/** The last mushaf page with its ayat hidden; each tap shows the next one, as recite mode does. */
function TourRecite({ recite, onReveal, label }: { recite: NonNullable<Props['recite']>; onReveal: () => void; label: string }) {
  const model = useMemo(() => pageModel(recite.data, recite.top), [recite]);
  const [position, setPosition] = useState<RecitePosition>({ start: recite.start, shown: null, words: 0 });
  const view = reciteView(model, position);
  const reveal = () => {
    const shown = view.nextAyah();
    if (shown) setPosition(shown);
    onReveal();
  };
  return <div onClick={reveal} className={`${mushaf.stage} cursor-pointer`} dir="rtl" lang="ar">
    <button type="button" onClick={event => { event.stopPropagation(); reveal(); }} className="sr-only">{label}</button>
    <MushafPage page={recite.page} data={recite.data} names={recite.names} top={recite.top} hidden={view.hidden} titled={view.titled} next={view.upcoming} />
  </div>;
}
