import { memo, useMemo, useState } from 'react';
import { View } from 'react-native';
import { pageModel, reciteView } from '@shared/quran/recitePage';
import { maxLetters } from '@shared/quran/writeAyah';
import MushafPageView, { type Recite } from './MushafPageView';
import { pageData, pageOfAyah, surahBefore, surahNames } from '@/lib/mushaf';
import { quizPageBefore } from '@/lib/settings';
import { useWriteBoxes, type Graded } from '@/lib/useWriteBoxes';
import type { Palette } from '@/lib/theme';

/** A page's text height for its width, as AyahLines and the home cards draw it. */
const PAGE_TEXT_RATIO = 1.5;
const NONE: Readonly<Record<string, unknown>> = {};
const NO_SAVES: ReadonlySet<string> = new Set();
const noTouch = () => {};
/** MushafPageView asks for an ayah's end sign with this word. */
const END = Number.MAX_SAFE_INTEGER;

/**
 * A quiz question about one ayah drawn as its whole mushaf page, the ayah in its own place and lines (owner, 2026-11-17):
 * the reader's page (MushafPageView) with recite mode's hidden words. «الصفحة قبلها» off (the default): every other word is
 * an empty box of its shape, surah titles too, only the ayah numbers left, and nothing around the page says where it is.
 * On: the ayat before it are written, as recite mode shows them. `opening` spoken words of the asked ayah show (the
 * mushaf's ۞ is no word); `shown` shows all of it. With `onGraded`, the rest is written in boxes in its places, as in the
 * reader's write mode, and graded once the last box is written; the page then colours what was right and wrong.
 */
function QuizPage({ ayah, opening, shown, nameless = false, onGraded, palette }: { ayah: string;
  /** How many of the ayah's spoken words show; all of them when left out. */
  opening?: number; shown: boolean;
  /** The surah is the answer («في أي سورة؟»): no surah title or name shows, even with the ayat before written. */
  nameless?: boolean;
  onGraded?: (graded: Graded) => void; palette: Palette }) {
  const [width, setWidth] = useState(0);
  const [before] = quizPageBefore.use();
  const [graded, setGraded] = useState<Graded | null>(null);
  const page = pageOfAyah(ayah);
  const parts = useMemo(() => {
    if (!page) return null;
    const data = pageData(page);
    const model = pageModel(data, surahBefore(page));
    // The ayah's words on its page, signs that are no words (۞) among them, and where its opening ends.
    const words = model.lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === ayah).map(group => group.word!) ?? []);
    const spoken = words.flatMap((word, at) => (maxLetters(word) ? [at] : []));
    const cut = opening === undefined ? words.length : spoken[opening] ?? words.length;
    return { data, model, words, cut, asked: spoken.filter(at => at >= cut) };
  }, [page, ayah, opening]);
  const writing = !!onGraded && !shown && !graded;
  const boxes = useWriteBoxes({ ayah: onGraded ? ayah : null, words: parts?.words ?? [], asked: onGraded ? parts?.asked ?? [] : [], onDone: result => {
    setGraded(result);
    onGraded?.(result);
  } });
  const open = shown || !!graded;
  const recite = useMemo((): Recite | null => {
    if (!parts) return null;
    const base = reciteView(parts.model, { start: ayah, shown: null, words: 0 });
    const titled = parts.model.titles;
    const [surah] = ayah.split(':').map(Number);
    const steps = ayah.endsWith(':1') ? titled.get(surah) ?? 0 : 0;
    const order = parts.model.order;
    const at = order.indexOf(ayah);
    return {
      ...base,
      // Every surah title on the page is a step of its first ayah, so a title stays hidden like the words.
      titled,
      upcoming: ayah,
      hidden: (key, word) => {
        // Ayah numbers stay, so the page keeps the shape of its ayat.
        if (word === END) return false;
        const title = key.endsWith(':1') ? titled.get(Number(key.split(':')[0])) ?? 0 : 0;
        if (key === ayah) return word < steps || (!open && word - steps >= parts.cut);
        const place = order.indexOf(key);
        if (!before || place < 0 || place > at) return true;
        return nameless && word < title;
      },
    };
  }, [parts, ayah, open, before, nameless]);
  if (!page || !parts) return null;
  return (
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 && (
        <MushafPageView page={page} data={parts.data} model={parts.model} palette={palette} width={width} height={width * PAGE_TEXT_RATIO} top={surahBefore(page)}
          names={surahNames} recite={recite} forgot={NONE} saved={NO_SAVES} onTouch={writing ? () => boxes.focus() : noTouch} anonymous={!before || nameless}
          write={writing ? { key: ayah, targets: parts.asked, typed: boxes.typed, current: boxes.current, onBox: boxes.pick } : null}
          checked={graded ? { key: ayah, ...graded } : null} />
      )}
      {writing && boxes.field}
    </View>
  );
}

export default memo(QuizPage);
