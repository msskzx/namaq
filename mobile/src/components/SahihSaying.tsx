import { View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { namePieces, sahihLabel, sahihPlace, sahihSources, type PersonFact, type SahihQuote } from '@shared/tarajim';
import { Text } from '@/ui/Text';
import EdgeBar from '@/ui/EdgeBar';
import Folded from '@/ui/Folded';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import type { Palette } from '@/lib/theme';

/** The narrator's own opening, up to the first quote mark when it comes soon («قَالَ: سَمِعْتُ عَلِيًّا يَقُولُ: «»): muted. */
const leadOf = (words: string) => {
  const at = words.search(/[«"“]/);
  return at > 0 && at <= 120 ? at : 0;
};

/** One route: its chain folded (shown on a tap, never left out), then from its last narrator on, his name lit. */
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

/**
 * A report the Sahih gives, in its words (owner, 2026-11-25, sketch data-plan/shots/siyar-sahih-sketch2.png): the route
 * closest to the Siyar's words open, its chain folded; one line under it, «صحيح البخاري (٤٠٥٨)، وذكره غيره», opening every
 * place it is (the Siyar's page too); the other routes the Siyar's editor names folded under it, each opened at will.
 */
export default function SahihSaying({ fact, names, palette, tone, marked }: { fact: PersonFact; names: readonly string[]; palette: Palette; tone?: string; marked?: boolean }) {
  const [first, ...rest] = fact.sahih!;
  const books = sourcesOf(sahihSources(fact));
  return (
    <View style={{ gap: 4 }}>
      <Route quote={first} names={names} palette={palette} size={18} tone={tone} marked={marked} />
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
