import { ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import Sheet from './Sheet';
import ExternalLink from './ExternalLink';
import { BOOKS, ORDER_HELP } from '@shared/quran/surahOrder';
import { QURAN_FONT, blend, type Palette } from '@/lib/theme';
import { LEGEND_SOURCE, MARK_LEGEND } from '@shared/quran/wordMatch';
import { WORDS_COUNTING, WORDS_SOURCE } from '@shared/quran/words';
import { sourceById } from '@shared/sources';

const WEBSITE = 'https://namaq.vercel.app';

export type HelpTopic = 'branches' | 'compare' | 'prophets' | 'words' | 'order';

/** A coloured sample word and what its colour means. */
/** The colour of each likeness (MARK_LEGEND), as the colour setting draws it, with the kind of difference the books name for it. */
function Legend({ palette }: { palette: Palette }) {
  return <>
    {MARK_LEGEND.map(item => <Key key={item.kind} word={item.word} color={(item.kind !== 'plain' && palette.marks[item.kind]) || palette.ink} text={item.ar} palette={palette} />)}
    <Text style={{ color: palette.muted, fontSize: 13 }}>{LEGEND_SOURCE.ar}</Text>
  </>;
}

function Key({ word, color, text, palette }: { word: string; color: string; text: string; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Text style={{ fontFamily: QURAN_FONT, fontSize: 20, lineHeight: 34, color, minWidth: 64, textAlign: 'center' }}>{word}</Text>
      <Text style={{ flex: 1, color: palette.ink, fontSize: 15, textAlign: 'right' }}>{text}</Text>
    </View>
  );
}

/** A source from the one list (shared/sources.ts): its name, its author, and a link to it. */
function Sourced({ id, palette }: { id: string; palette: Palette }) {
  const source = sourceById(id);
  if (!source) return null;
  return (
    <View style={{ gap: 2 }}>
      <Text style={{ color: palette.ink, fontSize: 17, fontWeight: '700', textAlign: 'right' }}>{source.title.ar}</Text>
      {source.author && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{source.author.ar}</Text>}
      <ExternalLink url={source.link.url} color={palette.accent} size={15} style={{ textAlign: 'right' }}>{source.link.label}</ExternalLink>
    </View>
  );
}

const TITLES: Record<HelpTopic, string> = { branches: 'قواعد المطابقة', compare: 'كيف نقارن؟', prophets: 'كيف تُقرأ القصة؟', words: 'المصدر', order: 'من أين هذا الكلام؟' };

/**
 * The page help the website keeps in its settings sheet (MatchingRules in src/app/quran/branches/BranchHeading.tsx),
 * with the colour legend inside it. Shared by the branches and compare tabs.
 */
export default function HelpSheet({ topic, note, onClose, palette }: { topic: HelpTopic | null; note?: string; onClose: () => void; palette: Palette }) {
  const paragraph = { color: palette.ink, fontSize: 15, lineHeight: 25, textAlign: 'right' as const };
  return (
    <Sheet open={!!topic} onClose={onClose} palette={palette}>
      {topic && <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 14 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>{TITLES[topic]}</Text>
        {topic === 'order' ? <>
          {ORDER_HELP.map((text, i) => <Text key={i} style={i === ORDER_HELP.length - 1 ? [paragraph, { color: palette.muted }] : paragraph}>{text}</Text>)}
          {Object.values(BOOKS).map(book => <ExternalLink key={book.shamela} url={`https://shamela.ws/book/${book.shamela}`} color={palette.muted} size={paragraph.fontSize} style={[paragraph, { color: palette.muted, textDecorationLine: 'underline' }]}>{book.title}</ExternalLink>)}
        </> : topic === 'words' ? <>
          <Sourced id={WORDS_SOURCE} palette={palette} />
          {WORDS_COUNTING.map((text, i) => <Text key={i} style={paragraph}>{text}</Text>)}
          <ExternalLink url={`${WEBSITE}/attributions#${WORDS_SOURCE}`} color={palette.accent} size={15} style={{ textAlign: 'right' }}>المصادر والتراخيص</ExternalLink>
        </> : topic === 'prophets' ? <>
          <Text style={paragraph}>كل عمود حدث تحت لون مجموعته، وكل سطر سورة. حجم الدائرة على قدر آيات السورة في الحدث.</Text>
          <Text style={paragraph}>اضغط دائرة لتقرأ آياتها مع مواضع الحدث في السور الأخرى، ومن كل موضع تفتحه في المصحف أو تقارنه بسورة أخرى. وفي المواضع تُلوَّن الكلمات التي جاءت متتابعة في سورة أخرى من مواضع الحدث نفسه.</Text>
          {note && <Text style={[paragraph, { color: palette.muted }]}>{note}</Text>}
        </> : topic === 'branches' ? <>
          <Text style={paragraph}>تجمع كل بطاقة آياتٍ تتشابه ألفاظها، فتراها شجرةً أو مصفوفة. ما جمعته كتب المتشابه يبقى كما ورد فيها، وزر المصادر تحت بطاقته يعرض نص كل كتاب وموضعه. الرمز ∅ يعني كلمة محذوفة.</Text>
          <Text style={paragraph}>العبارات الكثيرة التكرار لا تظهر بطاقاتٍ، لكنك تجدها بالبحث. والنص برواية حفص كما في المصحف.</Text>
          <View style={{ gap: 4, borderTopWidth: 1, borderColor: palette.rule, paddingTop: 10 }}>
            <Legend palette={palette} />
          </View>
        </> : <>
          <Text style={paragraph}>كل صفحة تجمع سورتين، وكل بطاقة تضع آية من كل سورة جنبًا إلى جنب. اختيرت البطاقات لأن الآيتين في المشهد نفسه أو تشتركان في عبارة نادرة، لا لعدد الكلمات المشتركة. اضغط كلمة ملوّنة لتضيء نظيرتها في الآية الأخرى. النص برواية حفص.</Text>
          <View style={{ gap: 4, borderTopWidth: 1, borderColor: palette.rule, paddingTop: 10 }}>
            <Legend palette={palette} />
            {palette.marks.root && <Key word="بَيَانٌ" color={blend(palette.marks.root, palette.muted, 0.45)} text="من جذر مشترك بلفظ مختلف، وقد يختلف المعنى" palette={palette} />}
          </View>
        </>}
      </ScrollView>}
    </Sheet>
  );
}
