import { ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { OATHS_HELP } from '@shared/quran/oaths';
import { examples, rangeLabel, type Voice } from '@shared/quran/iltifat';
import Sheet from './Sheet';
import ExternalLink from './ExternalLink';
import { VOICE_NAME, voiceColor } from './Iltifat';
import { BOOKS, ORDER_HELP } from '@shared/quran/surahOrder';
import { CONDITION_NOTES, CONDITION_SOURCES, ITQAN_SOURCE, OPENINGS_HELP } from '@shared/quran/openingKinds';
import { QURAN_FONT, blend, type Palette } from '@/lib/theme';

export type HelpTopic = 'branches' | 'compare' | 'prophets' | 'words' | 'oaths' | 'iltifat' | 'openings' | 'order';

/** A coloured sample word and what its colour means. */
function Key({ word, color, text, palette }: { word: string; color: string; text: string; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Text style={{ fontFamily: QURAN_FONT, fontSize: 20, lineHeight: 34, color, minWidth: 64, textAlign: 'center' }}>{word}</Text>
      <Text style={{ flex: 1, color: palette.ink, fontSize: 15, textAlign: 'right' }}>{text}</Text>
    </View>
  );
}

const TITLES: Record<HelpTopic, string> = { branches: 'قواعد المطابقة', compare: 'كيف نقارن؟', prophets: 'كيف تُقرأ القصة؟', words: 'كيف نعدّ الكلمات؟', oaths: 'ما الأقسام هنا؟', iltifat: 'ما الالتفات؟', openings: 'ما أنواع الافتتاح؟', order: 'من أين هذا الكلام؟' };

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
        {topic === 'oaths' ? <>
          {OATHS_HELP.map((text, i) => <Text key={i} style={i === OATHS_HELP.length - 1 ? [paragraph, { color: palette.muted }] : paragraph}>{text}</Text>)}
        </> : topic === 'iltifat' ? <>
          <Text style={paragraph}>انتقال الكلام من غيبة إلى خطاب أو تكلم، أو من أحدها إلى غيره، والمتحدَّث عنه واحد.</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 16 }}>
            {(['he', 'we', 'you'] as Voice[]).map(voice => <Text key={voice} style={{ color: voiceColor(palette, voice), fontSize: 15 }}>{{ he: 'هو', we: 'نحن، أنا', you: 'أنت' }[voice]}: {VOICE_NAME[voice]}</Text>)}
          </View>
          <View style={{ gap: 4, borderTopWidth: 1, borderColor: palette.rule, paddingTop: 10 }}>
            {examples().map(view => <Text key={view.key} style={[paragraph, { color: palette.muted, fontSize: 14, lineHeight: 22 }]}>{view.name} {rangeLabel(view)}: {view.source}</Text>)}
          </View>
          <Text style={[paragraph, { color: palette.muted, fontSize: 14 }]}>النص برواية حفص. لم يراجع هذه الأمثلة أحد من أهل العلم.</Text>
        </> : topic === 'order' ? <>
          {ORDER_HELP.map((text, i) => <Text key={i} style={i === ORDER_HELP.length - 1 ? [paragraph, { color: palette.muted }] : paragraph}>{text}</Text>)}
          {Object.values(BOOKS).map(book => <ExternalLink key={book.shamela} url={`https://shamela.ws/book/${book.shamela}`} color={palette.muted} size={paragraph.fontSize} style={[paragraph, { color: palette.muted, textDecorationLine: 'underline' }]}>{book.title}</ExternalLink>)}
        </> : topic === 'openings' ? <>
          {OPENINGS_HELP.map(text => <Text key={text} style={paragraph}>{text}</Text>)}
          <Text style={[paragraph, { fontWeight: '700' }]}>الشرط وجوابه</Text>
          {CONDITION_NOTES.map(text => <Text key={text} style={paragraph}>{text}</Text>)}
          {[ITQAN_SOURCE, ...CONDITION_SOURCES].map(source => <ExternalLink key={source.url} url={source.url} color={palette.muted} size={paragraph.fontSize} style={[paragraph, { color: palette.muted, textDecorationLine: 'underline' }]}>{source.title}</ExternalLink>)}
        </> : topic === 'words' ? <>
          <Text style={paragraph}>تُعدّ الكلمة بمدخلها المعجمي في المدوّنة القرآنية العربية (corpus.quran.com)، فـ«والله» و«لله» تحت «ٱللَّه». وأعدادنا تطابق أعدادها.</Text>
          <Text style={paragraph}>لا تُعدّ الحروف المتصلة بالكلمة كالواو والفاء والباء واللام وأل، ولا الضمائر المنفصلة كـ«هو» و«هم»، ولا الحروف المقطعة في أوائل السور. والبسملة تُعدّ مرة واحدة، في الفاتحة.</Text>
          <Text style={paragraph}>وإذا اتفقت كلمتان في الرسم واختلفتا في المعنى عُدّت كل منهما وحدها، وبجانبها ما يميّزها، مثل «عصا» و«عصى».</Text>
        </> : topic === 'prophets' ? <>
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
