import { memo, useMemo, useState } from 'react';
import { View } from 'react-native';
import { pageModel, reciteView } from '@shared/quran/recitePage';
import { ayahSlice, pageEnd } from '@shared/quran/ayahSlice';
import MushafPageView, { type Checked, type Write } from './MushafPageView';
import { pageData, pageOfAyah, surahBefore, surahNames } from '@/lib/mushaf';
import type { Palette } from '@/lib/theme';

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
function AyahLines({ ayah, palette, write, checked, shown, whole = false }: { ayah: string; palette: Palette; write: Write | null; checked: Checked | null; shown: boolean;
  /** The lines as the page sets them, nothing hidden (a saved ayah). */
  whole?: boolean }) {
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
  const recite = useMemo(() => (parts ? reciteView(parts.model, { start: ayah, shown: shown ? ayah : null, words: 0 }) : null), [parts, ayah, shown]);
  if (!page || !parts) return null;
  const height = width * PAGE_TEXT_RATIO;
  return (
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 && parts.previous && (
        <MushafPageView page={parts.previous.page} data={parts.previous.data} model={parts.previous.model} palette={palette} width={width} height={height}
          top={surahBefore(parts.previous.page)} names={surahNames} forgot={NONE} saved={NO_SAVES} onTouch={noTouch} slice={parts.previous.slice} />
      )}
      {width > 0 && (
        <MushafPageView page={page} data={parts.data} model={parts.model} palette={palette} width={width} height={height} top={surahBefore(page)}
          names={surahNames} recite={whole ? undefined : recite} forgot={NONE} saved={NO_SAVES} onTouch={noTouch} write={shown ? null : write} checked={shown ? checked : null} slice={parts.slice} />
      )}
    </View>
  );
}

export default memo(AyahLines);
