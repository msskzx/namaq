import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { FlatList, Platform, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronDown, ChevronLeft, ChevronUp, List } from 'lucide-react-native';
import type { PageKey, StoriesPage, StoryChapter } from '@shared/stories/pages';
import { CHAPTER_BATTLE } from '@shared/stories/chapterBattles';
import type { AppStory } from '@shared/stories/story';
import { holdsTerms } from '@shared/quran/searchAll';
import Empty from '@/ui/Empty';
import { Text } from '@/ui/Text';
import TapRow from '@/ui/TapRow';
import StripTabs from '@/ui/StripTabs';
import { useTabRetap } from '@/lib/tabRetap';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Sheet from '@/ui/Sheet';
import IconButton from '@/ui/IconButton';
import Reference from '@/ui/Reference';
import { usePalette, type Palette } from '@/lib/theme';
import { setCompact, useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back, toTab } from '@/lib/ways';
import { STORIES, STORY_CHAPTERS, STORY_PAGES, STORY_TAGS } from '@/lib/stories';
import { storyPages } from '@shared/stories/pages';
import Chip from '@/ui/Chip';
import RowScroll from '@/ui/RowScroll';

type Scroller = ComponentRef<typeof ScrollView>;

const openStory = (slug: string) => router.push({ pathname: '/story', params: { slug } });

/** One story in a chapter: a row under a hairline, the whole row a link. */
function StoryRow({ name, slug, palette, onLeave }: { name: string; slug: string; palette: Palette; onLeave?: () => void }) {
  return (
    <TapRow onPress={() => { onLeave?.(); openStory(slug); }} role="link" label={name} style={{ alignItems: 'center', gap: 6, borderTopWidth: 1, borderColor: `${palette.rule}70` }}>
      <Text style={{ flex: 1, color: palette.ink, fontSize: 17, textAlign: 'right' }}>{name}</Text>
      <ChevronLeft size={18} color={palette.muted} />
    </TapRow>
  );
}

/** A chapter, folded to its name and first stories; open, every story in it and its battle page. */
function ChapterCard({ chapter, palette, startOpen = false, onLeave }: { chapter: StoryChapter; palette: Palette; startOpen?: boolean; onLeave?: () => void }) {
  const [open, setOpen] = useState(startOpen);
  const battle = CHAPTER_BATTLE[chapter.name];
  const others = chapter.stories.map(story => story.name).filter(name => name !== chapter.name);
  return (
    <Card palette={palette} pad={[4, 14]} gap={0}>
      <TapRow onPress={() => setOpen(was => !was)} expanded={open} label={chapter.name} style={{ alignItems: 'center', gap: 8 }}>
        <Text style={{ flex: 1, color: palette.ink, fontSize: 19, textAlign: 'right' }}>{chapter.name}</Text>
        {open ? <ChevronUp size={18} color={palette.muted} /> : <ChevronDown size={18} color={palette.muted} />}
      </TapRow>
      {open ? (
        <>
          {chapter.stories.map(story => <StoryRow key={story.slug} name={story.name} slug={story.slug} palette={palette} onLeave={onLeave} />)}
          {battle ? (
            <TapRow onPress={() => { onLeave?.(); toTab({ pathname: '/battle', params: { slug: battle } }); }} role="link" style={{ alignItems: 'center', gap: 6, borderTopWidth: 1, borderColor: `${palette.rule}70` }}>
              <Text style={{ color: palette.accent, fontSize: 15, textAlign: 'right' }}>صفحة الغزوة</Text>
              <ChevronLeft size={16} color={palette.accent} />
            </TapRow>
          ) : null}
        </>
      ) : others.length ? (
        <Text numberOfLines={1} style={{ color: palette.muted, fontSize: 14, textAlign: 'right', paddingBottom: 8 }}>
          {others.join('، ')}
        </Text>
      ) : null}
    </Card>
  );
}

/** One year's page: its heading, where its year comes from, and its chapters. */
function YearPage({ page, width, height, bottom, palette, scrollers }: { page: StoriesPage; width: number; height: number; bottom: number; palette: Palette; scrollers: Map<PageKey, Scroller> }) {
  const shrink = useShrinkOnScroll();
  return (
    <ScrollView ref={node => { if (node) scrollers.set(page.key, node); else scrollers.delete(page.key); }} onScroll={shrink} scrollEventThrottle={16} style={{ width, height, direction: 'rtl' }} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 10 }}>
      <View style={{ gap: 2 }}>
        <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 21, textAlign: 'right' }}>{page.title}</Text>
        <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>
          {page.key === 'none' ? 'ما لم يضعه مصدر في سنة، على أبواب صحيح البخاري' : 'على أبواب صحيح البخاري'}
        </Text>
        {page.refs.length ? <Reference title="مصدر السنة" quotes={page.refs} palette={palette} /> : null}
      </View>
      {page.chapters.map(chapter => <ChapterCard key={chapter.name} chapter={chapter} palette={palette} />)}
    </ScrollView>
  );
}

/** «الفهرس»: every chapter in al-Bukhari's order, each opening to all its stories whatever their year. */
function Contents({ open, onClose, startAt, palette }: { open: boolean; onClose: () => void; startAt?: string; palette: Palette }) {
  const sheet = useRef<Scroller>(null);
  return (
    <Sheet open={open} onClose={onClose} palette={palette} tall>
      <ScrollView ref={sheet} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 24 }}>
        <View style={{ gap: 2 }}>
          <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 21, textAlign: 'right' }}>الفهرس</Text>
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>أبواب صحيح البخاري، بترتيبه</Text>
        </View>
        {STORY_CHAPTERS.map(chapter => (chapter.name === startAt
          // The chapter a search opened comes open and in view.
          ? <View key={`${chapter.name}*`} onLayout={event => sheet.current?.scrollTo({ y: event.nativeEvent.layout.y, animated: false })}>
            <ChapterCard chapter={chapter} palette={palette} startOpen onLeave={onClose} />
          </View>
          : <ChapterCard key={chapter.name} chapter={chapter} palette={palette} onLeave={onClose} />))}
      </ScrollView>
    </Sheet>
  );
}

/** What the search reads in a story: its name, chapter, place and tags, and the words of its first report. */
const storyText = (story: AppStory) => [story.name, story.chapter, story.place?.value ?? '', ...story.tags,
  ...(story.reports[0]?.moments ?? []).flatMap(moment => [moment.title, moment.text])].join(' ');
const STORY_TEXT = new Map<string, string>();
const textOf = (story: AppStory) => { let text = STORY_TEXT.get(story.slug); if (text === undefined) STORY_TEXT.set(story.slug, text = storyText(story)); return text; };

/** The search's finds (owner, 2026-11-24: the search here opened the app's search, not the stories): the chapters named, then the stories that hold the words. */
function Found({ query, palette }: { query: string; palette: Palette }) {
  const chapters = STORY_CHAPTERS.filter(chapter => holdsTerms(chapter.name, query));
  const stories = STORIES.filter(story => holdsTerms(textOf(story), query));
  if (!chapters.length && !stories.length) return <Empty text="لا قصة ولا باب فيه هذه الكلمات" palette={palette} />;
  return (
    <>
      {chapters.map(chapter => <ChapterCard key={chapter.name} chapter={chapter} palette={palette} />)}
      {stories.length > 0 && <Card palette={palette} pad={[4, 14]} gap={0}>
        {stories.map(story => <StoryRow key={story.slug} name={story.name} slug={story.slug} palette={palette} />)}
      </Card>}
    </>
  );
}

/**
 * «قصص السيرة» (owner, 2026-11-23): a page for each year, swiped right to left as the book is read, the strip on top going
 * to any year; on each page al-Bukhari's chapters in his order. A story is on a year only where a source gives it that
 * year («بلا سنة» holds the rest); a tag (owner, 2026-11-18) narrows every year to its stories. «الفهرس» lists every
 * chapter whole, and the search in the top bar finds a chapter, or a story by its name, place, tags or words.
 */
export default function StoriesScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const { chapter } = useLocalSearchParams<{ chapter?: string }>();
  // A search hit opens «الفهرس» at its chapter once; the param is cleared so the same hit opens it again.
  const [contents, setContents] = useState(Boolean(chapter));
  const [startAt, setStartAt] = useState(chapter);
  useEffect(() => {
    if (!chapter) return;
    setStartAt(chapter);
    setContents(true);
    router.setParams({ chapter: undefined });
  }, [chapter]);
  const [query, setQuery] = useState('');
  const typed = useDeferredValue(query.trim());
  const [tag, setTag] = useState<string | null>(null);
  const pages = useMemo(() => (tag ? storyPages(STORIES.filter(story => story.tags.includes(tag))) : STORY_PAGES), [tag]);
  const [at, setAt] = useState(0);
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });
  const list = useRef<FlatList<StoriesPage>>(null);
  const shown = useRef(0);
  const scrollers = useRef(new Map<PageKey, Scroller>()).current;
  // A tap on the open tab's button brings the shown year back to its top.
  useTabRetap('stories', () => scrollers.get(pages[shown.current]?.key)?.scrollTo({ y: 0, animated: true }));
  const go = useCallback((index: number) => {
    shown.current = index;
    setAt(index);
    setCompact(false);
    list.current?.scrollToIndex({ index, animated: true });
  }, []);
  const settle = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const index = Math.round(Math.abs(event.nativeEvent.contentOffset.x) / width);
    if (index === shown.current || index < 0 || index >= pages.length) return;
    shown.current = index;
    setCompact(false);
    setAt(index);
  }, [width, pages]);
  // The web build snaps with CSS and sends no momentum event, so it settles when scrolling stops.
  const quiet = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scrolled = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Platform.OS !== 'web') return;
    const { nativeEvent } = event;
    clearTimeout(quiet.current);
    quiet.current = setTimeout(() => settle({ nativeEvent } as NativeSyntheticEvent<NativeScrollEvent>), 150);
  }, [settle]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في قصص السيرة', label: 'ابحث في قصص السيرة' }}>
        <IconButton Icon={List} label="الفهرس" onPress={() => { setStartAt(undefined); setContents(true); }} size="bar" />
      </TopBar>
      {typed ? (
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 10 }}>
          <Found query={typed} palette={palette} />
        </ScrollView>
      ) : <>
      <View style={{ paddingHorizontal: 16, paddingTop: 4, gap: 6 }}>
        <RowScroll gap={6}>
          {STORY_TAGS.map(name => <Chip key={name} label={name} on={tag === name} small palette={palette} onPress={() => {
            // A tag narrows every year to its stories, from the first year it has.
            setTag(was => (was === name ? null : name));
            shown.current = 0;
            setAt(0);
            list.current?.scrollToOffset({ offset: 0, animated: false });
          }} />)}
        </RowScroll>
      </View>
      <StripTabs labels={pages.map(page => page.label)} names={pages.map(page => page.title)} at={at} onPick={go} palette={palette} />
      <View style={{ flex: 1, direction: 'ltr' }} onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
        {width > 0 && (
          <FlatList ref={list} data={pages} horizontal inverted pagingEnabled showsHorizontalScrollIndicator={false} initialScrollIndex={Math.min(at, pages.length - 1)}
            keyExtractor={page => String(page.key)} getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            extraData={{ palette, bottom }} onMomentumScrollEnd={settle} onScroll={scrolled} scrollEventThrottle={16} onScrollToIndexFailed={() => {}}
            renderItem={({ item }) => <YearPage page={item} width={width} height={height} bottom={bottom} palette={palette} scrollers={scrollers} />} />
        )}
      </View>
      </>}
      <Contents open={contents} onClose={() => setContents(false)} startAt={startAt} palette={palette} />
    </View>
  );
}
