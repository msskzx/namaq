import { View } from 'react-native';
import { isnadParts, narratorOf, rangeName, reportLines, reportSlots, type AppReport, type AppStory, type AppStoryAyat } from '@shared/stories/story';
import HadithScene, { sceneBlocks } from '@/components/HadithScene';
import { BookMarked, ChevronDown, ChevronUp, Send } from 'lucide-react-native';
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

/** A story's tags, as muted words under its name (owner, 2026-11-19: chips there are its people), as the stories list shows them. */
export function Tags({ story, palette }: { story: AppStory; palette: Palette }) {
  return story.tags.length ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{story.tags.join(' · ')}</Text> : null;
}

/**
 * One report whole (owner, 2026-11-18): its chain first, then its moments, each our few words naming it over the source's
 * words, which together are the report as the book has it; then the book's words on who has it, and the page. It reads as
 * the book prints it (owner, 2026-11-19): a paragraph per moment, no titles or numbers, and the people once, under the
 * story's name. The moments' titles show only where a quiz asks by them (`titled`).
 */
export function Report({ report, palette, plain, titled }: { report: AppReport; palette: Palette;
  /** In a feed card the page is in the card's source line under its buttons (owner, 2026-11-20); the grading stays. */
  plain?: boolean;
  /** Our few words naming each moment, small over it: the «what came next?» question asks by them (QuizLook). */
  titled?: boolean }) {
  return (
    <View style={{ gap: 12 }}>
      {report.isnad ? <IsnadLine isnad={report.isnad} palette={palette} /> : null}
      {report.moments.map(moment => (
        <View key={moment.title} style={{ gap: 2 }}>
          {titled ? <Text style={{ color: palette.accent, fontSize: 14, fontWeight: '700', textAlign: 'right' }}>{moment.title}</Text> : null}
          <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' }}>{moment.text}</Text>
        </View>
      ))}
      {plain ? (report.grading ? <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' }}>{report.grading}</Text> : null)
        : <LeadLink lead={report.grading ? `${report.grading} ·` : undefined} url={report.url} color={palette.muted} lineHeight={22}>{report.cite}</LeadLink>}
    </View>
  );
}

/** The ayat a story turns on, whole in the mushaf's lines and shown at first (owner, 2026-11-18), with the quotes that say so. */
export function StoryAyat({ ayat, palette, folded = false }: { ayat: AppStoryAyat; palette: Palette;
  /** Folded at first (the feed card, where the story leads). */
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

/**
 * A report's chain in one line (owner, 2026-11-23): its last link as printed, «عَنْ أَنَسٍ رضي الله عنه قَالَ:», with an
 * arrow; a tap opens the whole chain in its place, the earlier links muted and the last in ink, and a second tap folds it.
 */
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

/** A report's book and page, for the line under its card, and in its drawing the books that say who speaks. */
export const reportSource = (report: AppReport, drawing = false) =>
  sourcesOf(uniqueSources([
    citeSource({ text: '', cite: report.cite, url: report.url }),
    ...(drawing ? report.moments.flatMap(moment => moment.turns ?? []).flatMap(turn => (turn.witness ? [citeSource(turn.witness)] : [])) : []),
  ]));

/**
 * A report drawn as a conversation («الرسم», owner 2026-11-21): whose telling it is in ink with its chain folded under
 * «السند», then the hadith scene (`HadithScene`) of its turns. On the story's page the people's chips above, in the
 * speakers' colours, are the key (`slots` given, no key of its own); in the feed card the scene draws its own key.
 */
export function ReportScene({ report, slots, palette }: { report: AppReport; slots?: Map<string, number>; palette: Palette }) {
  const lines = reportLines(report);
  return (
    <View style={{ gap: 10 }}>
      {report.isnad ? <IsnadLine isnad={report.isnad} palette={palette} /> : null}
      <HadithScene lines={lines} slots={slots ?? reportSlots(lines, palette.slots.length)} keyed={!slots} palette={palette} />
      {report.grading ? <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' }}>{report.grading}</Text> : null}
    </View>
  );
}

/**
 * A drawn story as pictures to share (owner's agreed layout, 2026-11-21): its name and «عَنْ ابْنِ عَبَّاسٍ» on the first
 * only; the scene's blocks with no chips, the lead-ins saying who speaks; the last moment together on the last
 * picture with the book and its number under it (a picture cannot be tapped open, so its place is written out).
 */
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

/** The share button of a drawn story, on its page and its feed card. */
export function StoryShare({ story, report, palette }: { story: AppStory; report: AppReport; palette: Palette }) {
  return <IconButton Icon={Send} label={`شارك ${story.name}`} onPress={() => shareCard({ content: () => null, paged: () => storyPictures(story, report, palette) })} />;
}
