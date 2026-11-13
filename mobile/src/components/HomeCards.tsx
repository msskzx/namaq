import { useMemo, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import { ArrowLeftRight, Bookmark, BookOpen, Check, EyeOff, GalleryHorizontal, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks, toggleBookmark, type Bookmark as Saved } from '@shared/bookmarks';
import { clearForgotten, readAyahMarks, recentlyForgotten, subscribeAyahMarks } from '@shared/ayahMarks';
import { BOOKMARK_KIND_LABEL, type BookmarkKind } from '@shared/bookmarkKind';
import { forgottenOrder } from '@shared/quran/recite';
import { num } from '@shared/quran/arabicNumber';
import TreeIcon from './TreeIcon';
import CardMenu, { type MenuAt, type MenuItem } from './CardMenu';
import CompareTargetsSheet from './CompareTargetsSheet';
import { ayahText, surahNames } from '@/lib/mushaf';
import type { CompareTarget } from '@/lib/compare';
import { cardWays, forgottenCard, forgottenWays, savedCard, shownBookmarks, shelfText, type CardWay, type SavedCard } from '@/lib/home';
import { followWay, openIntent } from '@/lib/ways';
import { QURAN_FONT, type Palette } from '@/lib/theme';

const KIND_ICONS: Record<BookmarkKind, (props: LucideProps) => React.ReactNode> = { tree: TreeIcon, compare: ArrowLeftRight, ayah: BookOpen };
const WAYS: Record<CardWay['to'], { label: string; Icon: (props: LucideProps) => React.ReactNode }> = {
  mushaf: { label: 'في المصحف', Icon: BookOpen },
  tree: { label: 'الشجرة', Icon: TreeIcon },
  matrix: { label: 'المصفوفة', Icon: GalleryHorizontal },
  trees: { label: 'الأشجار التي فيها الآية', Icon: TreeIcon },
  compare: { label: 'في المقارنة', Icon: ArrowLeftRight },
};

export const FORGOTTEN_LABEL = 'آية نسيتها';

/** A saved or forgotten card: on a shelf it is a fixed-width book with five lines; wide, it fills the row and shows the whole text. */
export function ShelfCard({ card, palette, onPress, wide = false, Icon = KIND_ICONS[card.kind], label = BOOKMARK_KIND_LABEL[card.kind].ar }: {
  card: SavedCard; palette: Palette; onPress: (at: MenuAt) => void; wide?: boolean; Icon?: (props: LucideProps) => React.ReactNode; label?: string;
}) {
  const box = useRef<ComponentRef<typeof View>>(null);
  // A screen reader's tap often carries no point: the menu then opens over the card's top.
  const open = ({ pageX, pageY }: { pageX: number; pageY: number }) => {
    if (pageX || pageY) onPress({ x: pageX, y: pageY });
    else box.current?.measureInWindow((x: number, y: number, width: number) => onPress({ x: x + width / 2, y: y + 24 }));
  };
  return (
    <Pressable ref={box} onPress={event => open(event.nativeEvent)} accessibilityRole="button" accessibilityLabel={`${label}: ${card.text}`}
      style={({ pressed }) => ({ width: wide ? '100%' : 250, minHeight: wide ? 0 : 200, padding: 14, gap: 10, borderWidth: 1, borderStartWidth: 5, borderColor: palette.rule, borderRadius: 6, backgroundColor: palette.paperDeep, opacity: pressed ? 0.75 : card.open ? 1 : 0.6 })}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingBottom: card.references.length ? 8 : 0, borderBottomWidth: card.references.length ? 1 : 0, borderColor: palette.rule }}>
        <View style={{ height: 20, justifyContent: 'center' }}><Icon size={16} color={palette.accent} /></View>
        {card.references.length > 0 && (
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 2 }}>
            {card.references.map(reference => (
              <Text key={reference.surah} style={{ color: palette.muted, fontSize: 13, lineHeight: 20 }}>
                {surahNames[reference.surah]} {reference.ayat.map(num).join(reference.range ? '–' : '، ')}
              </Text>
            ))}
          </View>
        )}
      </View>
      <Text numberOfLines={wide ? undefined : 5} style={{ marginVertical: 'auto', color: palette.ink, fontFamily: QURAN_FONT, fontSize: 21, lineHeight: 40, textAlign: 'right' }}>{shelfText(card)}</Text>
    </Pressable>
  );
}

/** A row of cards, the first on the right. Inverted in a left-to-right box, as the compare pager does, so it starts on the right on every platform. */
export function Shelf({ cards, render }: { cards: SavedCard[]; render: (card: SavedCard, index: number) => React.ReactNode }) {
  return (
    <View style={{ direction: 'ltr', marginHorizontal: -16 }}>
      <FlatList data={cards} horizontal inverted showsHorizontalScrollIndicator={false} keyExtractor={card => card.id}
        contentContainerStyle={{ gap: 12, paddingVertical: 4, paddingHorizontal: 16 }}
        renderItem={({ item, index }) => <View style={{ direction: 'rtl' }}>{render(item, index)}</View>} />
    </View>
  );
}

/**
 * The saved and forgotten cards with their tap menus, for the homepage shelves and the full list page.
 * `menus` renders the icon row and the compare chooser; place it once at the end of the screen.
 */
export function useHomeCards(palette: Palette) {
  const allBookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const bookmarks = useMemo(() => shownBookmarks(allBookmarks), [allBookmarks]);
  const cards = useMemo(() => bookmarks.map(savedCard), [bookmarks]);
  const [menu, setMenu] = useState<{ at: MenuAt; label: string; items: MenuItem[] } | null>(null);
  const [choosing, setChoosing] = useState<{ way: CardWay; targets: CompareTarget[] } | null>(null);
  const marks = useSyncExternalStore(subscribeAyahMarks, readAyahMarks);
  const forgotten = useMemo(() => forgottenOrder(Object.keys(marks)), [marks]);
  const forgottenCards = useMemo(() => recentlyForgotten(marks).map(key => forgottenCard(key, ayahText(key))), [marks]);
  /** Every other view of a card's ayat; compare across several surahs is picked next. */
  const wayItems = (ways: CardWay[]): MenuItem[] => ways.map(way => ({
    id: way.to, ...WAYS[way.to],
    onPress: () => (way.to === 'compare' && way.targets.length > 1 ? setChoosing({ way, targets: way.targets }) : followWay(way)),
  }));
  const savedMenu = (card: SavedCard, at: MenuAt) => {
    const item: Saved | undefined = bookmarks.find(saved => saved.id === card.id);
    if (!item) return;
    setMenu({ at, label: BOOKMARK_KIND_LABEL[card.kind].ar, items: [
      ...wayItems(cardWays(item)),
      { id: 'saved', Icon: Bookmark, label: 'أزلها من المحفوظات', on: true, onPress: () => toggleBookmark(item) },
    ] });
  };
  const forgottenMenu = (card: SavedCard, at: MenuAt) => setMenu({ at, label: FORGOTTEN_LABEL, items: [
    { id: 'recite', Icon: EyeOff, label: 'سمّع من هذه الآية', onPress: () => card.open && openIntent(card.open) },
    ...wayItems(forgottenWays(card.id)),
    { id: 'clear', Icon: Check, label: 'تذكّرتها، أزلها من المراجعة', onPress: () => clearForgotten(card.id) },
  ] });
  const menus = (<>
    <CardMenu at={menu?.at ?? null} items={menu?.items ?? []} label={menu?.label ?? ''} onClose={() => setMenu(null)} palette={palette} />
    <CompareTargetsSheet targets={choosing?.targets ?? null} palette={palette}
      onPick={target => { const way = choosing!.way; setChoosing(null); followWay(way, target); }} onClose={() => setChoosing(null)} />
  </>);
  return { cards, forgotten, forgottenCards, savedMenu, forgottenMenu, menus };
}

/** The review button: the reader in recite mode on the first forgotten ayah in mushaf order, stepping through the rest. */
export const reviewForgotten = (forgotten: string[]) => openIntent({ tab: 'read', at: forgotten[0], recite: true, review: true });
export const reviewLabel = (count: number) => `راجع ما نسيت (${num(count)})`;
