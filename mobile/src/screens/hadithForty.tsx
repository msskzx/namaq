import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MessagesSquare } from 'lucide-react-native';
import { RECORD_BOOKS, compilerOf, fromCompanion, recordName, recordedIn, type FortyEntry, type FortyGrade, type FortyRecord, type RajabChapter } from '@shared/hadith';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Tabs from '@/ui/Tabs';
import { SharedCard, ShareHead } from '@/ui/CardShare';
import Button from '@/ui/Button';
import Folded from '@/ui/Folded';
import Reference from '@/ui/Reference';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { FORTY, JIBRIL, fortyEntry, shamelaPage } from '@/lib/hadith';
import Isnad from '@/components/Isnad';
import { ChainSaying } from '@/components/Sahih';
import { chainLinks } from '@shared/isnadMetro';
import IbnRajab from '@/components/IbnRajab';
import HadithBooks from '@/components/HadithBooks';
import rajabFile from '@shared/data/hadith/ibnRajab.json';
import { dataOf } from '@shared/appData';

const rajab = dataOf(rajabFile);

const RAJAB = rajab as RajabChapter[];

type Mode = 'drawing' | 'text';
const MODES = [{ key: 'drawing', label: 'الرسم' }, { key: 'text', label: 'النص' }] as const;

const body = (palette: Palette) => ({ color: palette.ink, fontSize: 19, lineHeight: 36, textAlign: 'right' as const });
const pagesName = (pages: number[]) => (pages.length > 1 ? `ص ${num(pages[0])}–${num(pages[pages.length - 1])}` : `ص ${num(pages[0])}`);

function Cite({ book, place, url, palette }: { book: keyof typeof FORTY.books; place: string; url: string; palette: Palette }) {
  const { title, edition } = FORTY.books[book];
  return <Reference title={title} quotes={[{ text: '', cite: place, url }, { text: `${title}، ${edition}` }]} places={[place]} editions={[edition]} palette={palette} />;
}

function Record({ record, mode, palette }: { record: FortyRecord; mode: Mode; palette: Palette }) {
  const chain = record.isnadEnd ? record.text.slice(0, record.isnadEnd) : '';
  const saying = record.text.slice(chain.length);
  return (
    <View style={{ gap: 10 }}>
      {mode === 'drawing' && record.isnad
        ? <>
          <Isnad isnad={record.isnad} palette={palette} />
          <ChainSaying chain={chain} links={chainLinks(record.isnad)} words={saying} palette={palette} />
        </>
        : <Text style={body(palette)}><Text style={{ color: palette.muted }}>{chain}</Text>{saying}</Text>}
      {record.from && <Text style={{ color: palette.ink, fontSize: 14, textAlign: 'right' }}>{record.mursal ? `مرسلًا، عن ${record.from}` : `من حديث ${record.from}`}</Text>}
      <Cite book={record.book} place={`${recordName(record, num, FORTY.books)}، ج ${num(record.volume)}، ${pagesName(record.pages)}`}
        url={shamelaPage(record.book, record.shamela)} palette={palette} />
    </View>
  );
}

function BookRecords({ title, records, mode, head, palette }: { title: string; records: FortyRecord[]; mode: Mode; head: React.ReactNode; palette: Palette }) {
  const firstWhole = records.find(record => !record.partial) ?? records[0];
  const rest = records.filter(record => record !== firstWhole);
  return (
    <SharedCard palette={palette} gap={10} shareHead={head} shareLabel={`شارك ما ${title}`}>
      <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 17, fontWeight: '700', textAlign: 'right' }}>{title}</Text>
      {firstWhole.partial && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>فيه بعض لفظ الحديث</Text>}
      <Record record={firstWhole} mode={mode} palette={palette} />
      {rest.length > 0 && (
        <Folded credit={firstWhole.book === 'muslim' ? `طرق أخرى عند مسلم (${num(rest.length)})` : `مواضع أخرى في ${FORTY.books[firstWhole.book].title} (${num(rest.length)})`} palette={palette}>
          {rest.map((record, i) => (
            <View key={`${record.number}-${i}`} style={{ gap: 6, marginTop: 6 }}>
              {record.partial && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>فيه بعض لفظ الحديث</Text>}
              <Record record={record} mode={mode} palette={palette} />
            </View>
          ))}
        </Folded>
      )}
    </SharedCard>
  );
}

const gradePlace = (grade: FortyGrade) => {
  const book = FORTY.books[grade.book];
  if (grade.book === 'nawawi') return `${book.title}، ${pagesName(grade.pages)}`;
  if (grade.book === 'ibnrajab') return `${book.title}، ${num(grade.volume)}/ ${num(grade.pages[0])}${grade.pages.length > 1 ? `–${num(grade.pages[grade.pages.length - 1])}` : ''}`;
  return `${recordName({ book: grade.book, number: grade.number! }, num, FORTY.books)}، ج ${num(grade.volume)}، ${pagesName(grade.pages)}`;
};

const GRADE_LINES = 5;
const LONG_GRADE = 300;

function Grade({ grade, palette }: { grade: FortyGrade; palette: Palette }) {
  const [open, setOpen] = useState(false);
  const long = grade.quote.length > LONG_GRADE;
  return (
    <View style={{ gap: 4, borderStartWidth: 2, borderColor: palette.rule, paddingStart: 10 }}>
      <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{grade.by}</Text>
      <Text numberOfLines={long && !open ? GRADE_LINES : undefined} style={body(palette)}>{grade.quote}</Text>
      {long && <View style={{ flexDirection: 'row' }}><Button variant="plain" label={open ? 'أقل' : 'المزيد'} onPress={() => setOpen(was => !was)} accessibilityLabel={open ? 'اطو الكلام' : `اقرأ كلام ${grade.by} كاملًا`} /></View>}
      <Cite book={grade.book} place={gradePlace(grade)} url={shamelaPage(grade.book, grade.shamela)} palette={palette} />
    </View>
  );
}

function Grades({ grades, head, palette }: { grades: FortyGrade[]; head: React.ReactNode; palette: Palette }) {
  return (
    <SharedCard palette={palette} gap={14} shareHead={head} shareLabel="شارك ما قاله العلماء في درجته">
      <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 17, fontWeight: '700', textAlign: 'right' }}>ما قاله العلماء في درجته</Text>
      {grades.map((grade, i) => <Grade key={`${grade.by}-${i}`} grade={grade} palette={palette} />)}
    </SharedCard>
  );
}

function Compiled({ entry, head, palette }: { entry: FortyEntry; head: React.ReactNode; palette: Palette }) {
  const { book: key } = compilerOf(entry);
  const where = entry.volume ? `${num(entry.volume)}/ ${num(entry.pages[0])}` : pagesName(entry.pages);
  return (
    <SharedCard palette={palette} gap={8} shareHead={head} shareLabel={`شارك ${entry.heading}`}>
      <Text style={body(palette)}>{entry.text}</Text>
      <Cite book={key} place={`${FORTY.books[key].title}، ${where}`} url={shamelaPage(key, entry.shamela)} palette={palette} />
    </SharedCard>
  );
}

export function FortyHadith({ entry, palette, jibril }: { entry: FortyEntry; palette: Palette; jibril?: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('drawing');
  const books = RECORD_BOOKS.map(book => ({ book, records: entry.records.filter(record => record.book === book) })).filter(({ records }) => records.length > 0);
  const chapter = RAJAB.find(item => item.n === entry.n);
  const drawn = entry.records.some(record => record.isnad);
  const head = <ShareHead title={entry.heading} sub={fromCompanion(entry.companion)} palette={palette} />;
  return <>
    <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 26, textAlign: 'right' }}>{entry.heading}</Text>
    <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right', marginTop: -8 }}>{fromCompanion(entry.companion)}</Text>
    <Compiled entry={entry} head={head} palette={palette} />
    <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>من أخرجه</Text>
    <HadithBooks top={entry.heading} boxes={recordedIn(entry)} namer={compilerOf(entry).name} palette={palette} />
    {jibril}
    {drawn && <Tabs label="طريقة العرض" options={MODES} value={mode} onChange={setMode} palette={palette} />}
    {entry.partial && entry.records.length > 0 && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>في الصحيحين بعض لفظ الحديث</Text>}
    {entry.grades && <Grades grades={entry.grades} head={head} palette={palette} />}
    {books.map(({ book, records }) => <BookRecords key={book} title={`في ${FORTY.books[book].title}`} records={records} mode={mode} head={head} palette={palette} />)}
    {chapter && (
      <>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>من شرح ابن رجب</Text>
        <SharedCard palette={palette} gap={8} shareHead={head} shareLabel="شارك شرح ابن رجب"><IbnRajab chapter={chapter} palette={palette} /></SharedCard>
      </>
    )}
  </>;
}

export default function HadithFortyScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const { n = '' } = useLocalSearchParams<{ n?: string }>();
  const entry = fortyEntry(Number(n));
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  if (!entry) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  const unit = (id: string) => router.push({ pathname: '/hadith-unit', params: { unit: id } });
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title={entry.heading} hideOnScroll />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        <FortyHadith entry={entry} palette={palette} jibril={entry.n === 2 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Button Icon={MessagesSquare} label="المشاهد في صحيح مسلم" onPress={() => unit(JIBRIL.muslim)} />
            <Button Icon={MessagesSquare} label="رواية أبي هريرة في البخاري" onPress={() => unit(JIBRIL.bukhari)} />
          </View>
        )} />
      </ScrollView>
    </View>
  );
}
