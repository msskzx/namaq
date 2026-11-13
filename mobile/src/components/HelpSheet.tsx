import { ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import Sheet from './Sheet';
import { QURAN_FONT, blend, type Palette } from '@/lib/theme';

export type HelpTopic = 'branches' | 'compare' | 'prophets';

/** A coloured sample word and what its colour means. */
function Key({ word, color, text, palette }: { word: string; color: string; text: string; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Text style={{ fontFamily: QURAN_FONT, fontSize: 20, lineHeight: 34, color, minWidth: 64, textAlign: 'center' }}>{word}</Text>
      <Text style={{ flex: 1, color: palette.ink, fontSize: 15, textAlign: 'right' }}>{text}</Text>
    </View>
  );
}

const TITLES: Record<HelpTopic, string> = { branches: 'قواعد المطابقة', compare: 'كيف نقارن؟', prophets: 'كيف تُقرأ القصة؟' };

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
        {topic === 'prophets' ? <>
          <Text style={paragraph}>كل عمود حدث تحت لون مجموعته، وكل سطر سورة. حجم الدائرة على قدر آيات السورة في الحدث.</Text>
          <Text style={paragraph}>اضغط دائرة لتقرأ آياتها مع مواضع الحدث في السور الأخرى، ومن كل موضع تفتحه في المصحف أو تقارنه بسورة أخرى. وفي المواضع تُلوَّن الكلمات التي جاءت متتابعة في سورة أخرى من مواضع الحدث نفسه.</Text>
          {note && <Text style={[paragraph, { color: palette.muted }]}>{note}</Text>}
        </> : topic === 'branches' ? <>
          <Text style={paragraph}>تجمع كل بطاقة آياتٍ تتشابه ألفاظها، فتراها شجرةً أو مصفوفة. ما جمعته كتب المتشابه يبقى كما ورد فيها، وزر المصادر تحت بطاقته يعرض نص كل كتاب وموضعه. الرمز ∅ يعني كلمة محذوفة.</Text>
          <Text style={paragraph}>العبارات الكثيرة التكرار لا تظهر بطاقاتٍ، لكنك تجدها بالبحث. والنص برواية حفص كما في المصحف.</Text>
          <View style={{ gap: 4, borderTopWidth: 1, borderColor: palette.rule, paddingTop: 10 }}>
            <Key word="ٱلْكِتَٰبَ" color={palette.accent} text="نفس الكلمة في كل الآيات" palette={palette} />
            <Key word="يُؤْمِنُونَ" color={palette.root} text="نفس اللفظ أو الجذر بصيغة أخرى" palette={palette} />
            <Key word="إِنْ" color={palette.amber} text="الكلمة نفسها بضبط مختلف بين الآيات؛ المصفوفة تعرض ضبط كل آية" palette={palette} />
          </View>
        </> : <>
          <Text style={paragraph}>كل صفحة تجمع سورتين، وكل بطاقة تضع آية من كل سورة جنبًا إلى جنب. اختيرت البطاقات لأن الآيتين في المشهد نفسه أو تشتركان في عبارة نادرة، لا لعدد الكلمات المشتركة. اضغط كلمة ملوّنة لتضيء نظيرتها في الآية الأخرى. النص برواية حفص.</Text>
          <View style={{ gap: 4, borderTopWidth: 1, borderColor: palette.rule, paddingTop: 10 }}>
            <Key word="ٱلْكِتَٰبَ" color={palette.accent} text="كلمة مشتركة بلفظها" palette={palette} />
            <Key word="يُؤْمِنُونَ" color={palette.root} text="نفس اللفظ بصيغة أخرى" palette={palette} />
            <Key word="بَيَانٌ" color={blend(palette.root, palette.muted, 0.45)} text="من جذر مشترك بلفظ مختلف، وقد يختلف المعنى" palette={palette} />
          </View>
        </>}
      </ScrollView>}
    </Sheet>
  );
}
