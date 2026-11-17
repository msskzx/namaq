import { memo, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import type { RecitePosition } from '@shared/quran/recite';
import { pageModel } from '@shared/quran/recitePage';
import { shownCut, type PageAsk } from '@shared/quran/writeAyah';
import MushafPageView, { type Recite } from './MushafPageView';
import RecitePill from './recite/RecitePill';
import { useRecite } from './recite/useRecite';
import { pageData, pageOfAyah, surahBefore, surahNames } from '@/lib/mushaf';
import { quizPageBefore, useQuizPen } from '@/lib/settings';
import { readJson, writeJson } from '@/lib/storage';
import type { Graded } from '@/lib/useWriteBoxes';
import type { Palette } from '@/lib/theme';

/** A page's text height for its width, as AyahLines and the home cards draw it. */
const PAGE_TEXT_RATIO = 1.5;
const NONE: Readonly<Record<string, unknown>> = {};
const NO_SAVES: ReadonlySet<string> = new Set();
const noTouch = () => {};
/** MushafPageView asks for an ayah's end sign with this word. */
const END = Number.MAX_SAFE_INTEGER;
/** Whether the quiz's recite bar starts with the pen on (writing) or off (revealing). */
const WRITE = 'quiz-write';

/**
 * A quiz question about one ayah drawn as its whole mushaf page, the ayah in its own place and lines (owner, 2026-11-17):
 * the reader's page (MushafPageView). «الصفحة قبلها» off (the default): every other word is an empty box of its shape,
 * surah titles too, only the ayah numbers left, and nothing around the page says where it is. On: the ayat before it are
 * written. `ask` (the question's PageAsk) says how much of the asked ayah shows and whether its surah title shows. A recited
 * question (`ask.recite`) is recited with recite mode's own bar (recite/), as in the mushaf, stopping at the ayah's end:
 * `onWritten` gets the grade when the pen wrote it, `onShown` runs once it shows. `shown` shows all of it.
 */
function QuizPage({ ayah, ask, shown, onWritten, onShown, palette }: { ayah: string; ask: PageAsk; shown: boolean;
  onWritten?: (graded: Graded) => void; onShown?: () => void; palette: Palette }) {
  const [width, setWidth] = useState(0);
  const [before] = quizPageBefore.use();
  const pen = useQuizPen();
  const page = pageOfAyah(ayah);
  const parts = useMemo(() => {
    if (!page) return null;
    const data = pageData(page);
    const model = pageModel(data, surahBefore(page));
    const words = model.lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === ayah).map(group => group.word!) ?? []);
    return { data, model, cut: shownCut(ayah, words, ask.shows) };
  }, [page, ayah, ask.shows]);
  const [position, setPosition] = useState<RecitePosition>(() => ({ start: ayah, shown: null, words: parts?.cut ?? 0 }));
  const [writing, setWriting] = useState(() => readJson<boolean>(WRITE) ?? true);
  const toggleWriting = () => setWriting(on => { writeJson(WRITE, !on); return !on; });
  const recite = useRecite({ model: ask.recite ? parts?.model ?? null : null, position, setPosition, writing: writing && !shown, pen, until: ayah, floor: parts?.cut ?? 0,
    onWritten: (_key, graded) => onWritten?.(graded) });
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
      ...(base ?? { upcoming: ayah, nextAyah: () => null, nextWord: () => null }),
      // The quiz stops at its ayah: nothing after it is the next one.
      upcoming: open ? null : base?.upcoming ?? ayah,
      // Every surah title on the page is a step of its first ayah, so a title stays hidden like the words.
      titled,
      hidden: (key, word) => {
        // Ayah numbers stay, so the page keeps the shape of its ayat.
        if (word === END) return false;
        const title = key.endsWith(':1') ? titled.get(Number(key.split(':')[0])) ?? 0 : 0;
        // The asked ayah's surah title shows when it is the question, and else stays hidden until it is answered (always
        // when the surah is the answer); its words are recite mode's.
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
            names={surahNames} recite={view} forgot={NONE} saved={NO_SAVES} onTouch={recite.write ? () => recite.boxes.focus() : noTouch} anonymous={!before || nameless}
            write={shown ? null : recite.write} checked={recite.checked} />
        )}
      </View>
      {ask.recite && !shown && <RecitePill recite={recite} writing={writing} onWriting={toggleWriting} palette={palette} />}
      {recite.write && recite.boxes.field}
    </View>
  );
}

export default memo(QuizPage);
