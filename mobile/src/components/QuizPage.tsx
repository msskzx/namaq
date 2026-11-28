import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { UnderCard, useCardRow } from '@/ui/Card';
import { View } from 'react-native';
import type { RecitePosition } from '@shared/quran/recite';
import { pageModel } from '@shared/quran/recitePage';
import { shownCut, type PageAsk, type PenRule } from '@shared/quran/writeAyah';
import MushafPageView, { type Recite } from './MushafPageView';
import RecitePill from './recite/RecitePill';
import { writtenGrade } from '@shared/quiz/score';
import { useRecite } from './recite/useRecite';
import { pageData, pageOfAyah, surahBefore } from '@/lib/mushaf';
import { quizPageBefore, useQuizPen } from '@/lib/settings';
import { isBoolean, readJson, writeJson } from '@/lib/storage';
import type { Graded } from '@/lib/useWriteBoxes';
import type { Palette } from '@/lib/theme';
import { SURAH_TITLES } from '@shared/quran/surahNames';

const PAGE_TEXT_RATIO = 1.5;
const NONE: Readonly<Record<string, unknown>> = {};
const NO_SAVES: ReadonlySet<string> = new Set();
const noTouch = () => {};
const END = Number.MAX_SAFE_INTEGER;
export type PartyWrite = { pen: PenRule; asked: number[];
  onWrite: (answer: string[], done: boolean) => void; words?: string[]; answer?: string[] | null };

const WRITE = 'quiz-write';

function QuizPage({ ayah, ask, shown, onWritten, onShown, party, palette }: { ayah: string; ask: PageAsk; shown: boolean;
  onWritten?: (graded: Graded) => void; onShown?: () => void;
  party?: PartyWrite; palette: Palette }) {
  const [width, setWidth] = useState(0);
  const inRow = useCardRow();
  const [before] = quizPageBefore.use();
  const quizPen = useQuizPen();
  const pen = party?.pen ?? quizPen;
  const [sent, setSent] = useState(false);
  const page = pageOfAyah(ayah);
  const parts = useMemo(() => {
    if (!page) return null;
    const data = pageData(page);
    const model = pageModel(data, surahBefore(page));
    const words = model.lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === ayah).map(group => group.word!) ?? []);
    return { data, model, cut: shownCut(ayah, words, ask.shows) };
  }, [page, ayah, ask.shows]);
  const [position, setPosition] = useState<RecitePosition>(() => ({ start: ayah, shown: null, words: parts?.cut ?? 0 }));
  const [writing, setWriting] = useState(() => readJson(WRITE, isBoolean) ?? true);
  const toggleWriting = () => setWriting(on => { writeJson(WRITE, !on); return !on; });
  const recite = useRecite({ model: ask.recite ? parts?.model ?? null : null, position, setPosition, writing: (writing || !!party) && !shown && !sent, pen, until: ayah, floor: parts?.cut ?? 0,
    onWritten: (_key, graded) => onWritten?.(graded),
    onSubmit: party ? (_key, typed) => { setSent(true); party.onWrite(party.asked.map(at => typed[at] ?? ''), true); } : undefined });
  const typedSoFar = recite.write?.typed;
  const latest = useRef(party);
  latest.current = party;
  useEffect(() => {
    if (typedSoFar && latest.current && !sent) latest.current.onWrite(latest.current.asked.map(at => typedSoFar[at] ?? ''), false);
  }, [typedSoFar, sent]);
  const marked = shown && party?.words && party.answer ? { key: ayah, ...writtenGrade({ asked: party.asked, words: party.words }, party.answer) } : null;
  const open = shown || !ask.recite || recite.done;
  useEffect(() => { if (recite.done) onShown?.(); }, [recite.done]); // eslint-disable-line react-hooks/exhaustive-deps
  const nameless = ask.title === 'hidden';
  const view = useMemo((): Recite | null => {
    if (!parts) return null;
    const titled = parts.model.titles;
    const [surah] = ayah.split(':').map(Number);
    const steps = ayah.endsWith(':1') ? titled.get(surah) ?? 0 : 0;
    const order = parts.model.order;
    const at = order.indexOf(ayah);
    const base = recite.view;
    return {
      ...(base ?? { upcoming: ayah, gap: null, nextAyah: () => null, nextWord: () => null }),
      upcoming: open ? null : base?.upcoming ?? ayah,
      titled,
      hidden: (key, word) => {
        if (word === END) return false;
        const title = key.endsWith(':1') ? titled.get(Number(key.split(':')[0])) ?? 0 : 0;
        if (key === ayah) return word < steps ? ask.title !== 'shown' && (nameless || !open || !before) : !open && !!base?.hidden(ayah, word - steps);
        const place = order.indexOf(key);
        if (!before || place < 0 || place > at) return true;
        return nameless && word < title;
      },
    };
  }, [parts, ayah, open, before, nameless, ask.title, recite.view]);
  if (!page || !parts) return null;
  return (
    <View style={{ gap: 10 }}>
      <View onLayout={event => setWidth(event.nativeEvent.layout.width)}>
        {width > 0 && (
          <MushafPageView page={page} data={parts.data} model={parts.model} palette={palette} width={width} height={width * PAGE_TEXT_RATIO} top={surahBefore(page)}
            names={SURAH_TITLES} recite={view} forgot={NONE} saved={NO_SAVES} onTouch={recite.write ? () => recite.boxes.focus() : noTouch} anonymous={!before || nameless}
            write={shown ? null : recite.write} checked={marked ?? recite.checked} />
        )}
      </View>
      {ask.recite && !shown && !sent && <UnderCard><RecitePill recite={recite} writing={writing || !!party} onWriting={toggleWriting} palette={palette} small={inRow} /></UnderCard>}
      {recite.write && recite.boxes.field}
    </View>
  );
}

export default memo(QuizPage);
