import { Fragment } from 'react';
import { Pressable, Share, View } from 'react-native';
import Svg, { Line as SvgLine, Path } from 'react-native-svg';
import { BookOpen, Send } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { letterDiff, rangeLabel, shareText, type ExampleView, type Line, type Step, type TurnView, type Voice } from '@shared/quran/iltifat';
import { Text } from '@/components/Text';
import { readAyah } from '@/lib/openReader';
import { CARD, QURAN_FONT, type Palette } from '@/lib/theme';

// The app lays out right to left (direction: 'rtl' in app/_layout.tsx), so a row starts on the right.

/** The website's colours for the three voices (src/app/quran/iltifat/IltifatView.tsx). */
export const voiceColor = (palette: Palette, voice: Voice) => ({ he: palette.path, we: palette.green, you: palette.root })[voice];
export const VOICE_NAME: Record<Voice, string> = { he: 'غيبة', we: 'تكلم', you: 'خطاب' };

const quran = (palette: Palette) => ({ fontFamily: QURAN_FONT, fontSize: 22, lineHeight: 44, color: palette.ink, writingDirection: 'rtl' as const });

function Words({ lines, palette }: { lines: Line[]; palette: Palette }) {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && ' '}
      {line.words.map((word, k) => (
        <Fragment key={k}>
          {k > 0 && ' '}
          {word.voice ? <Text style={{ color: voiceColor(palette, word.voice) }}>{mushafText(word.text)}</Text> : mushafText(word.text)}
        </Fragment>
      ))}
      {line.end && <Text style={{ color: palette.amber }}>{' '}{num(line.ayah)}</Text>}
    </Fragment>
  ));
}

function Strip({ steps, palette }: { steps: Step[]; palette: Palette }) {
  return (
    <View accessible style={{ flexDirection: 'row', alignItems: 'flex-start' }} accessibilityLabel={steps.map(step => `${step.label}: ${VOICE_NAME[step.voice]}`).join('، ثم ')}>
      {steps.map((step, i) => {
        const color = voiceColor(palette, step.voice);
        return (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            {i > 0 && <View style={{ width: 36, height: 1.5, marginTop: 16, backgroundColor: palette.rule }} />}
            <View style={{ alignItems: 'center', minWidth: 56 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1.5, borderColor: color, borderRadius: 999, paddingHorizontal: 12, minHeight: 32 }}>
                <Text style={{ color, fontSize: 17 }}>{step.label}</Text>
                {step.count && <Text style={{ color, fontSize: 9, letterSpacing: 2 }}>{'●'.repeat(step.count)}</Text>}
              </View>
              {(step.at || step.note) && <Text style={{ color: palette.muted, fontSize: 13 }}>{step.at ? rangeLabel({ from: step.at[0], to: step.at[1] }) : step.note}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function Tree({ trunk, leaves, palette }: { trunk: string; leaves: { ayah: number; who: string; word: string }[]; palette: Palette }) {
  const parts = letterDiff(mushafText(leaves[0].word), mushafText(leaves[1].word));
  const box = { borderWidth: 1.5, borderColor: palette.rule, ...CARD };
  return (
    <View>
      <View style={[box, { paddingHorizontal: 12, paddingVertical: 2 }]}>
        <Text style={[quran(palette), { fontSize: 20, lineHeight: 40, textAlign: 'center' }]}>{mushafText(trunk)}</Text>
      </View>
      <Svg width="100%" height={22} viewBox="0 0 320 22" preserveAspectRatio="none">
        <Path d="M160 0 V8 Q160 12 150 12 H90 Q80 12 80 22 M160 8 Q160 12 170 12 H230 Q240 12 240 22" stroke={palette.rule} strokeWidth={1.5} fill="none" vectorEffect="non-scaling-stroke" />
      </Svg>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {leaves.map((leaf, i) => (
          <View key={leaf.ayah} style={[box, { flex: 1, alignItems: 'center', paddingVertical: 4 }]} accessibilityLabel={`${leaf.who}، ${num(leaf.ayah)}`}>
            <Text style={[quran(palette), { fontSize: 24, lineHeight: 46 }]}>{parts[i][0]}<Text style={{ color: palette.accent }}>{parts[i][1]}</Text>{parts[i][2]}</Text>
            <Text style={{ color: palette.muted, fontSize: 13 }}>{leaf.who} · {num(leaf.ayah)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Android draws a one-sided dashed border solid, so the scene cut is a drawn line. */
function Dash({ palette }: { palette: Palette }) {
  return (
    <Svg style={{ flex: 1, height: 2 }}>
      <SvgLine x1="0" y1="1" x2="100%" y2="1" stroke={palette.rule} strokeWidth={1.5} strokeDasharray="4 3" />
    </Svg>
  );
}

function Dialog({ turns, palette }: { turns: TurnView[]; palette: Palette }) {
  return (
    <View style={{ gap: 8 }}>
      {turns.map((turn, i) => {
        if ('cut' in turn) return (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Dash palette={palette} />
            <Text style={{ color: palette.muted, fontSize: 13 }}>{turn.cut}</Text>
            <Dash palette={palette} />
          </View>
        );
        if ('narration' in turn) return <Text key={i} style={[quran(palette), { fontSize: 20, lineHeight: 40, color: palette.muted, textAlign: 'center' }]}><Words lines={turn.narration} palette={palette} /></Text>;
        const color = voiceColor(palette, turn.voice);
        const start = turn.side === 'start';
        return (
          <View key={i} style={{ maxWidth: '88%', alignSelf: start ? 'flex-start' : 'flex-end', backgroundColor: palette.paper, ...CARD,
            borderTopStartRadius: start ? 4 : CARD.borderRadius, borderTopEndRadius: start ? CARD.borderRadius : 4,
            borderWidth: turn.said ? 1.5 : 0, borderColor: color, paddingHorizontal: 12, paddingTop: 6, paddingBottom: 2 }}>
            <Text style={{ color, fontSize: 13, textAlign: 'right' }}>{turn.who}</Text>
            <Text style={[quran(palette), { fontSize: 20, lineHeight: 40, textAlign: 'right' }]}><Words lines={turn.lines} palette={palette} /></Text>
          </View>
        );
      })}
    </View>
  );
}

/** One example's card: its place, its own picture, then the mushaf and share buttons on the right. */
export function IltifatCard({ view, palette }: { view: ExampleView; palette: Palette }) {
  const title = `${view.name} ${rangeLabel(view)}`;
  return (
    <View style={{ backgroundColor: palette.card, ...CARD, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4, gap: 10 }} accessibilityLabel={title}>
      <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{title}</Text>
      {view.kind === 'strip' && <>
        <Strip steps={view.steps} palette={palette} />
        <Text style={[quran(palette), { textAlign: 'justify' }]}><Words lines={view.lines} palette={palette} /></Text>
      </>}
      {view.kind === 'tree' && <Tree trunk={view.trunk} leaves={view.leaves} palette={palette} />}
      {view.kind === 'dialog' && <Dialog turns={view.turns} palette={palette} />}
      <View style={{ flexDirection: 'row' }}>
        <Pressable onPress={() => readAyah(`${view.surah}:${view.from}`)} accessibilityRole="button" accessibilityLabel={`افتح ${title} في المصحف`} hitSlop={6} style={{ padding: 8 }}>
          <BookOpen size={21} color={palette.muted} />
        </Pressable>
        <Pressable onPress={() => void Share.share({ message: mushafText(shareText(view)) })} accessibilityRole="button" accessibilityLabel={`شارك ${title}`} hitSlop={6} style={{ padding: 8 }}>
          <Send size={21} color={palette.muted} />
        </Pressable>
      </View>
    </View>
  );
}
