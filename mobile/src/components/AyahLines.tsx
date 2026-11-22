import { memo, useMemo, useState } from 'react';
import { View } from 'react-native';
import { pageModel, reciteView } from '@shared/quran/recitePage';
import { ayahSlice, pageEnd, pageTop, rangeSlice, READING_LINES } from '@shared/quran/ayahSlice';
import MushafPageView, { type Checked, type Touch, type Write } from './MushafPageView';
import { pageData, pageOfAyah, surahBefore } from '@/lib/mushaf';
import type { Palette } from '@/lib/theme';
import { SURAH_TITLES } from '@shared/quran/surahNames';
import { AyahMenuPress, type AyahMenuKeys } from '@/ui/AyahMenuPress';

/** A page's text height for its width: the lines of a slice keep the size they have on the whole page. */
const PAGE_TEXT_RATIO = 1.5;
const NONE: Readonly<Record<string, unknown>> = {};
const NO_SAVES: ReadonlySet<string> = new Set();
const noTouch = () => {};

/** One ayah's words as the page sets them (the reader's write mode takes the same list). */
export function pageWords(ayah: string): string[] {
  const page = pageOfAyah(ayah);
  if (!page) return [];
  const model = pageModel(pageData(page), surahBefore(page));
  return model.lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === ayah).map(group => group.word) ?? []);
}

/**
 * An ayah in the mushaf's own lines, as recite mode shows it (owner, 2026-11-14): the reader's page (MushafPageView) cut to
 * the lines around the ayah, words in their places. What comes before it shows (a little of the ayah before, or its surah's
 * title), the ayah and what follows are hidden, and `write` puts the boxes where the asked words are. `shown` reveals the
 * ayah, with `checked` colouring what was written.
 */
function AyahLines({ ayah, menu, palette, write, checked, shown, words = 0, whole = false, targetWord, onTouch = noTouch }: { ayah: string; palette: Palette; write: Write | null; checked: Checked | null; shown: boolean;
  /** A long press opens the reader's menu on this ayah (AyahFlow's `menu`); false in recite mode, whose long press is its own. */
  menu: AyahMenuKeys;
  /** A tap or long press on the lines (MushafPageView's), as the reader's page takes it. */
  onTouch?: (touch: Touch, key: string | null, x: number, y: number, word?: number) => void;
  /** The ayah's first words shown so far, as recite mode's next-word button shows them. */
  words?: number;
  /** The lines as the page sets them, nothing hidden (a saved ayah). */
  whole?: boolean; targetWord?: number }) {
  const [width, setWidth] = useState(0);
  const page = pageOfAyah(ayah);
  const parts = useMemo(() => {
    if (!page) return null;
    const data = pageData(page);
    const model = pageModel(data, surahBefore(page));
    const slice = ayahSlice(model.lines, data.items, ayah);
    if (!slice) return null;
    const previous = slice.before && page > 1 ? { page: page - 1, data: pageData(page - 1), model: pageModel(pageData(page - 1), surahBefore(page - 1)), slice: pageEnd(pageData(page - 1).items) } : null;
    return { data, model, slice, previous };
  }, [ayah, page]);
  const recite = useMemo(() => (parts ? reciteView(parts.model, { start: ayah, ...(targetWord !== undefined ? { gaps: [targetWord] } : {}), shown: shown ? ayah : null, words: shown ? 0 : words }) : null), [parts, ayah, shown, words, targetWord]);
  if (!page || !parts) return null;
  const height = width * PAGE_TEXT_RATIO;
  return (
    <AyahMenuPress menu={menu}>
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 && parts.previous && (
        <MushafPageView page={parts.previous.page} data={parts.previous.data} model={parts.previous.model} palette={palette} width={width} height={height}
          top={surahBefore(parts.previous.page)} names={SURAH_TITLES} forgot={NONE} saved={NO_SAVES} onTouch={onTouch} slice={parts.previous.slice} />
      )}
      {width > 0 && (
        <MushafPageView page={page} data={parts.data} model={parts.model} palette={palette} width={width} height={height} top={surahBefore(page)}
          names={SURAH_TITLES} recite={whole ? undefined : recite} forgot={NONE} saved={NO_SAVES} onTouch={onTouch} write={shown ? null : write} checked={shown ? checked : null} slice={parts.slice} />
      )}
    </View>
    </AyahMenuPress>
  );
}

export default memo(AyahLines);

/** The mushaf's lines on a page. */
export const PAGE_LINES = 15;

/** A page's first lines exactly as the reader draws them (the reading card on home, owner 2026-11-14); `lines={PAGE_LINES}` is the whole page. */
export const PageTop = memo(function PageTop({ page, palette, lines = READING_LINES }: { page: number; palette: Palette; lines?: number }) {
  const [width, setWidth] = useState(0);
  const parts = useMemo(() => {
    const data = pageData(page);
    return { data, model: pageModel(data, surahBefore(page)), slice: pageTop(data.items, lines) };
  }, [page, lines]);
  return (
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)} pointerEvents="none">
      {width > 0 && <MushafPageView page={page} data={parts.data} model={parts.model} palette={palette} width={width} height={width * PAGE_TEXT_RATIO}
        top={surahBefore(page)} names={SURAH_TITLES} forgot={NONE} saved={NO_SAVES} onTouch={noTouch} slice={parts.slice} />}
    </View>
  );
});

/** Ayat `from`..`to` of one surah in the mushaf's own lines, page after page, as the reader draws them (a story's recited ayat, owner 2026-11-18). */
export const AyatRange = memo(function AyatRange({ from, to, palette }: { from: string; to: string; palette: Palette }) {
  const [width, setWidth] = useState(0);
  const parts = useMemo(() => {
    const first = pageOfAyah(from);
    const last = pageOfAyah(to);
    if (!first || !last) return [];
    return Array.from({ length: last - first + 1 }, (_, i) => first + i).flatMap(page => {
      const data = pageData(page);
      const model = pageModel(data, surahBefore(page));
      const slice = rangeSlice(model.lines, data.items, from, to);
      return slice ? [{ page, data, model, slice }] : [];
    });
  }, [from, to]);
  // A long press opens the reader's menu, asking which of the ayat (owner, 2026-11-22).
  const keys = useMemo(() => {
    const [surah, first] = from.split(':').map(Number);
    const last = Number(to.split(':')[1]);
    return Array.from({ length: last - first + 1 }, (_, i) => `${surah}:${first + i}`);
  }, [from, to]);
  return (
    <AyahMenuPress menu={keys}>
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 && parts.map(part => (
        <MushafPageView key={part.page} page={part.page} data={part.data} model={part.model} palette={palette} width={width} height={width * PAGE_TEXT_RATIO}
          top={surahBefore(part.page)} names={SURAH_TITLES} forgot={NONE} saved={NO_SAVES} onTouch={noTouch} slice={part.slice} />
      ))}
    </View>
    </AyahMenuPress>
  );
});
