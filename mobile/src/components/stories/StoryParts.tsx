import { View } from 'react-native';
import { isnadParts, narratorOf, rangeName, reportLines, reportSlots, whenName, type AppReport, type AppStory, type AppStoryAyat } from '@shared/stories/story';
import HadithScene, { sceneBlocks } from '@/components/HadithScene';
import { BookMarked, ChevronDown, ChevronLeft, ChevronUp, Send } from 'lucide-react-native';
import { toTab } from '@/lib/ways';
import { useState } from 'react';
import TapRow from '@/ui/TapRow';
import IconButton from '@/ui/IconButton';
import { shareCard, type SharePaged } from '@/lib/shareImage';
import { UI_FONT_BOLD } from '@/lib/theme';
import { Text } from '@/ui/Text';
import { LeadLink } from '@/ui/ExternalLink';
import Folded from '@/ui/Folded';
import { AyatRange } from '@/components/AyahLines';
import { Readings, Refs } from '@/components/battles/BattleParts';
import { sourcesOf } from '@/ui/SourceLine';
import { citeSource, uniqueSources } from '@shared/quiz/sources';
import type { Palette } from '@/lib/theme';

export function Tags({ story, palette }: { story: AppStory; palette: Palette }) {
  return story.tags.length ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{story.tags.join(' · ')}</Text> : null;
}

export function Report({ report, palette, plain, titled, chainAfter }: { report: AppReport; palette: Palette;
  plain?: boolean;
  chainAfter?: boolean;
  titled?: boolean }) {
  return (
    <View style={{ gap: 12 }}>
      {report.isnad && !chainAfter ? <IsnadLine isnad={report.isnad} palette={palette} /> : null}
      {report.moments.map(moment => (
        <View key={moment.title} style={{ gap: 2 }}>
          {titled ? <Text style={{ color: palette.accent, fontSize: 14, fontWeight: '700', textAlign: 'right' }}>{moment.title}</Text> : null}
          <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' }}>{moment.text}</Text>
        </View>
      ))}
      {report.isnad && chainAfter ? <ChainAfter isnad={report.isnad} palette={palette} /> : null}
      {plain ? (report.grading ? <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' }}>{report.grading}</Text> : null)
        : <LeadLink lead={report.grading ? `${report.grading} ·` : undefined} url={report.url} color={palette.muted} lineHeight={22}>{report.cite}</LeadLink>}
    </View>
  );
}

export function StoryAyat({ ayat, palette, folded = false }: { ayat: AppStoryAyat; palette: Palette;
  folded?: boolean }) {
  return (
    <View style={{ gap: 6 }}>
      <Folded credit={`${ayat.label}: ${rangeName(ayat.from, ayat.to)}`} startOpen={!folded} palette={palette}>
        <AyatRange from={ayat.from} to={ayat.to} palette={palette} />
      </Folded>
      <Refs refs={ayat.refs} palette={palette} />
      {ayat.others ? <Readings values={[{ value: null, refs: [], others: ayat.others }]} palette={palette} /> : null}
    </View>
  );
}

export function IsnadLine({ isnad, palette }: { isnad: string; palette: Palette }) {
  const [open, setOpen] = useState(false);
  const { head, tail } = isnadParts(isnad);
  const Arrow = open ? ChevronUp : ChevronDown;
  return (
    <TapRow onPress={() => setOpen(was => !was)} disabled={!head} expanded={open} label={!head ? tail : open ? `${head} ${tail}، اطو السند` : `${narratorOf(isnad)}، السند كاملا`} style={{ alignItems: 'center', gap: 6 }}>
      <Text style={{ flex: 1, textAlign: 'right', lineHeight: 26 }}>
        {open && head ? <Text style={{ color: palette.muted, fontSize: 14 }}>{`${head} `}</Text> : null}
        <Text style={{ color: palette.ink, fontSize: 16 }}>{tail}</Text>
      </Text>
      {head ? <Arrow size={18} color={palette.muted} /> : null}
    </TapRow>
  );
}

export function ChainAfter({ isnad, palette }: { isnad: string; palette: Palette }) {
  return (
    <View style={{ gap: 2, borderTopWidth: 1, borderColor: `${palette.rule}66`, paddingTop: 8 }}>
      <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>السند</Text>
      <IsnadLine isnad={isnad} palette={palette} />
    </View>
  );
}

export const reportSource = (report: AppReport, drawing = false) =>
  sourcesOf(uniqueSources([
    citeSource({ text: '', cite: report.cite, url: report.url }),
    ...(drawing ? report.moments.flatMap(moment => moment.turns ?? []).flatMap(turn => (turn.witness ? [citeSource(turn.witness)] : [])) : []),
  ]));

export function ReportScene({ report, slots, palette, chainAfter }: { report: AppReport; slots?: Map<string, number>; palette: Palette;
  chainAfter?: boolean }) {
  const lines = reportLines(report);
  return (
    <View style={{ gap: 10 }}>
      {report.isnad && !chainAfter ? <IsnadLine isnad={report.isnad} palette={palette} /> : null}
      <HadithScene lines={lines} slots={slots ?? reportSlots(lines, palette.slots.length)} keyed={!slots} palette={palette} />
      {report.isnad && chainAfter ? <ChainAfter isnad={report.isnad} palette={palette} /> : null}
      {report.grading ? <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' }}>{report.grading}</Text> : null}
    </View>
  );
}

function storyPictures(story: AppStory, report: AppReport, palette: Palette): SharePaged {
  const lines = reportLines(report);
  const blocks = sceneBlocks(lines, reportSlots(lines, palette.slots.length), palette);
  const lastFrom = lines.length - (report.moments.at(-1)?.turns?.length ?? 0);
  const tailFrom = blocks.findIndex(block => block.line >= lastFrom);
  return {
    head: (
      <View style={{ gap: 4 }}>
        <Text style={{ color: palette.ink, fontSize: 22, fontFamily: UI_FONT_BOLD, lineHeight: 36, textAlign: 'right' }}>{story.name}</Text>
        {report.isnad ? <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{narratorOf(report.isnad)}</Text> : null}
      </View>
    ),
    blocks: blocks.map(block => block.node),
    ...(tailFrom > 0 ? { tailFrom } : {}),
    foot: (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <BookMarked size={15} color={palette.muted} />
        <Text style={{ color: palette.muted, fontSize: 14 }}>{report.cite}</Text>
      </View>
    ),
  };
}

export function StoryShare({ story, report, palette }: { story: AppStory; report: AppReport; palette: Palette }) {
  return <IconButton Icon={Send} label={`شارك ${story.name}`} onPress={() => shareCard({ content: () => null, paged: () => storyPictures(story, report, palette) })} />;
}

export function StoryLinkRow({ story, palette, first = false }: { story: AppStory; palette: Palette;
  first?: boolean }) {
  const line = [whenName(story), story.reports[0]?.cite].filter(Boolean).join(' · ');
  return (
    <TapRow onPress={() => toTab({ pathname: '/story', params: { slug: story.slug } })} role="link" label={story.name}
      style={{ alignItems: 'center', gap: 8, paddingVertical: 8, ...(first ? {} : { borderTopWidth: 1, borderColor: `${palette.rule}70` }) }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: palette.ink, fontSize: 17, textAlign: 'right' }}>{story.name}</Text>
        {line ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{line}</Text> : null}
      </View>
      <ChevronLeft size={18} color={palette.muted} />
    </TapRow>
  );
}
