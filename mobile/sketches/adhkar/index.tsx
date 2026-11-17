import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Bell, CalendarDays, Check, Clock, Compass, HandHeart, RotateCcw } from 'lucide-react-native';
import Card from '@/ui/Card';
import Tabs from '@/ui/Tabs';
import TopBar from '@/ui/TopBar';
import Reference, { type Quote } from '@/ui/Reference';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import { Text } from '@/ui/Text';
import MushafPageView from '@/components/MushafPageView';
import { dark } from '@/lib/theme';
import { pageData, surahBefore } from '@/lib/mushaf';
import { pageModel } from '@shared/quran/recitePage';
import { pageTop } from '@shared/quran/ayahSlice';
import { SURAH_TITLES } from '@shared/quran/surahNames';
import { adhkarFor, type AdhkarCitation, type AdhkarOccasion, type Dhikr } from '@shared/adhkar';

const occasions = [
  { key: 'morning', label: 'صباح' }, { key: 'evening', label: 'مساء' },
  { key: 'sleep', label: 'نوم' }, { key: 'waking', label: 'يقظة' }, { key: 'after-prayer', label: 'صلاة' },
] as const;
const noop = () => {};
const digits = (value: number) => String(value).replace(/\d/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);
const SHORT: Record<AdhkarCitation['source'], string> = { 'adhkar-nawawi': 'الأذكار', 'nataij-afkar': 'نتائج الأفكار' };
const book = (citation: AdhkarCitation) => SHORT[citation.source];
const cite = (citation: AdhkarCitation) =>
  `${book(citation)} ${citation.volume > 1 ? `${digits(citation.volume)}/` : ''}${digits(citation.page)}${citation.report ? ` ح${digits(citation.report)}` : ''}`;

/** Each card's reference: al-Nawawi's words on when, how often and why, then every named grade with its own book and page. */
function quotes(item: Dhikr): Quote[] {
  const at = { cite: cite(item.citation), url: item.citation.url };
  return [
    { text: item.occasionQuote, ...at },
    ...(item.repeat ? [{ text: item.repeat.quote, ...at }] : []),
    ...(item.instructionQuote ? [{ text: item.instructionQuote, ...at }] : []),
    ...item.grades.map(grade => ({
      text: grade.quote,
      cite: grade.reportedBy ? `${grade.scholar}، نقله ${grade.reportedBy}، ${cite(grade.citation)}` : `${grade.scholar}، ${cite(grade.citation)}`,
      url: grade.citation.url,
    })),
  ];
}

/** Al-Ikhlas and al-Mu'awwidhatayn fill page 604, so the card shows that Madina page whole, through the reader's own page view. */
function QuranPage({ page }: { page: number }) {
  const [width, setWidth] = useState(0);
  const parts = useMemo(() => {
    const data = pageData(page);
    return { data, model: pageModel(data, surahBefore(page)), slice: pageTop(data.items, 15) };
  }, [page]);
  return (
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)} pointerEvents="none">
      {width > 0 && <MushafPageView page={page} data={parts.data} model={parts.model} palette={dark} width={width} height={width * 1.5}
        top={surahBefore(page)} names={SURAH_TITLES} forgot={{}} saved={new Set()} onTouch={noop} slice={parts.slice} />}
    </View>
  );
}

function Counter({ count }: { count: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Button Icon={Check} variant="primary" accessibilityLabel="عُدَّ مرة" onPress={noop} />
      <Text style={{ color: dark.ink, fontSize: 20, writingDirection: 'ltr' }}>٠ / {digits(count)}</Text>
      <Button Icon={RotateCcw} variant="plain" accessibilityLabel="من جديد" onPress={noop} />
    </View>
  );
}

export default function AdhkarSketch() {
  const [occasion, setOccasion] = useState<AdhkarOccasion>('morning');
  const items = adhkarFor(occasion);
  return (
    <View style={{ flex: 1, backgroundColor: dark.paper, direction: 'rtl' }}>
      {/* Round 2 adds a fourth icon to the real UtilityPicker; this row only shows where it sits. */}
      <TopBar back={noop} center>
        <View style={{ direction: 'ltr', flexDirection: 'row-reverse', borderWidth: 1, borderColor: dark.rule, borderRadius: 12, padding: 2, gap: 2 }}>
          {[Clock, Compass, CalendarDays, HandHeart].map((Icon, i) => (
            <View key={i} style={{ paddingHorizontal: 18, paddingVertical: 7, borderRadius: 10, backgroundColor: i === 3 ? dark.accent : 'transparent' }}>
              <Icon size={20} color={i === 3 ? dark.onAccent : dark.ink} />
            </View>
          ))}
        </View>
      </TopBar>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1 }}><Tabs label="وقت الذكر" options={occasions} value={occasion} onChange={setOccasion} palette={dark} fill /></View>
          {(occasion === 'morning' || occasion === 'evening') && <IconButton Icon={Bell} label="تذكير بعد الفجر والعصر" onPress={noop} />}
        </View>
        {items.map(item => (
          <Card key={item.id} palette={dark} pad={18} gap={14}>
            {item.content.kind === 'text'
              ? <Text style={{ color: dark.ink, fontSize: 21, lineHeight: 40, textAlign: 'justify' }}>{item.content.text}</Text>
              : <QuranPage page={604} />}
            {item.virtueQuote && <Text style={{ color: dark.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>«{item.virtueQuote}»</Text>}
            {item.repeat && <Counter count={item.repeat.count} />}
            <Reference title={`${cite(item.citation)} · ${item.collections.join('، ')}`} palette={dark} quotes={quotes(item)} />
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
