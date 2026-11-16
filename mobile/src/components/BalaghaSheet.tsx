import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react-native';
import { Text } from '@/components/Text';
import ExternalLink from '@/components/ExternalLink';
import { num } from '@shared/quran/arabicNumber';
import { KASHSHAF_BOOK, KASHSHAF_EDITION, kashshafAt, kashshafCredit, kashshafPage, kashshafRuns, litWords, type KashshafData } from '@shared/quran/kashshaf';
import { bookState, readBook, useBooks } from '@/lib/books';
import { surahNames } from '@/lib/branches';
import { ayahMushafWords } from '@/lib/mushaf';
import { CARD, QURAN_FONT, type Palette } from '@/lib/theme';
import { BookList } from './Books';
import LoadingDots from './LoadingDots';
import Sheet from './Sheet';
import OpenInBook from './OpenInBook';

/**
 * Balagha in the reader (owner, 2026-11-16; docs/plans/balagha.md): al-Zamakhshari's whole passage on the ayah from
 * al-Kashshaf, a book the phone downloads. The sentences where he names a device are lit with his word for it in front;
 * a tap on one lights the ayah words it quotes. The book and page fold open under the passage.
 */
// The reader's neutral band (MushafPageView's mark): the ink at 10%, seen on a card in both themes.
const band = (palette: Palette) => `${palette.ink}1a`;
/** The sentence whose ayah words are lit: a deeper band. */
const deepBand = (palette: Palette) => `${palette.ink}33`;

export default function BalaghaSheet({ ayah, onClose, palette }: { ayah: string | null; onClose: () => void; palette: Palette }) {
  const [kept, setKept] = useState(ayah);
  if (ayah && ayah !== kept) setKept(ayah);
  return (
    <Sheet open={!!ayah} onClose={onClose} palette={palette}>
      {kept && <BalaghaBody key={kept} ayah={kept} palette={palette} onClose={onClose} />}
    </Sheet>
  );
}

function BalaghaBody({ ayah, palette, onClose }: { ayah: string; palette: Palette; onClose: () => void }) {
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
  const passage = book ? kashshafAt(book, ayah) : null;
  const words = useMemo(() => ayahMushafWords(ayah), [ayah]);
  const [surah, number] = ayah.split(':').map(Number);
  const firstLit = passage ? passage.lit.findIndex((_, at) => litWords(passage, at, ayah)) : -1;
  const [picked, setPicked] = useState<number | null>(null);
  const lit = picked ?? (firstLit >= 0 ? firstLit : null);
  const span = passage && lit !== null ? litWords(passage, lit, ayah) : null;
  const [reference, setReference] = useState(false);
  const card = { ...CARD, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card, paddingHorizontal: 14, paddingVertical: 10 };
  const range = passage && passage.from !== passage.to ? `${num(passage.from)}–${num(passage.to)}` : num(number);
  return (
    <View style={{ flexShrink: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingBottom: 8 }}>
        <Sparkles size={20} color={palette.muted} />
        <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16 }}>{`${surahNames[surah] ?? num(surah)} ${range}`}</Text>
      </View>
      <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 8 }}>
        <View style={card}>
          <Text style={{ fontFamily: QURAN_FONT, fontSize: 23, lineHeight: 46, color: palette.ink, textAlign: 'right', writingDirection: 'rtl' }}>
            {words.map((word, i) => (
              <Text key={i} style={span && i >= span[0] && i <= span[1] ? { backgroundColor: deepBand(palette) } : undefined}>{`${i ? ' ' : ''}${word}`}</Text>
            ))}
          </Text>
        </View>
        {passage && (
          <View style={card}>
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
            <Pressable onPress={() => setReference(open => !open)} accessibilityRole="button" aria-expanded={reference}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderColor: palette.rule, minHeight: 36 }}>
              {reference ? <ChevronUp size={16} color={palette.muted} /> : <ChevronDown size={16} color={palette.muted} />}
              <Text style={{ flex: 1, color: palette.muted, fontSize: 14 }}>{kashshafCredit(passage)}</Text>
              <OpenInBook book="kashshaf" ayah={ayah} onClose={onClose} palette={palette} />
            </Pressable>
            {reference && (
              <View style={{ gap: 4 }}>
                <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>
                  {`${KASHSHAF_BOOK}، ${KASHSHAF_EDITION}. نص الموسوعة القرآنية، إصدار ${book ? book.source.version : ''}، بلا حواشي الكتب المطبوعة معه. تضاء الجملة التي يسمّي فيها الزمخشري فنًّا من فنون البلاغة.`}
                </Text>
                <ExternalLink url={kashshafPage(passage)} color={palette.muted} size={14} style={{ textAlign: 'right' }}>اقرأ الصفحة</ExternalLink>
              </View>
            )}
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
      </ScrollView>
    </View>
  );
}
