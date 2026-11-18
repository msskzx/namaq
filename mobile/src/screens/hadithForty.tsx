import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MessagesSquare } from 'lucide-react-native';
import { recordName, type FortyEntry, type FortyRecord } from '@shared/hadith';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Tabs from '@/ui/Tabs';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import Folded from '@/ui/Folded';
import Reference from '@/ui/Reference';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { FORTY, JIBRIL, fortyEntry, shamelaPage } from '@/lib/hadith';
import Isnad from '@/components/Isnad';

type Mode = 'drawing' | 'text';
// The owner's names (2026-11-18): the drawing, and the whole text with its isnad.
const MODES = [{ key: 'drawing', label: 'الرسم' }, { key: 'text', label: 'النص كاملًا' }] as const;

const body = (palette: Palette) => ({ color: palette.ink, fontSize: 19, lineHeight: 36, textAlign: 'right' as const });
const pagesName = (pages: number[]) => (pages.length > 1 ? `ص ${num(pages[0])}–${num(pages[pages.length - 1])}` : `ص ${num(pages[0])}`);

/** A source's page as the section's reference: the book, volume and page, opening to the edition and Shamela's page. */
function Cite({ title, edition, url, palette }: { title: string; edition: string; url: string; palette: Palette }) {
  return <Reference title={title} quotes={[{ text: edition }]} links={[{ label: 'الصفحة في المكتبة الشاملة', url }]} palette={palette} />;
}

/** One record: the drawn chain with the saying under it, or the whole text, the chain in muted ink before the saying. */
function Record({ record, mode, palette }: { record: FortyRecord; mode: Mode; palette: Palette }) {
  const book = FORTY.books[record.book];
  const chain = record.isnadEnd ? record.text.slice(0, record.isnadEnd) : '';
  const saying = record.text.slice(chain.length);
  return (
    <View style={{ gap: 10 }}>
      {mode === 'drawing' && record.isnad
        ? <>
          <Isnad isnad={record.isnad} palette={palette} />
          <Text style={body(palette)}>{saying}</Text>
        </>
        : <Text style={body(palette)}><Text style={{ color: palette.muted }}>{chain}</Text>{saying}</Text>}
      <Cite title={`${recordName(record, num)}، ج ${num(record.volume)}، ${pagesName(record.pages)}`} edition={`${book.title}، ${book.edition}`}
        url={shamelaPage(record.book, record.shamela)} palette={palette} />
    </View>
  );
}

/** A book's records for the hadith: the first in full, the others (Muslim's other routes, another place) folded under it. */
function BookRecords({ title, records, mode, palette }: { title: string; records: FortyRecord[]; mode: Mode; palette: Palette }) {
  const firstWhole = records.find(record => !record.partial) ?? records[0];
  const rest = records.filter(record => record !== firstWhole);
  return (
    <Card palette={palette} gap={10}>
      <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 17, fontWeight: '700', textAlign: 'right' }}>{title}</Text>
      <Record record={firstWhole} mode={mode} palette={palette} />
      {rest.length > 0 && (
        <Folded credit={firstWhole.book === 'muslim' ? `طرق أخرى عند مسلم (${num(rest.length)})` : `مواضع أخرى في البخاري (${num(rest.length)})`} palette={palette}>
          {rest.map(record => (
            <View key={`${record.number}${record.route ?? ''}`} style={{ gap: 6, marginTop: 6 }}>
              {record.partial && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>فيه بعض لفظ الحديث</Text>}
              <Record record={record} mode={mode} palette={palette} />
            </View>
          ))}
        </Folded>
      )}
    </Card>
  );
}

/** al-Nawawi's text as he printed it, with his page and the books he names. */
function Nawawi({ entry, palette }: { entry: FortyEntry; palette: Palette }) {
  const book = FORTY.books.nawawi;
  return (
    <Card palette={palette} gap={8}>
      <Text style={body(palette)}>{entry.text}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {entry.named.map(name => <Chip key={name} label={name} on={false} small role="text" palette={palette} />)}
      </View>
      <Cite title={`${book.title}، ${pagesName(entry.pages)}`} edition={`${book.title}، ${book.edition}`} url={shamelaPage('nawawi', entry.shamela)} palette={palette} />
    </Card>
  );
}

/**
 * One of al-Nawawi's Forty (owner, 2026-11-18): his text, then each book he names with the records found there, every chain
 * the edition links drawn («الرسم») or the whole text read («النص كاملًا»). No. 2 opens the Jibril pages with their scenes.
 */
export default function HadithFortyScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const { n = '' } = useLocalSearchParams<{ n?: string }>();
  const entry = fortyEntry(Number(n));
  const [mode, setMode] = useState<Mode>('drawing');
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  if (!entry) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  const bukhari = entry.records.filter(record => record.book === 'bukhari');
  const muslim = entry.records.filter(record => record.book === 'muslim');
  const drawn = entry.records.some(record => record.isnad);
  const unit = (id: string) => router.push({ pathname: '/hadith-unit', params: { unit: id } });
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title={entry.heading} hideOnScroll />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 26, textAlign: 'right' }}>{entry.heading}</Text>
        <Text style={{ color: palette.muted, fontSize: 16, textAlign: 'right', marginTop: -8 }}>عن {entry.companion}</Text>
        <Nawawi entry={entry} palette={palette} />
        {entry.n === 2 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Button Icon={MessagesSquare} label="المشاهد في صحيح مسلم" onPress={() => unit(JIBRIL.muslim)} />
            <Button Icon={MessagesSquare} label="رواية أبي هريرة في البخاري" onPress={() => unit(JIBRIL.bukhari)} />
          </View>
        )}
        {drawn && <Tabs label="طريقة العرض" options={MODES} value={mode} onChange={setMode} palette={palette} />}
        {bukhari.length > 0 && <BookRecords title="في صحيح البخاري" records={bukhari} mode={mode} palette={palette} />}
        {muslim.length > 0 && <BookRecords title="في صحيح مسلم" records={muslim} mode={mode} palette={palette} />}
      </ScrollView>
    </View>
  );
}
