import { Fragment } from 'react';
import { View } from 'react-native';
import Svg, { Line as SvgLine, Path } from 'react-native-svg';
import { BookOpen, Send } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { letterDiff, rangeLabel, type ExampleView, type Line, type Step, type TurnView, type Voice } from '@shared/quran/iltifat';
import { Text } from '@/ui/Text';
import Bubble from '@/ui/Bubble';
import { readAyah } from '@/lib/openReader';
import { shareCard } from '@/lib/shareImage';
import { CARD, type Palette } from '@/lib/theme';
import AyahFlow, { AyahWords, TreeText } from './quran/text/AyahFlow';
import IconButton from '@/ui/IconButton';
import Card from '@/ui/Card';

// The app lays out right to left (direction: 'rtl' in app/_layout.tsx), so a row starts on the right.

/** The website's colours for the three voices (src/app/quran/lataif/LataifView.tsx). */
export const voiceColor = (palette: Palette, voice: Voice) => ({ he: palette.path, we: palette.green, you: palette.root })[voice];
export const VOICE_NAME: Record<Voice, string> = { he: 'غيبة', we: 'تكلم', you: 'خطاب' };

function Words({ lines, palette }: { lines: Line[]; palette: Palette }) {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && ' '}
      {line.words.map((word, k) => (
        <Fragment key={k}>
          {k > 0 && ' '}
          <AyahWords look={word.voice ? { color: voiceColor(palette, word.voice) } : undefined}>{word.text}</AyahWords>
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
        <TreeText center look={{ color: palette.ink }}>{mushafText(trunk)}</TreeText>
      </View>
      <Svg width="100%" height={22} viewBox="0 0 320 22" preserveAspectRatio="none">
        <Path d="M160 0 V8 Q160 12 150 12 H90 Q80 12 80 22 M160 8 Q160 12 170 12 H230 Q240 12 240 22" stroke={palette.rule} strokeWidth={1.5} fill="none" vectorEffect="non-scaling-stroke" />
      </Svg>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {leaves.map((leaf, i) => (
          <View key={leaf.ayah} style={[box, { flex: 1, alignItems: 'center', paddingVertical: 4 }]} accessibilityLabel={`${leaf.who}، ${num(leaf.ayah)}`}>
            <TreeText look={{ color: palette.ink }}>{parts[i][0]}<Text style={{ color: palette.accent }}>{parts[i][1]}</Text>{parts[i][2]}</TreeText>
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
        if ('narration' in turn) return <AyahFlow key={i} center color={palette.muted}><Words lines={turn.narration} palette={palette} /></AyahFlow>;
        const color = voiceColor(palette, turn.voice);
        const start = turn.side === 'start';
        return (
          <Bubble key={i} who={turn.who} colour={color} start={start} framed={!!turn.said} palette={palette}>
            <AyahFlow screen color={palette.ink}><Words lines={turn.lines} palette={palette} /></AyahFlow>
          </Bubble>
        );
      })}
    </View>
  );
}

/** One example's scene: its place, then its own picture. */
export function IltifatScene({ view, palette }: { view: ExampleView; palette: Palette }) {
  return <>
    <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{iltifatTitle(view)}</Text>
    {view.kind === 'strip' && <>
      <Strip steps={view.steps} palette={palette} />
      <AyahFlow color={palette.ink}><Words lines={view.lines} palette={palette} /></AyahFlow>
    </>}
    {view.kind === 'tree' && <Tree trunk={view.trunk} leaves={view.leaves} palette={palette} />}
    {view.kind === 'dialog' && <Dialog turns={view.turns} palette={palette} />}
  </>;
}

const iltifatTitle = (view: ExampleView) => `${view.name} ${rangeLabel(view)}`;

/** An example's mushaf and share buttons: inside its card on «مشاهد», under the card in the home feed. */
export function IltifatActions({ view, palette, only }: { view: ExampleView; palette: Palette;
  /** One of the two, where a feed card puts them apart: open first in its row, share after save (owner, 2026-11-20). */
  only?: 'open' | 'share' }) {
  const title = iltifatTitle(view);
  return <>
    {only !== 'share' && <IconButton Icon={BookOpen} label={`افتح ${title} في المصحف`} onPress={() => readAyah(`${view.surah}:${view.from}`)} />}
    {only !== 'open' && <IconButton Icon={Send} label={`شارك ${title}`} onPress={() => shareCard({ content: width => <View style={{ width }}><IltifatCard view={view} palette={palette} image /></View> })} />}
  </>;
}

/** One example's card: its scene, then the mushaf and share buttons on the right (left out of the shared image). */
export function IltifatCard({ view, palette, image }: { view: ExampleView; palette: Palette; image?: boolean }) {
  return (
    <Card palette={palette} pad={[10, 16]} gap={10} accessibilityLabel={iltifatTitle(view)}>
      <IltifatScene view={view} palette={palette} />
      {image ? <View style={{ height: 10 }} /> : <View style={{ flexDirection: 'row' }}><IltifatActions view={view} palette={palette} /></View>}
    </Card>
  );
}
