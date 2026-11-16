import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react-native';
import { Text } from '@/components/Text';
import ExternalLink from '@/components/ExternalLink';
import itqan from '@shared/data/quran/itqanBalagha';
import { num } from '@shared/quran/arabicNumber';
import { ITQAN_BOOK, ITQAN_EDITION, itqanAt, itqanCredit, itqanPage, type ItqanParagraph } from '@shared/quran/itqanBalagha';
import { KASHSHAF_BOOK, KASHSHAF_EDITION, kashshafAt, kashshafCredit, kashshafPage, kashshafRuns, litWords, type KashshafData } from '@shared/quran/kashshaf';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import { bookState, readBook, useBooks } from '@/lib/books';
import { surahNames } from '@/lib/branches';
import { ayahMushafWords } from '@/lib/mushaf';
import { CARD, QURAN_FONT, type Palette } from '@/lib/theme';
import { BookList } from './Books';
import LoadingDots from './LoadingDots';
import Sheet from './Sheet';

/**
 * Balagha in the reader (owner, 2026-11-16; docs/plans/balagha.md), from two books picked with pills. Al-Itqan (built
 * in): each of al-Suyuti's paragraphs in his chapters on balagha that quotes the ayah, whole, under his own heading.
 * Al-Kashshaf (downloaded): al-Zamakhshari's whole passage, the sentences where he names a device lit with his word for
 * it in front. A tap on a paragraph or a lit sentence lights the ayah words it quotes. Each book's page folds open below.
 */
// The reader's neutral band (MushafPageView's mark): the ink at 10%, seen on a card in both themes.
const band = (palette: Palette) => `${palette.ink}1a`;
/** The sentence whose ayah words are lit: a deeper band. */
const deepBand = (palette: Palette) => `${palette.ink}33`;

type Book = 'itqan' | 'kashshaf';
const BOOK_NAMES: Record<Book, string> = { itqan: 'الإتقان للسيوطي', kashshaf: 'الكشاف للزمخشري' };

export default function BalaghaSheet({ ayah, onClose, palette }: { ayah: string | null; onClose: () => void; palette: Palette }) {
  const [kept, setKept] = useState(ayah);
  if (ayah && ayah !== kept) setKept(ayah);
  return (
    <Sheet open={!!ayah} onClose={onClose} palette={palette}>
      {kept && <BalaghaBody key={kept} ayah={kept} palette={palette} />}
    </Sheet>
  );
}

function BalaghaBody({ ayah, palette }: { ayah: string; palette: Palette }) {
  useBooks();
  const itqanOn = bookState('itqan') === 'on';
  const paragraphs = useMemo(() => (itqanOn ? itqanAt(itqan, ayah) : []), [ayah, itqanOn]);
  const [shown, setShown] = useState<Book>(paragraphs.length || bookState('kashshaf') !== 'on' ? 'itqan' : 'kashshaf');
  const [span, setSpan] = useState<[number, number][]>([]);
  const words = useMemo(() => ayahMushafWords(ayah), [ayah]);
  const [surah, number] = ayah.split(':').map(Number);
  const chip = (on: boolean) => ({ borderWidth: 1, borderColor: on ? palette.accent : palette.rule, backgroundColor: on ? palette.accent : 'transparent', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 });
  return (
    <View style={{ flexShrink: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingBottom: 8 }}>
        <Sparkles size={20} color={palette.muted} />
        <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16 }}>{`${surahNames[surah] ?? num(surah)} ${num(number)}`}</Text>
      </View>
      <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 8 }}>
        <View style={cardStyle(palette)}>
          <Text style={{ fontFamily: QURAN_FONT, fontSize: 23, lineHeight: 46, color: palette.ink, textAlign: 'right', writingDirection: 'rtl' }}>
            {words.map((word, i) => (
              <Text key={i} style={span.some(([from, to]) => i >= from && i <= to) ? { backgroundColor: deepBand(palette) } : undefined}>{`${i ? ' ' : ''}${word}`}</Text>
            ))}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }} accessibilityRole="tablist">
          {(['itqan', 'kashshaf'] as const).map(book => (
            <Pressable key={book} onPress={() => { setShown(book); setSpan([]); }} accessibilityRole="tab" aria-selected={shown === book} style={chip(shown === book)}>
              <Text style={{ color: shown === book ? palette.onAccent : palette.ink, fontSize: 15 }}>{BOOK_NAMES[book]}</Text>
            </Pressable>
          ))}
        </View>
        {shown === 'itqan'
          ? <Itqan paragraphs={paragraphs} palette={palette} onSpan={setSpan} />
          : <Kashshaf ayah={ayah} palette={palette} onSpan={setSpan} />}
      </ScrollView>
    </View>
  );
}

const cardStyle = (palette: Palette) => ({ ...CARD, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card, paddingHorizontal: 14, paddingVertical: 10 });

function Folded({ credit, children, palette }: { credit: string; children: React.ReactNode; palette: Palette }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable onPress={() => setOpen(was => !was)} accessibilityRole="button" aria-expanded={open}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderColor: palette.rule, minHeight: 36 }}>
        {open ? <ChevronUp size={16} color={palette.muted} /> : <ChevronDown size={16} color={palette.muted} />}
        <Text style={{ color: palette.muted, fontSize: 14 }}>{credit}</Text>
      </Pressable>
      {open && <View style={{ gap: 4 }}>{children}</View>}
    </>
  );
}

function Itqan({ paragraphs, palette, onSpan }: { paragraphs: ItqanParagraph[]; palette: Palette; onSpan: (span: [number, number][]) => void }) {
  useBooks();
  const [picked, setPicked] = useState(0);
  useEffect(() => { onSpan(paragraphs[picked]?.words ?? []); }, [paragraphs, picked, onSpan]);
  if (bookState('itqan') !== 'on') return <BookList kind="balagha" palette={palette} />;
  if (!paragraphs.length) return <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'center', paddingVertical: 16 }}>لم يستشهد السيوطي بهذه الآية في أنواع البلاغة.</Text>;
  return paragraphs.map((paragraph, i) => (
    <View key={`${paragraph.id}/${i}`} style={[cardStyle(palette), picked === i && paragraphs.length > 1 ? { borderColor: palette.ink } : null]}>
      {/* The paragraph lights the words it quotes; its reference below is a control of its own. */}
      <Pressable onPress={() => setPicked(i)} accessibilityRole="button" aria-pressed={picked === i}>
      <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 22, textAlign: 'right' }}>{paragraph.heading ? `«${paragraph.heading}» · ${paragraph.kind}` : paragraph.kind}</Text>
      {paragraph.places > 1 && <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{`مواضع الشاهد في القرآن: ${num(paragraph.places)}، ولم يعيّن السيوطي أحدها`}</Text>}
      <Text selectable style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' }}>
        {tafsirRuns(paragraph.text).map((run, j) => <Text key={j} style={run.quran ? { fontFamily: QURAN_FONT, color: palette.accent } : undefined}>{run.text}</Text>)}
      </Text>
      </Pressable>
      <Folded credit={itqanCredit(paragraph)} palette={palette}>
        <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>
          {`${ITQAN_BOOK}، ${ITQAN_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث. الفقرة كاملة كما في الكتاب، والعنوان عنوانه.`}
        </Text>
        <ExternalLink url={itqanPage(paragraph)} color={palette.muted} size={14} style={{ textAlign: 'right' }}>اقرأ الصفحة</ExternalLink>
      </Folded>
    </View>
  ));
}

function Kashshaf({ ayah, palette, onSpan }: { ayah: string; palette: Palette; onSpan: (span: [number, number][]) => void }) {
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
        <View style={cardStyle(palette)}>
          <Text selectable style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' }}>
            {kashshafRuns(passage).map((run, i) => (
              <Text key={i} onPress={run.lit !== null ? () => setPicked(run.lit) : undefined}
                accessibilityState={run.lit !== null ? { selected: run.lit === lit } : undefined}
                style={[run.quran ? { fontFamily: QURAN_FONT, color: palette.accent } : null, run.lit !== null ? { backgroundColor: run.lit === lit ? deepBand(palette) : band(palette) } : null]}>
                {run.opens && <Text style={{ fontSize: 14, color: palette.muted }}>{` ${run.devices.map(device => `«${device}»`).join(' ')} `}</Text>}
                {run.text}
              </Text>
            ))}
          </Text>
          <Folded credit={kashshafCredit(passage)} palette={palette}>
            <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>
              {`${KASHSHAF_BOOK}، ${KASHSHAF_EDITION}. نص الموسوعة القرآنية، إصدار ${book ? book.source.version : ''}، بلا حواشي الكتب المطبوعة معه. تضاء الجملة التي يسمّي فيها الزمخشري فنًّا من فنون البلاغة.`}
            </Text>
            <ExternalLink url={kashshafPage(passage)} color={palette.muted} size={14} style={{ textAlign: 'right' }}>اقرأ الصفحة</ExternalLink>
          </Folded>
        </View>
      )}
      {on && book === null && <View accessibilityLabel="جارٍ التحميل" style={{ paddingVertical: 16, alignItems: 'center' }}><LoadingDots /></View>}
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
