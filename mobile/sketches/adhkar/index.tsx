import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Bell, BookOpen, CalendarDays, Check, Clock, Compass, HandHeart, RotateCcw } from 'lucide-react-native';
import Card from '@/ui/Card';
import Tabs from '@/ui/Tabs';
import TopBar from '@/ui/TopBar';
import Reference from '@/ui/Reference';
import Sheet from '@/ui/Sheet';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import { Text } from '@/ui/Text';
import { dark } from '@/lib/theme';
import { adhkarFor, dhikrById, type AdhkarOccasion, type Dhikr } from '@shared/adhkar';
import { SOURCES } from '@shared/sources';

const occasions = [
  { key: 'morning', label: 'صباح' }, { key: 'evening', label: 'مساء' },
  { key: 'waking', label: 'يقظة' }, { key: 'sleep', label: 'نوم' }, { key: 'after-prayer', label: 'صلاة' },
] as const;
const noop = () => {};
const digits = (value: number) => String(value).replace(/\d/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);
const cite = (item: Dhikr) => `الأذكار · ج١ · ص${digits(item.citation.page)} · ح${digits(item.citation.report!)}`;

export default function AdhkarSketch() {
  const [occasion, setOccasion] = useState<AdhkarOccasion>('morning');
  const [source, setSource] = useState<Dhikr>();
  const sample = occasion === 'morning'
    ? [dhikrById('morning-evening-name')!, dhikrById('morning-by-you')!]
    : adhkarFor(occasion).filter(item => item.content.kind === 'text').slice(0, 2);
  return (
    <View style={{ flex: 1, backgroundColor: dark.paper, direction: 'rtl' }}>
      <TopBar back={noop} center help={() => setSource(sample[0])}>
        <IconButton Icon={Clock} label="مواقيت الصلاة" onPress={noop} />
        <IconButton Icon={Compass} label="القبلة" onPress={noop} />
        <IconButton Icon={CalendarDays} label="التقويم الهجري" onPress={noop} />
        <IconButton Icon={HandHeart} label="الأذكار والدعاء" onPress={noop} on />
      </TopBar>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text accessibilityRole="header" style={{ color: dark.ink, fontSize: 24 }}>الأذكار والدعاء</Text>
          <IconButton Icon={Bell} label="تذكير الأذكار" onPress={noop} />
        </View>
        <Tabs label="وقت الذكر" options={occasions} value={occasion} onChange={setOccasion} palette={dark} fill />
        {sample.map(item => (
          <Card key={item.id} palette={dark} pad={18} gap={16}>
            {item.content.kind === 'text' && <Text style={{ color: dark.ink, fontSize: 20, lineHeight: 38, textAlign: 'right' }}>{item.content.text}</Text>}
            {item.virtueQuote && <Text style={{ color: dark.muted, fontSize: 14, lineHeight: 25, textAlign: 'right' }}>{item.virtueQuote}</Text>}
            {item.repeat && <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Button Icon={Check} variant="primary" accessibilityLabel="عد تكرار الذكر" onPress={noop} />
              <Text accessibilityLabel="صفر من ثلاثة تكرارات" style={{ color: dark.ink, fontSize: 20, direction: 'ltr', writingDirection: 'ltr' }}>٠ / {digits(item.repeat.count)}</Text>
              <Button Icon={RotateCcw} variant="plain" accessibilityLabel="إعادة العداد" onPress={noop} />
            </View>}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: dark.muted, fontSize: 12 }}>{cite(item)}</Text>
              <Button Icon={BookOpen} variant="plain" accessibilityLabel={`مصدر ${item.id}`} onPress={() => setSource(item)} />
            </View>
          </Card>
        ))}
      </ScrollView>
      <Sheet open={!!source} onClose={() => setSource(undefined)} palette={dark}>
        {source && <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
          <Text accessibilityRole="header" style={{ color: dark.ink, fontSize: 20 }}>المصدر والحكم</Text>
          <Text style={{ color: dark.muted, fontSize: 13 }}>{source.collections.join(" · ")}</Text>
          <Text style={{ color: dark.muted, fontSize: 13, lineHeight: 24 }}>{SOURCES.find(book => book.id === source.citation.source)?.edition}</Text>
          <Reference title={cite(source)} palette={dark} quotes={[
            { text: source.occasionQuote, cite: cite(source), url: source.citation.url },
            ...(source.repeat ? [{ text: source.repeat.quote, cite: cite(source), url: source.citation.url }] : []),
            ...(source.virtueQuote ? [{ text: source.virtueQuote, cite: cite(source), url: source.citation.url }] : []),
          ]} />
          {source.grades.map(grade => <View key={`${grade.scholar}-${grade.quote}`} style={{ gap: 6 }}>
            <Text style={{ color: dark.ink, fontSize: 15 }}>{grade.scholar}{grade.reportedBy ? `، نقله ${grade.reportedBy}` : ''}</Text>
            <Reference title={`${SOURCES.find(book => book.id === grade.citation.source)?.title.ar} · ج${digits(grade.citation.volume)} · ص${digits(grade.citation.page)}`}
              palette={dark} quotes={[{ text: grade.quote, cite: grade.scholar, url: grade.citation.url }]} />
          </View>)}
        </ScrollView>}
      </Sheet>
    </View>
  );
}
