import { View } from 'react-native';
import { narratorOf, rangeName, reportLines, reportSlots, type AppReport, type AppStory, type AppStoryAyat } from '@shared/stories/story';
import HadithScene from '@/components/HadithScene';
import { Text } from '@/ui/Text';
import ExternalLink from '@/ui/ExternalLink';
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
      {report.isnad ? <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>{report.isnad}</Text> : null}
      {report.moments.map(moment => (
        <View key={moment.title} style={{ gap: 2 }}>
          {titled ? <Text style={{ color: palette.accent, fontSize: 14, fontWeight: '700', textAlign: 'right' }}>{moment.title}</Text> : null}
          <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' }}>{moment.text}</Text>
        </View>
      ))}
      {plain ? (report.grading ? <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' }}>{report.grading}</Text> : null)
        : <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' }}>
          {report.grading ? `${report.grading} · ` : ''}
          <ExternalLink url={report.url} color={palette.muted} size={13}>{report.cite}</ExternalLink>
        </Text>}
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
      {report.isnad ? (
        <View style={{ gap: 2 }}>
          <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{narratorOf(report.isnad)}</Text>
          <Folded credit="السند" palette={palette}>
            <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>{report.isnad}</Text>
          </Folded>
        </View>
      ) : null}
      <HadithScene lines={lines} slots={slots ?? reportSlots(lines, palette.slots.length)} keyed={!slots} palette={palette} />
      {report.grading ? <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' }}>{report.grading}</Text> : null}
    </View>
  );
}
