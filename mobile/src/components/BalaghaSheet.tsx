import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import ExternalLink from '@/ui/ExternalLink';
import itqan from '@shared/data/quran/itqanBalagha';
import { num } from '@shared/quran/arabicNumber';
import { ITQAN_BOOK, ITQAN_EDITION, itqanAt, itqanCredit, itqanPage, type ItqanParagraph } from '@shared/quran/itqanBalagha';
import { KASHSHAF_BOOK, KASHSHAF_EDITION, kashshafAt, kashshafCredit, kashshafPage, kashshafRuns, litWords, type KashshafData } from '@shared/quran/kashshaf';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import { bookState, readBook, useBooks } from '@/lib/books';
import { surahNames } from '@/lib/branches';
import { ayahMushafWords } from '@/lib/mushaf';
import type { Palette } from '@/lib/theme';
import QuranWords from './quran/text/QuranWords';
import { BookList } from './Books';
import LoadingDots from '@/ui/LoadingDots';
import Sheet from '@/ui/Sheet';
import OpenInBook from './OpenInBook';
import LitAyat, { deepBand } from './quran/text/LitAyat';
import Card from '@/ui/Card';
import Tabs from '@/ui/Tabs';
import Folded from '@/ui/Folded';
import Pickable from '@/ui/Pickable';
import Chip from '@/ui/Chip';
import { openIntent, toTab } from '@/lib/ways';
import { plainName, termOfParagraph } from '@shared/quran/balaghaTerms';

/**
 * Balagha in the reader (owner, 2026-11-16; docs/plans/balagha.md), from two books picked with pills. Al-Itqan (built
 * in): each of al-Suyuti's paragraphs in his chapters on balagha that quotes the ayah, whole, under his own heading.
 * Al-Kashshaf (downloaded): al-Zamakhshari's whole passage, the sentences where he names a device lit with his word for
 * it in front. A tap on a paragraph or a lit sentence lights the ayah words it quotes. Each book's page folds open below.
 */
// The reader's neutral band (MushafPageView's mark): the ink at 10%, seen on a card in both themes.
const band = (palette: Palette) => palette.bands.mark;
// The sentence whose ayah words are lit: a deeper band (LitAyat's deepBand).

type Book = 'itqan' | 'kashshaf';
const BOOK_NAMES: Record<Book, string> = { itqan: 'الإتقان للسيوطي', kashshaf: 'الكشاف للزمخشري' };

export default function BalaghaSheet({ ayah, onClose, palette }: { ayah: string | null; onClose: () => void; palette: Palette }) {
  const [kept, setKept] = useState(ayah);
  if (ayah && ayah !== kept) setKept(ayah);
  return (
    <Sheet open={!!ayah} onClose={onClose} palette={palette}>
      {kept && <BalaghaBody key={kept} ayah={kept} palette={palette} onClose={onClose} />}
    </Sheet>
  );
}

/** The sheet's inside: a quiz that looks the ayah up draws it too, without `onClose` and so without the ways out of the quiz. */
export function BalaghaBody({ ayah, palette, onClose }: { ayah: string; palette: Palette; onClose?: () => void }) {
  useBooks();
  const itqanOn = bookState('itqan') === 'on';
  const paragraphs = useMemo(() => (itqanOn ? itqanAt(itqan, ayah) : []), [ayah, itqanOn]);
  const [shown, setShown] = useState<Book>(paragraphs.length || bookState('kashshaf') !== 'on' ? 'itqan' : 'kashshaf');
  const [span, setSpan] = useState<[number, number][]>([]);
  const words = useMemo(() => ayahMushafWords(ayah), [ayah]);
  const [surah, number] = ayah.split(':').map(Number);
  return (
    <View style={{ flexShrink: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingBottom: 8 }}>
        <Sparkles size={20} color={palette.muted} />
        <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16 }}>{`${surahNames[surah] ?? num(surah)} ${num(number)}`}</Text>
      </View>
      <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 8 }}>
        <Card palette={palette} pad={[10, 14]}>
          <LitAyat ayat={[{ words, lit: span }]} palette={palette} />
        </Card>
        <Tabs options={(['itqan', 'kashshaf'] as const).map(book => ({ key: book, label: BOOK_NAMES[book] }))} value={shown} onChange={book => { setShown(book); setSpan([]); }} palette={palette} />
        {shown === 'itqan'
          ? <Itqan paragraphs={paragraphs} palette={palette} onSpan={setSpan} onClose={onClose} />
          : <Kashshaf ayah={ayah} palette={palette} onSpan={setSpan} onClose={onClose} />}
      </ScrollView>
    </View>
  );
}

function Itqan({ paragraphs, palette, onSpan, onClose }: { paragraphs: ItqanParagraph[]; palette: Palette; onSpan: (span: [number, number][]) => void; onClose?: () => void }) {
  useBooks();
  const [picked, setPicked] = useState(0);
  useEffect(() => { onSpan(paragraphs[picked]?.words ?? []); }, [paragraphs, picked, onSpan]);
  if (bookState('itqan') !== 'on') return <BookList kind="balagha" palette={palette} />;
  if (!paragraphs.length) return <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'center', paddingVertical: 16 }}>لم يستشهد السيوطي بهذه الآية في أنواع البلاغة.</Text>;
  return paragraphs.map((paragraph, i) => (
    <Card key={`${paragraph.id}/${i}`} palette={palette} pad={[10, 14]} picked={picked === i && paragraphs.length > 1}>
      {/* The paragraph lights the words it quotes; its reference below is a control of its own. */}
      <Pickable picked={picked === i} onPick={() => setPicked(i)}>
      <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 22, textAlign: 'right' }}>{paragraph.heading ? `«${paragraph.heading}» · ${paragraph.kind}` : paragraph.kind}</Text>
      <Text selectable style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' }}>
        {tafsirRuns(paragraph.text).map((run, j) => run.quran ? <QuranWords key={j} style={{ color: palette.accent }}>{run.text}</QuranWords> : <Text key={j}>{run.text}</Text>)}
      </Text>
      </Pickable>
      {/* Under the paragraph, not in it: a button inside the pressable paragraph is lost on the web and to screen readers (R0055). */}
      <TermLink paragraph={paragraph} palette={palette} onClose={onClose} />
      {/* A quote that names no ayah: every ayah it fits, listed, none chosen for him (owner, 2026-11-18). */}
      {paragraph.matches.length > 0 && (
        <Folded credit={`مواضع الشاهد في القرآن: ${num(paragraph.matches.length)}، ولم يعيّن السيوطي أحدها`} palette={palette}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingTop: 4 }}>
            {paragraph.matches.map(key => {
              const [surah, number] = key.split(':').map(Number);
              return <Chip key={key} small role={onClose ? 'button' : 'text'} label={`${surahNames[surah] ?? num(surah)} ${num(number)}`} on={false} palette={palette}
                accessibilityLabel={onClose ? `افتح ${surahNames[surah] ?? num(surah)} ${num(number)} في المصحف` : undefined}
                onPress={onClose && (() => { onClose(); openIntent({ tab: 'read', at: key }); })} />;
            })}
          </View>
        </Folded>
      )}
      <Folded credit={itqanCredit(paragraph)} palette={palette}>
        <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>
          {`${ITQAN_BOOK}، ${ITQAN_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث. الفقرة كاملة كما في الكتاب، والعنوان عنوانه.`}
        </Text>
        <ExternalLink url={itqanPage(paragraph)} color={palette.muted} size={14} style={{ textAlign: 'right' }}>اقرأ الصفحة</ExternalLink>
      </Folded>
    </Card>
  ));
}

/** The term his paragraph stands under, a tap from its page in «مصطلحات البلاغة». */
function TermLink({ paragraph, palette, onClose }: { paragraph: ItqanParagraph; palette: Palette; onClose?: () => void }) {
  const term = termOfParagraph(itqan, paragraph);
  if (!term || !onClose) return null;
  const label = `تعريف ${plainName(term)}`;
  return (
    <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
      <Chip small label={label} on={false} palette={palette} accessibilityLabel={`${label} في مصطلحات البلاغة`}
        onPress={() => { onClose(); toTab({ pathname: '/term', params: { name: term } }); }} />
    </View>
  );
}

function Kashshaf({ ayah, palette, onSpan, onClose }: { ayah: string; palette: Palette; onSpan: (span: [number, number][]) => void; onClose?: () => void }) {
  useBooks();
  const on = bookState('kashshaf') === 'on';
  // null while reading the file, false when it cannot be read.
  const [book, setBook] = useState<KashshafData | null | false>(null);
  useEffect(() => {
    let live = true;
    setBook(null);
    if (on) void readBook<KashshafData>('kashshaf').then(data => { if (live) setBook(data ?? false); });
    return () => { live = false; };
  }, [on]);
  const passage = useMemo(() => (book ? kashshafAt(book, ayah) : null), [book, ayah]);
  const firstLit = passage ? passage.lit.findIndex((_, at) => litWords(passage, at, ayah)) : -1;
  const [picked, setPicked] = useState<number | null>(null);
  const lit = picked ?? (firstLit >= 0 ? firstLit : null);
  useEffect(() => { const words = passage && lit !== null ? litWords(passage, lit, ayah) : null; onSpan(words ? [words] : []); }, [passage, lit, ayah, onSpan]);
  return (
    <>
      {passage && (
        <Card palette={palette} pad={[10, 14]}>
          <Text selectable style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' }}>
            {kashshafRuns(passage).map((run, i) => (
              <Text key={i} onPress={run.lit !== null ? () => setPicked(run.lit) : undefined}
                accessibilityState={run.lit !== null ? { selected: run.lit === lit } : undefined}
                style={run.lit !== null ? { backgroundColor: run.lit === lit ? deepBand(palette) : band(palette) } : undefined}>
                {run.opens && <Text style={{ fontSize: 14, color: palette.muted }}>{` ${run.devices.map(device => `«${device}»`).join(' ')} `}</Text>}
                {run.quran ? <QuranWords style={{ color: palette.accent }}>{run.text}</QuranWords> : run.text}
              </Text>
            ))}
          </Text>
          <Folded credit={kashshafCredit(passage)} palette={palette} extra={<OpenInBook book="kashshaf" ayah={ayah} onClose={onClose} palette={palette} />}>
            <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>
              {`${KASHSHAF_BOOK}، ${KASHSHAF_EDITION}. نص الموسوعة القرآنية، إصدار ${book ? book.source.version : ''}، بلا حواشي الكتب المطبوعة معه. تضاء الجملة التي يسمّي فيها الزمخشري فنًّا من فنون البلاغة.`}
            </Text>
            <ExternalLink url={kashshafPage(passage)} color={palette.muted} size={14} style={{ textAlign: 'right' }}>اقرأ الصفحة</ExternalLink>
          </Folded>
        </Card>
      )}
      {on && book === null && <LoadingDots fill />}
      {book && !passage && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'center', paddingVertical: 16 }}>لا كلام للكشاف على هذه الآية.</Text>}
      {on && book === false && <Text style={{ color: palette.accent, fontSize: 15, textAlign: 'right' }}>تعذّرت قراءة الكشاف على هاتفك. احذفه ونزّله مرة أخرى.</Text>}
      {!on && (
        <>
          <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>نزّل الكشاف للزمخشري لتقرأ كلامه على الآية، وتضاء فيه الجمل التي يسمّي فيها فنون البلاغة. يعمل بلا اتصال بعد تنزيله.</Text>
          <BookList kind="balagha" palette={palette} />
        </>
      )}
    </>
  );
}
