import { useMemo, useState, useSyncExternalStore } from 'react';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { ArrowLeftRight, Bookmark, GalleryHorizontal, NotebookPen, Send, Trash2, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks, toggleBookmark, type Bookmark as Saved } from '@shared/bookmarks';
import { notesByDate, readAyahNotes, subscribeAyahNotes, writeAyahNote } from '@shared/ayahNotes';
import { markAyah, markWord } from '@shared/ayahMarks';
import { BOOKMARK_KIND_LABEL, type BookmarkKind } from '@shared/bookmarkKind';
import { num } from '@shared/quran/arabicNumber';
import TreeIcon from './TreeIcon';
import IconButton from '@/ui/IconButton';
import { surahName } from '@shared/quran/surahNames';
import { shareAyah } from './AyahShare';
import CompareTargetsSheet from './CompareTargetsSheet';
import NoteSheet from './NoteSheet';
import type { CompareTarget } from '@/lib/compare';
import { cardWays, noteCard, savedCard, shownBookmarks, shelfText, type CardWay, type SavedCard } from '@/lib/home';
import type { Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';
import { CardWithRow } from '@/ui/Card';
import OpenButton from '@/ui/OpenButton';
import PostHead from '@/ui/PostHead';
import { ayahSections, sectionNames, sectionOn } from '@/lib/ayahPage';
import { useBooks } from '@/lib/books';
import { followWay, openAyahPage, openIntent } from '@/lib/ways';
import { FEATURE_ICON } from '@/components/featureIcons';

type MenuItem = { id: string; Icon: (props: LucideProps) => React.ReactNode; name: string; label: string; on?: boolean; color?: string; onPress: () => void };

const KIND_ICONS: Record<BookmarkKind, (props: LucideProps) => React.ReactNode> = { tree: TreeIcon, compare: ArrowLeftRight, ayah: FEATURE_ICON.mushaf, card: Bookmark };
const WAYS: Record<CardWay['to'], { label: string; name: string; Icon: (props: LucideProps) => React.ReactNode }> = {
  mushaf: { label: 'في المصحف', name: 'المصحف', Icon: FEATURE_ICON.mushaf },
  tree: { label: 'الشجرة', name: 'الشجرة', Icon: TreeIcon },
  matrix: { label: 'المصفوفة', name: 'المصفوفة', Icon: GalleryHorizontal },
  trees: { label: 'الأشجار التي فيها الآية', name: 'المتشابهات', Icon: TreeIcon },
  compare: { label: 'في المقارنة', name: 'المقارنة', Icon: ArrowLeftRight },
};

export const NOTE_LABEL = 'تأمل';

export function ShelfCard({ card, palette, items, open, note = false, Icon = KIND_ICONS[card.kind], label = BOOKMARK_KIND_LABEL[card.kind].ar }: {
  card: SavedCard; palette: Palette; items: MenuItem[]; open?: { onPress: () => void; label: string }; note?: boolean; Icon?: (props: LucideProps) => React.ReactNode; label?: string;
}) {
  const places = card.references.map(reference => `${surahName(reference.surah)} ${reference.ayat.map(num).join(reference.range ? '–' : '، ')}`).join(' · ');
  const ayah = card.kind === 'ayah' || note ? ayahOfCard(card) : null;
  const books = useBooks();
  const saved = card.kind === 'ayah' && !note;
  const holds = useMemo(() => (ayah && saved ? sectionNames(ayahSections(ayah).filter(sectionOn)) : []), [ayah, saved, books]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <View style={{ gap: 4 }}>
      <PostHead Icon={Icon} title={places || label} sub={places && card.kind !== 'ayah' ? label : undefined} palette={palette} />
      <CardWithRow palette={palette} gap={8} faded={!card.open && !open} accessibilityLabel={`${label}: ${card.text}`} onPress={open?.onPress}
        lead={open ? <OpenButton label={open.label} onPress={open.onPress} /> : undefined}
        row={items.map(({ id, Icon: ItemIcon, label: name, on, color, onPress }) => (
          <IconButton key={id} Icon={ItemIcon} label={name} on={on} tone={color ? 'green' : undefined} onPress={onPress} />
        ))}>
        {note
          ? <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 28, textAlign: 'right' }}>{card.text}</Text>
          : <AyahFlow color={palette.ink} menu={ayah ?? card.references.flatMap(reference => referenceKeys(reference))}><AyahWords>{shelfText(card)}</AyahWords></AyahFlow>}
        {holds.length > 0 && <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 22, textAlign: 'right' }}>{holds.join(' · ')}</Text>}
      </CardWithRow>
    </View>
  );
}

const referenceKeys = ({ surah, ayat, range }: { surah: number; ayat: number[]; range?: boolean }) =>
  (range ? Array.from({ length: ayat[ayat.length - 1] - ayat[0] + 1 }, (_, i) => ayat[0] + i) : ayat).map(ayah => `${surah}:${ayah}`);

const ayahOfCard = (card: SavedCard) => markAyah(card.id.startsWith('ayah:') ? card.id.slice('ayah:'.length) : card.id);

export function useHomeCards(palette: Palette) {
  const allBookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const bookmarks = useMemo(() => shownBookmarks(allBookmarks), [allBookmarks]);
  const cards = useMemo(() => bookmarks.map(savedCard), [bookmarks]);
  const [choosing, setChoosing] = useState<{ way: CardWay; targets: CompareTarget[] } | null>(null);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes);
  const noteCards = useMemo(() => notesByDate(notes).map(key => noteCard(key, notes[key].text)), [notes]);
  const [noting, setNoting] = useState<string | null>(null);
  const wayItems = (ways: CardWay[]): MenuItem[] => ways.map(way => ({
    id: way.to, ...WAYS[way.to],
    onPress: () => (way.to === 'compare' && way.targets.length > 1 ? setChoosing({ way, targets: way.targets }) : followWay(way)),
  }));
  const savedItems = (card: SavedCard): MenuItem[] => {
    const item: Saved | undefined = bookmarks.find(saved => saved.id === card.id);
    if (!item) return [];
    const all = cardWays(item);
    const ways = card.kind === 'ayah' ? all.filter(way => way.to === 'mushaf') : all.filter(way => way.to !== card.kind);
    return [
      ...wayItems(ways),
      { id: 'saved', Icon: Bookmark, name: 'احفظ', label: 'أزلها من المحفوظات', on: true, onPress: () => toggleBookmark(item) },
      ...(card.kind === 'ayah' ? [{ id: 'share', Icon: Send, name: 'مشاركة', label: 'مشاركة', onPress: () => shareAyah(ayahOfCard(card), palette) }] : []),
    ];
  };
  const noteItems = (card: SavedCard): MenuItem[] => [
    { id: 'edit', Icon: NotebookPen, name: 'عدّل', label: 'عدّل التأمل', onPress: () => setNoting(card.id) },
    { id: 'delete', Icon: Trash2, name: 'احذف', label: 'احذف التأمل', onPress: () => writeAyahNote(card.id, '') },
    { id: 'share', Icon: Send, name: 'مشاركة', label: 'مشاركة', onPress: () => shareAyah(card.id, palette, card.text, true) },
  ];
  const openOf = (card: SavedCard): { onPress: () => void; label: string } | undefined => {
    if (card.kind === 'ayah') return { onPress: () => openAyahPage(ayahOfCard(card)), label: 'افتح صفحة الآية' };
    if ((card.kind === 'tree' || card.kind === 'compare') && card.open) {
      const intent = card.open;
      return { onPress: () => openIntent(intent), label: card.kind === 'tree' ? 'افتح الشجرة' : 'افتح المقارنة' };
    }
    return undefined;
  };
  const openAyah = (card: SavedCard) => ({ onPress: () => openAyahPage(ayahOfCard(card)), label: 'افتح صفحة الآية' });
  const menus = (<>
    <CompareTargetsSheet targets={choosing?.targets ?? null} palette={palette}
      onPick={target => { const way = choosing!.way; setChoosing(null); followWay(way, target); }} onClose={() => setChoosing(null)} />
    <NoteSheet ayah={noting} onClose={() => setNoting(null)} palette={palette} />
  </>);
  return { cards, noteCards, savedItems, noteItems, openOf, openAyah, menus };
}

export const reviewForgotten = (forgotten: string[]) => openIntent({ tab: 'read', at: markAyah(forgotten[0]), word: markWord(forgotten[0]), recite: true, review: true });
export const REVIEW_LABEL = 'راجع ما نسيت';
