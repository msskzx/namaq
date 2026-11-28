import { memo, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bookmark, EyeOff, Lightbulb, LightbulbOff, NotebookPen, ScrollText, Send, TableOfContents } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import OpenButton from '@/ui/OpenButton';
import PostHead from '@/ui/PostHead';
import { CardWithRow } from '@/ui/Card';
import FactCells from '@/ui/FactCells';
import QuoteBar from '@/ui/QuoteBar';
import TraitChips from '@/ui/TraitChips';
import { sourcesOf } from '@/ui/SourceLine';
import type { Source } from '@/ui/sourceSlot';
import { num } from '@shared/quran/arabicNumber';
import { surahName } from '@shared/quran/surahNames';
import { readBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { ayahBookmarkId, ayahHref, readDueMarks, subscribeDueMarks, toggleForgotten } from '@shared/ayahMarks';
import { readAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { withoutOpeningQuote } from '@shared/quran/ayahNotes';
import { noteBody } from '@shared/quran/ayahNoteBody';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import { ayahPlaces } from '@shared/quran/ayahPlaces';
import { surahTopicsCredit, surahTopicsOf } from '@shared/quran/surahTopics';
import { gharibCredit, gharibPage, GHARIB_BOOK, type GharibAt } from '@shared/quran/gharib';
import gharibData from '@shared/data/quran/gharib';
import { juzOf } from '@shared/quran/juz';
import { itqanCredit, itqanPage, ITQAN_BOOK } from '@shared/quran/itqanBalagha';
import { kashshafCredit, kashshafPage, KASHSHAF_BOOK, type KashshafData } from '@shared/quran/kashshaf';
import { sadiSource } from '@shared/quiz/bookSources';
import { citeSource, mushafSource } from '@shared/quiz/sources';
import { eventSources, oathSources } from '@shared/drawingCards';
import { ayahSections, sectionOn, type AyahSection } from '@/lib/ayahPage';
import { treePiecesOfAyah } from '@/lib/ayahPreview';
import { prophetStory } from '@/lib/prophets';
import { findPerson, personName } from '@/lib/tarajim';
import { People } from '@/components/battles/BattleParts';
import { reportHadith, revealedIn } from '@shared/stories/story';
import { factSources, pageSources, saidBy } from '@shared/tarajim';
import { bookState, readBook, useBooks } from '@/lib/books';
import { ayahCounts, ayahMushafWords, ayahText, pageOfAyah } from '@/lib/mushaf';
import { openIntent, toTab, openSahih } from '@/lib/ways';
import { usePalette, type Palette } from '@/lib/theme';
import { QuranWord } from '@/components/quran/text/AyahFlow';
import LitAyat from '@/components/quran/text/LitAyat';
import AyahPreviewSheet, { type Preview } from '@/components/AyahPreviewSheet';
import BalaghaSheet from '@/components/BalaghaSheet';
import GharibSheet, { type GharibTarget } from '@/components/GharibSheet';
import IrabSheet, { type IrabTarget } from '@/components/IrabSheet';
import NoteSheet from '@/components/NoteSheet';
import TopicSheet, { type TopicOpen } from '@/components/TopicSheet';
import QiraatPlace from '@/components/QiraatPlace';
import SurahRoute from '@/components/SurahRoute';
import { FEATURE_ICON } from '@/components/featureIcons';
import QuranWords from '@/components/quran/text/QuranWords';
import { shareAyah } from '@/components/AyahShare';

type Icon = React.ComponentProps<typeof PostHead>['Icon'];

const bookLine = (book: string, cite: string, url: string): Source => ({ line: book, quotes: [{ text: '', cite, url }] });

const LINES = 4;

export default function AyahScreen() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ key?: string; at?: string; word?: string }>();
  const key = params.key ?? '1:1';
  const [surah, number] = key.split(':').map(Number);
  useBooks();
  const kashshafOn = bookState('kashshaf') === 'on';
  const [kashshaf, setKashshaf] = useState<KashshafData | null>(null);
  useEffect(() => {
    let live = true;
    if (kashshafOn) void readBook<KashshafData>('kashshaf').then(data => { if (live) setKashshaf(data); });
    else setKashshaf(null);
    return () => { live = false; };
  }, [kashshafOn]);
  const sections = useMemo(() => ayahSections(key, kashshaf), [key, kashshaf]).filter(sectionOn);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const due = useSyncExternalStore(subscribeDueMarks, readDueMarks);
  const saved = bookmarks.some(item => item.id === ayahBookmarkId(key));
  const forgot = !!due[key];
  const note = notes[key]?.text;
  const [preview, setPreview] = useState<Preview | null>(null);
  const [balagha, setBalagha] = useState<string | null>(null);
  const [gharib, setGharib] = useState<GharibTarget | null>(null);
  const [irab, setIrab] = useState<IrabTarget | null>(null);
  const [noting, setNoting] = useState<string | null>(null);
  const [topic, setTopic] = useState<TopicOpen | null>(null);
  const open = useMemo<Openers>(() => ({ preview: setPreview, balagha: setBalagha, gharib: setGharib, irab: setIrab, topic: setTopic }), []);
  const word = params.word === undefined ? 0 : Number(params.word);
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const scrolledTo = useRef(false);
  const reachAt = (id: string) => (id === params.at && !scrolledTo.current
    ? (y: number) => { scrolledTo.current = true; scroller.current?.scrollTo({ y: Math.max(0, y - 8), animated: false }); }
    : undefined);
  const title = `${surahName(surah)} ${num(number)}`;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={() => (router.canGoBack() ? router.back() : toTab('/'))} title={title} />
      <ScrollView ref={scroller} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32, gap: 18 }}>
        <CardWithRow palette={palette} pad={0} gap={0} clip source={sourcesOf([mushafSource(key, pageOfAyah(key))])}
          lead={<Button pill label="في المصحف" Icon={FEATURE_ICON.mushaf} accessibilityLabel={`افتح ${title} في المصحف`} onPress={() => openIntent({ tab: 'read', at: key })} />}
          row={<>
            <IconButton Icon={EyeOff} label="سمّع من هذه الآية" onPress={() => openIntent({ tab: 'read', at: key, recite: true })} />
            <IconButton Icon={forgot ? LightbulbOff : Lightbulb} label={forgot ? 'تذكّرتها' : 'نسيت الآية'} on={forgot} onPress={() => toggleForgotten(key)} />
            <IconButton Icon={Bookmark} label={saved ? 'أزلها من المحفوظات' : 'احفظ الآية'} on={saved} fill onPress={() => toggleBookmark({ id: ayahBookmarkId(key), text: ayahText(key), href: ayahHref(key) })} />
            <IconButton Icon={NotebookPen} label={note ? 'ما دوّنته عن الآية' : 'دوّن عن الآية'} on={!!note} onPress={() => setNoting(key)} />
            <IconButton Icon={Send} label="مشاركة" onPress={() => shareAyah(key, palette, note)} />
          </>}>
          <View style={{ padding: 12 }}><LitAyat ayat={[{ words: ayahMushafWords(key), lit: [], number }]} menu={key} palette={palette} /></View>
          <FactCells palette={palette} cells={[
            { key: 'surah', label: 'السورة', readings: [{ value: surahName(surah) }] },
            { key: 'ayah', label: 'الآية', readings: [{ value: num(number), by: `من ${num(ayahCounts.get(surah) ?? number)}` }] },
            { key: 'juz', label: 'الجزء', readings: [{ value: num(juzOf(key)) }] },
            { key: 'page', label: 'الصفحة', readings: [{ value: num(pageOfAyah(key) ?? 0) }] },
          ]} />
        </CardWithRow>
        {note ? (
          <Part Icon={NotebookPen} title="ما دوّنته" palette={palette} open={() => setNoting(key)} label="عدّل ما دوّنته">
            <Text numberOfLines={LINES} style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{note}</Text>
          </Part>
        ) : null}
        {sections.map((section, i) => (
          <SectionPart key={`${section.id}-${i}`} section={section} ayah={key} word={word} palette={palette} onAt={reachAt(section.id)} open={open} />
        ))}
      </ScrollView>
      <AyahPreviewSheet preview={preview} onClose={() => setPreview(null)} palette={palette} />
      <BalaghaSheet ayah={balagha} onClose={() => setBalagha(null)} palette={palette} />
      <GharibSheet target={gharib} onClose={() => setGharib(null)} palette={palette} />
      <IrabSheet target={irab} onClose={() => setIrab(null)} palette={palette} />
      <NoteSheet ayah={noting} onClose={() => setNoting(null)} palette={palette} />
      <TopicSheet open={topic} onClose={() => setTopic(null)} onJump={(s, a) => openIntent({ tab: 'read', at: `${s}:${a}` })} palette={palette} />
    </View>
  );
}

function Part({ Icon, title, sub, open, label, source, onAt, palette, children }: { Icon: Icon; title: string; sub?: string; open: () => void; label: string;
  source?: Source[]; onAt?: (y: number) => void; palette: Palette; children: React.ReactNode }) {
  return (
    <View style={{ gap: 4 }} onLayout={onAt ? event => onAt(event.nativeEvent.layout.y) : undefined}>
      <PostHead Icon={Icon} title={title} sub={sub} palette={palette} />
      <CardWithRow palette={palette} pad={[10, 14]} gap={6} lead={<OpenButton label={label} onPress={open} />} source={source}>{children}</CardWithRow>
    </View>
  );
}

type Openers = {
  preview: (preview: Preview) => void; balagha: (key: string) => void; gharib: (target: GharibTarget) => void; irab: (target: IrabTarget) => void;
  topic: (open: TopicOpen) => void;
};

function BookText({ text, lines = LINES, palette }: { text: string; lines?: number; palette: Palette }) {
  return (
    <Text numberOfLines={lines} style={{ color: palette.ink, fontSize: 17, lineHeight: 31, textAlign: 'right', writingDirection: 'rtl' }}>
      {tafsirRuns(text).map((run, i) => (run.quran ? <QuranWords key={i} style={{ color: palette.accent }}>{run.text}</QuranWords> : run.text))}
    </Text>
  );
}

const SectionPart = memo(function SectionPart({ section, ayah, word, palette, open, onAt }: {
  section: AyahSection; ayah: string; word: number; palette: Palette; open: Openers; onAt?: (y: number) => void;
}) {
  const [surah] = ayah.split(':').map(Number);
  const common = { palette, onAt };
  switch (section.id) {
    case 'tafsir': {
      const { passage } = section;
      const run = passage.from === passage.to ? num(passage.from) : `${num(passage.from)}–${num(passage.to)}`;
      return (
        <Part {...common} Icon={FEATURE_ICON.tafsir} title="التفسير" sub={`تفسير السعدي · ${surahName(surah)} ${run}`} label="التفسير كاملًا"
          open={() => open.preview({ kind: 'tafsir', key: ayah })} source={sourcesOf([sadiSource(passage)])}>
          <QuoteBar by="قال السعدي:" palette={palette}><BookText text={withoutOpeningQuote(passage.text)} palette={palette} /></QuoteBar>
        </Part>
      );
    }
    case 'gharib':
      return <WordsPart {...common} entries={section.entries} ayah={ayah} open={open} />;
    case 'irab': {
      const body = noteBody('irab', ayah, word, ayahMushafWords(ayah));
      if (!body || !('word' in body)) return null;
      return (
        <Part {...common} Icon={FEATURE_ICON.irab} title="الإعراب" sub="إعراب الكلمات" label="إعراب الآية" open={() => open.irab({ key: ayah, word: body.word })} source={sourcesOf(body.sources)}>
          <QuranWord look={{ color: palette.accent }} place={{ textAlign: 'right' }}>{body.shown}</QuranWord>
          <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 30, textAlign: 'right' }}>{body.role}</Text>
          <Text numberOfLines={2} style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>{body.morph}</Text>
        </Part>
      );
    }
    case 'balagha': {
      const paragraph = bookState('itqan') === 'on' ? section.itqan.find(each => each.places === 1) ?? section.itqan[0] : undefined;
      const kashshaf = !paragraph && bookState('kashshaf') === 'on' ? section.kashshaf : null;
      const heading = paragraph ? [paragraph.heading, 'الإتقان للسيوطي'].filter(Boolean).join(' · ') : 'الكشاف للزمخشري';
      const source = paragraph ? [bookLine(ITQAN_BOOK, itqanCredit(paragraph), itqanPage(paragraph))]
        : kashshaf ? [bookLine(KASHSHAF_BOOK, kashshafCredit(kashshaf), kashshafPage(kashshaf))] : [];
      return (
        <Part {...common} Icon={FEATURE_ICON.balagha} title="البلاغة" sub={heading} label="البلاغة في الآية" open={() => open.balagha(ayah)} source={source}>
          <QuoteBar by={paragraph ? 'قال السيوطي:' : 'قال الزمخشري:'} palette={palette}><BookText text={paragraph?.text ?? kashshaf?.text ?? ''} palette={palette} /></QuoteBar>
        </Part>
      );
    }
    case 'qiraat':
      return (
        <Part {...common} Icon={FEATURE_ICON.qiraat} title="القراءات" sub="القراءات العشر" label="القراءات كاملة" open={() => open.preview({ kind: 'readings', key: ayah })}>
          <QiraatPlace ayah={ayah} max={2} palette={palette} />
        </Part>
      );
    case 'trees': {
      const others = [...new Set(treePiecesOfAyah(ayah).flatMap(piece => piece.keys))].filter(each => each !== ayah);
      return (
        <Part {...common} Icon={FEATURE_ICON.trees} title="المتشابهات" sub={section.count > 1 ? `في ${num(section.count)} أشجار` : 'في شجرة'} label="متشابهات الآية"
          open={() => open.preview({ kind: 'trees', key: ayah })}>
          <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>
            {others.length ? `تشبه: ${ayahPlaces(others, PLACE_NAMES)}` : 'تتشابه مواضع في الآية نفسها'}
          </Text>
        </Part>
      );
    }
    case 'compare':
      return (
        <Part {...common} Icon={FEATURE_ICON.compare} title="المقارنة" sub="بين موضعين من سورتين" label="الآية في المقارنة" open={() => open.preview({ kind: 'compare', key: ayah })}>
          <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{section.count > 1 ? `في ${num(section.count)} مقارنات` : 'في مقارنة واحدة'}</Text>
        </Part>
      );
    case 'opening':
      return (
        <Part {...common} Icon={FEATURE_ICON.openings} title="فاتحة السورة" sub="فواتح السور" label={`افتح «${section.title}» في فواتح السور`}
          open={() => toTab({ pathname: '/openings', params: { at: section.card } })}>
          <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{section.title}</Text>
        </Part>
      );
    case 'oath': {
      const place = `${surahName(surah)} ${num(section.range[0])}${section.range[1] > section.range[0] ? `–${num(section.range[1])}` : ''}`;
      return (
        <Part {...common} Icon={FEATURE_ICON.oaths} title="القسم" sub={place} label={`افتح ${place} في الأقسام`}
          open={() => toTab({ pathname: '/oaths', params: { at: section.oath } })} source={sourcesOf(oathSources(section.oath))}>
          <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{`المُقسَم به: ${section.by.join('، ')}`}</Text>
        </Part>
      );
    }
    case 'prophet': {
      const story = prophetStory(section.slug);
      if (!story) return null;
      const places = section.event.segments.map(segment => `${surahName(segment.surah)} ${num(segment.range[0])}${segment.range[1] > segment.range[0] ? `–${num(segment.range[1])}` : ''}`);
      return (
        <Part {...common} Icon={FEATURE_ICON.prophets} title={story.title} sub={story.story.phases[section.event.phase]} label={`افتح ${section.event.title} في القصة`}
          open={() => router.push({ pathname: '/prophets/[slug]', params: { slug: section.slug, event: String(section.at) } })} source={sourcesOf(eventSources(section.event))}>
          <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 30, textAlign: 'right' }}>{section.event.title}</Text>
          {places.length > 1 && <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>{`تُروى في: ${places.join(' · ')}`}</Text>}
        </Part>
      );
    }
    case 'sira': {
      const told = section.ayat;
      const first = section.story.reports[0]?.moments[0]?.text;
      const openStory = () => toTab({ pathname: '/story', params: { slug: section.story.slug } });
      const entry = told.about && findPerson(told.about.slug)?.ayat.filter(fact => fact.value === ayah);
      const source = sourcesOf([...told.refs.map(citeSource), ...(entry?.length ? factSources(entry, true) : [])]);
      if (revealedIn(told)) {
        const ref = told.refs[0];
        const hadith = ref && reportHadith(ref);
        return (
          <Part {...common} Icon={ScrollText} title="فيمن نزلت" sub={section.story.name} label={`افتح ${section.story.name}`} open={openStory} source={source}>
            {ref ? <Text numberOfLines={LINES} style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{`«${ref.text}»`}</Text> : null}
            {hadith ? <Button variant="plain" Icon={FEATURE_ICON.hadith} label={ref.cite} onPress={() => openSahih(hadith.book, hadith.n)} /> : null}
            <People people={told.about ? [told.about] : section.story.people} palette={palette} />
          </Part>
        );
      }
      return (
        <Part {...common} Icon={ScrollText} title="من قصص السيرة" sub={section.story.name} label={`افتح ${section.story.name}`} open={openStory} source={source}>
          <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>{told.label}</Text>
          {first ? <Text numberOfLines={LINES} style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{first}</Text> : null}
        </Part>
      );
    }
    case 'person': {
      const person = findPerson(section.slug);
      const facts = person?.ayat.filter(each => each.value === ayah) ?? [];
      if (!person || !facts.length) return null;
      return (
        <Part {...common} Icon={FEATURE_ICON.person} title={section.kind === 'REVEALED_ABOUT' ? 'فيمن نزلت' : 'في التراجم'} sub={personName(person)}
          label={`افتح ${personName(person)}`} open={() => toTab({ pathname: '/person', params: { slug: person.slug } })} source={sourcesOf(factSources(facts, true))}>
          {facts.map(fact => (
            <QuoteBar key={fact.text} by={saidBy(fact) ?? `قال ${pageSources(fact.refs)[0]?.author ?? 'الذهبي'}:`} palette={palette}>
              <Text numberOfLines={LINES} style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{fact.text}</Text>
            </QuoteBar>
          ))}
        </Part>
      );
    }
    case 'topic': {
      const topics = surahTopicsOf(surah);
      const run = section.from === undefined ? '' : section.from === section.to ? num(section.from) : `${num(section.from)}–${num(section.to!)}`;
      return (
        <Part {...common} Icon={TableOfContents} title="مسار السورة" sub={`${surahName(surah)} ${run}`.trim()} label={`موضوعات سورة ${surahName(surah)}`}
          open={() => open.topic({ surah, section: section.section })}
          source={topics ? [{ line: 'التفسير الموضوعي لسور القرآن الكريم', quotes: [{ text: '', cite: surahTopicsCredit(topics) }] }] : undefined}>
          <SurahRoute surah={surah} ayah={Number(ayah.split(':')[1])} count={ayahCounts.get(surah) ?? 0} palette={palette} />
        </Part>
      );
    }
  }
});

function WordsPart({ entries, ayah, palette, open, onAt }: { entries: GharibAt[]; ayah: string; palette: Palette; open: Openers; onAt?: (y: number) => void }) {
  const [picked, setPicked] = useState(0);
  const words = useMemo(() => ayahMushafWords(ayah), [ayah]);
  const chips = entries.map(each => {
    const [from, to] = each.words[0];
    return { label: words.slice(from, to + 1).join(' '), names: ['ابن قتيبة'], agreed: false, meaning: gharibData.meanings[each.at]?.replace(/\.$/, '') };
  });
  const entry = entries[picked];
  return (
    <Part palette={palette} onAt={onAt} Icon={FEATURE_ICON.words} title="كلماتها" sub="غريب القرآن لابن قتيبة" label="معاني كلمات الآية"
      open={() => open.gharib({ key: ayah, word: entry.words[0]?.[0] ?? 0 })} source={[bookLine(GHARIB_BOOK, gharibCredit(entry), gharibPage(entry))]}>
      {chips.length > 0 && <TraitChips traits={chips} quran palette={palette} picked={picked} onPick={setPicked} />}
      <QuoteBar by="قال ابن قتيبة:" palette={palette}><BookText text={entry.text.replace(/^[٠-٩]+-\s*/, '')} palette={palette} /></QuoteBar>
    </Part>
  );
}

const PLACE_NAMES: Record<number, string> = Object.fromEntries(Array.from({ length: 114 }, (_, i) => [i + 1, surahName(i + 1)]));
