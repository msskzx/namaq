import { useMemo, useState, useSyncExternalStore } from 'react';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { ArrowLeftRight, Bookmark, Check, EyeOff, GalleryHorizontal, NotebookPen, Send, Trash2, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks, toggleBookmark, type Bookmark as Saved } from '@shared/bookmarks';
import { notesByDate, readAyahNotes, subscribeAyahNotes, writeAyahNote } from '@shared/ayahNotes';
import { markAyah, markWord, mostForgotten, readDueMarks, rememberAyah, subscribeDueMarks } from '@shared/ayahMarks';
import { BOOKMARK_KIND_LABEL, type BookmarkKind } from '@shared/bookmarkKind';
import { forgottenOrder } from '@shared/quran/recite';
import { num } from '@shared/quran/arabicNumber';
import TreeIcon from './TreeIcon';
import IconButton from '@/ui/IconButton';
import { surahName } from '@shared/quran/surahNames';

/** A card's button: its icon, its short name, and what a screen reader says; `color` marks the green «تذكّرتها». */
type MenuItem = { id: string; Icon: (props: LucideProps) => React.ReactNode; name: string; label: string; on?: boolean; color?: string; onPress: () => void };
import { shareAyah } from './AyahShare';
import CompareTargetsSheet from './CompareTargetsSheet';
import NoteSheet from './NoteSheet';
import { ayahMushafWords, ayahText } from '@/lib/mushaf';
import type { CompareTarget } from '@/lib/compare';
import { cardWays, forgottenCard, forgottenWays, noteCard, savedCard, shownBookmarks, shelfText, type CardWay, type SavedCard } from '@/lib/home';
import { followWay, openIntent } from '@/lib/ways';
import type { Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';
import { CardWithRow } from '@/ui/Card';
import { FEATURE_ICON } from '@/components/featureIcons';

const KIND_ICONS: Record<BookmarkKind, (props: LucideProps) => React.ReactNode> = { tree: TreeIcon, compare: ArrowLeftRight, ayah: FEATURE_ICON.mushaf, card: Bookmark };
const WAYS: Record<CardWay['to'], { label: string; name: string; Icon: (props: LucideProps) => React.ReactNode }> = {
  mushaf: { label: 'في المصحف', name: 'المصحف', Icon: FEATURE_ICON.mushaf },
  tree: { label: 'الشجرة', name: 'الشجرة', Icon: TreeIcon },
  matrix: { label: 'المصفوفة', name: 'المصفوفة', Icon: GalleryHorizontal },
  trees: { label: 'الأشجار التي فيها الآية', name: 'المتشابهات', Icon: TreeIcon },
  compare: { label: 'في المقارنة', name: 'المقارنة', Icon: ArrowLeftRight },
};

export const FORGOTTEN_LABEL = 'ما نسيته';
export const NOTE_LABEL = 'تأمل';

/**
 * A saved or forgotten card, or a note, on the full list (owner 2026-11-20: the home card's shape): its ayat in the card,
 * its ways and tools as buttons in the row under it, as a feed card's. A note's text is the reader's own words, so it is
 * not in the mushaf font.
 */
export function ShelfCard({ card, palette, items, note = false, Icon = KIND_ICONS[card.kind], label = BOOKMARK_KIND_LABEL[card.kind].ar }: {
  card: SavedCard; palette: Palette; items: MenuItem[]; note?: boolean; Icon?: (props: LucideProps) => React.ReactNode; label?: string;
}) {
  return (
    <CardWithRow palette={palette} spine gap={10} faded={!card.open} accessibilityLabel={`${label}: ${card.text}`}
      row={items.map(({ id, Icon: ItemIcon, label: name, on, color, onPress }) => (
        <IconButton key={id} Icon={ItemIcon} label={name} on={on} tone={color ? 'green' : undefined} onPress={onPress} />
      ))}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingBottom: card.references.length ? 8 : 0, borderBottomWidth: card.references.length ? 1 : 0, borderColor: palette.rule }}>
        <View style={{ height: 20, justifyContent: 'center' }}><Icon size={16} color={palette.accent} /></View>
        {card.references.length > 0 && (
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 2 }}>
            {card.references.map(reference => (
              <Text key={reference.surah} style={{ color: palette.muted, fontSize: 13, lineHeight: 20 }}>
                {surahName(reference.surah)} {reference.ayat.map(num).join(reference.range ? '–' : '، ')}
              </Text>
            ))}
          </View>
        )}
      </View>
      {note
        ? <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 28, textAlign: 'right' }}>{card.text}</Text>
        : <AyahFlow color={palette.ink}><AyahWords>{shelfText(card)}</AyahWords></AyahFlow>}
    </CardWithRow>
  );
}

/**
 * The saved and forgotten cards and the buttons under each, for the full list page. `menus` renders the compare chooser
 * and the note sheet; place it once at the end of the screen.
 */
export function useHomeCards(palette: Palette) {
  const allBookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const bookmarks = useMemo(() => shownBookmarks(allBookmarks), [allBookmarks]);
  const cards = useMemo(() => bookmarks.map(savedCard), [bookmarks]);
  const [choosing, setChoosing] = useState<{ way: CardWay; targets: CompareTarget[] } | null>(null);
  const marks = useSyncExternalStore(subscribeDueMarks, readDueMarks);
  const forgotten = useMemo(() => forgottenOrder(Object.keys(marks)), [marks]);
  const forgottenCards = useMemo(() => mostForgotten(marks).map(key => forgottenCard(key, markWord(key) === undefined ? ayahText(key) : ayahMushafWords(markAyah(key))[markWord(key)!] ?? '')), [marks]);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes);
  const noteCards = useMemo(() => notesByDate(notes).map(key => noteCard(key, notes[key].text)), [notes]);
  const [noting, setNoting] = useState<string | null>(null);
  /** Every other view of a card's ayat; compare across several surahs is picked next. */
  const wayItems = (ways: CardWay[]): MenuItem[] => ways.map(way => ({
    id: way.to, ...WAYS[way.to],
    onPress: () => (way.to === 'compare' && way.targets.length > 1 ? setChoosing({ way, targets: way.targets }) : followWay(way)),
  }));
  const savedItems = (card: SavedCard): MenuItem[] => {
    const item: Saved | undefined = bookmarks.find(saved => saved.id === card.id);
    if (!item) return [];
    return [
      ...wayItems(cardWays(item)),
      { id: 'saved', Icon: Bookmark, name: 'احفظ', label: 'أزلها من المحفوظات', on: true, onPress: () => toggleBookmark(item) },
    ];
  };
  const forgottenItems = (card: SavedCard): MenuItem[] => [
    { id: 'recite', Icon: EyeOff, name: 'سمّع', label: 'سمّع من هذه الآية', onPress: () => card.open && openIntent(card.open) },
    ...wayItems(forgottenWays(card.id)),
    { id: 'clear', Icon: Check, name: 'تذكّرتها', label: 'تذكّرتها', color: palette.green, onPress: () => rememberAyah(card.id) },
  ];
  const noteItems = (card: SavedCard): MenuItem[] => [
    { id: 'edit', Icon: NotebookPen, name: 'عدّل', label: 'عدّل التأمل', onPress: () => setNoting(card.id) },
    ...wayItems(forgottenWays(card.id)),
    { id: 'delete', Icon: Trash2, name: 'احذف', label: 'احذف التأمل', onPress: () => writeAyahNote(card.id, '') },
    { id: 'share', Icon: Send, name: 'مشاركة', label: 'مشاركة', onPress: () => shareAyah(card.id, palette, card.text, true) },
  ];
  const menus = (<>
    <CompareTargetsSheet targets={choosing?.targets ?? null} palette={palette}
      onPick={target => { const way = choosing!.way; setChoosing(null); followWay(way, target); }} onClose={() => setChoosing(null)} />
    <NoteSheet ayah={noting} onClose={() => setNoting(null)} palette={palette} />
  </>);
  return { cards, forgotten, forgottenCards, noteCards, savedItems, forgottenItems, noteItems, menus };
}

/** The review button: the reader in recite mode on the first forgotten ayah in mushaf order, stepping through the rest. */
export const reviewForgotten = (forgotten: string[]) => openIntent({ tab: 'read', at: markAyah(forgotten[0]), word: markWord(forgotten[0]), recite: true, review: true });
export const REVIEW_LABEL = 'راجع ما نسيت';
