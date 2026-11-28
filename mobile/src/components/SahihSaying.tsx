import { View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { namePieces, sahihLabel, sahihPlace, sahihSources, type PersonFact, type SahihQuote } from '@shared/tarajim';
import { Text } from '@/ui/Text';
import EdgeBar from '@/ui/EdgeBar';
import Folded from '@/ui/Folded';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import OpenButton from '@/ui/OpenButton';
import type { Palette } from '@/lib/theme';
import { openSahih } from '@/lib/ways';

const leadOf = (words: string) => {
  const at = words.search(/[«"“]/);
  return at > 0 && !/[.؟!]/.test(words.slice(0, at)) ? at : 0;
};

function Route({ quote, names, palette, size, tone, marked }: { quote: SahihQuote; names: readonly string[]; palette: Palette; size: number; tone?: string; marked?: boolean }) {
  const lead = leadOf(quote.words);
  return (
    <View style={{ gap: 4 }}>
      {quote.isnad ? (
        <Folded bare credit="الإسناد" palette={palette}>
          <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>{quote.isnad}</Text>
        </Folded>
      ) : null}
      <EdgeBar tone={tone ?? palette.accent}>
        <Text style={{ color: marked ? palette.green : palette.ink, fontSize: size, lineHeight: size * 1.7, textAlign: 'right' }}>
          {lead ? <Text style={{ color: palette.muted }}>{quote.words.slice(0, lead)}</Text> : null}
          {namePieces(quote.words.slice(lead), names).map((piece, i) => (piece.name ? <Text key={i} style={{ color: palette.accent }}>{piece.text}</Text> : piece.text))}
        </Text>
      </EdgeBar>
    </View>
  );
}

export default function SahihSaying({ fact, names, palette, tone, marked }: { fact: PersonFact; names: readonly string[]; palette: Palette; tone?: string; marked?: boolean }) {
  const [first, ...rest] = fact.sahih!;
  const books = sourcesOf(sahihSources(fact));
  return (
    <View style={{ gap: 4 }}>
      <Route quote={first} names={names} palette={palette} size={18} tone={tone} marked={marked} />
      <View style={{ flexDirection: 'row' }}>
        <OpenButton what="الحديث" label={`افتح ${sahihPlace(first)}`} onPress={() => openSahih(first.book, first.n)} />
      </View>
      <SourceLine label={sahihLabel(fact)} sources={books} named={books} palette={palette} small />
      {rest.length > 0 && (
        <Folded credit={`روايات أخرى في الصحيحين (${num(rest.length)})`} palette={palette}>
          {rest.map(quote => (
            <Folded key={`${quote.book}${quote.n}${quote.route ?? ''}`} credit={sahihPlace(quote)} palette={palette}>
              <Route quote={quote} names={names} palette={palette} size={16} tone={palette.rule} />
            </Folded>
          ))}
        </Folded>
      )}
    </View>
  );
}
