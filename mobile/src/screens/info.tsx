import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import ExternalLink from '@/ui/ExternalLink';
import { Tap } from '@/ui/Tap';
import { toTab } from '@/lib/ways';
import { usePalette, type Palette } from '@/lib/theme';
import { ABOUT_INTRO, ABOUT_REFERENCES, APP_PRIVACY, ATTRIBUTIONS_INTRO, NAMAQ_FORMS, NAMAQ_NAME, SOURCE_EXTRAS } from '@shared/infoPages';
import { GROUPS, SOURCES, type Source } from '@shared/sources';

export type InfoPage = 'about' | 'privacy' | 'attributions';
export const INFO_TITLES: Record<InfoPage, string> = { about: 'عن نمق', attributions: 'المصادر والتراخيص', privacy: 'سياسة الخصوصية' };

const paragraph = (palette: Palette, muted = false) => ({ color: muted ? palette.muted : palette.ink, fontSize: muted ? 15 : 17, lineHeight: muted ? 26 : 30, textAlign: 'right' as const });
const heading = (palette: Palette) => ({ color: palette.accent, fontSize: 20, textAlign: 'right' as const, marginTop: 8 });

function About({ palette }: { palette: Palette }) {
  const name = NAMAQ_NAME.ar;
  return (
    <>
      <Text style={paragraph(palette)}>{ABOUT_INTRO.ar}</Text>
      <Text accessibilityRole="header" style={heading(palette)}>المراجع</Text>
      {ABOUT_REFERENCES.map(text => <Text key={text.ar} style={paragraph(palette)}>{text.ar}</Text>)}
      <Tap onPress={() => router.push('/attributions')} accessibilityRole="link" style={{ alignSelf: 'flex-start' }}>
        <Text style={{ color: palette.accent, fontSize: 17 }}>{INFO_TITLES.attributions}</Text>
      </Tap>
      <Text accessibilityRole="header" style={heading(palette)}>اسم نمق</Text>
      {[name.verb, name.noun].map(entry => (
        <Card key={entry.title} palette={palette} gap={4}>
          <Text style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>{entry.title}</Text>
          <Text style={paragraph(palette)}>{entry.definition}</Text>
          {entry.forms.filter(form => form !== entry.definition).map(form => <Text key={form} style={paragraph(palette, true)}>{form}</Text>)}
        </Card>
      ))}
      <Text style={[paragraph(palette, true), { textAlign: 'center' }]}>{NAMAQ_FORMS.join(' · ')}</Text>
    </>
  );
}

function Privacy({ palette }: { palette: Palette }) {
  return APP_PRIVACY.map(section => (
    <View key={section.title} style={{ gap: 4 }}>
      <Text accessibilityRole="header" style={heading(palette)}>{section.title}</Text>
      <Text style={paragraph(palette)}>{section.body}</Text>
    </View>
  ));
}

function Line({ label, children, palette }: { label: string; children: React.ReactNode; palette: Palette }) {
  return <Text style={paragraph(palette)}><Text style={{ color: palette.muted }}>{label}</Text>{children}</Text>;
}

/** One source as the website's SourceCard draws it: its uses as plain words, since they name website pages. */
function SourceCard({ source, palette }: { source: Source; palette: Palette }) {
  const extra = SOURCE_EXTRAS[source.id];
  return (
    <Card palette={palette} gap={2}>
      <Text style={{ color: palette.ink, fontSize: 19, textAlign: 'right', marginBottom: 4 }}>{source.title.ar}</Text>
      {source.author && <Line label="المؤلف: " palette={palette}>{source.author.ar}</Line>}
      {source.edition && <Line label="الطبعة: " palette={palette}>{source.edition}</Line>}
      <Line label="المصدر: " palette={palette}><ExternalLink url={source.link.url} color={palette.accent} size={17}>{source.link.label}</ExternalLink></Line>
      <Line label="الترخيص: " palette={palette}>{source.licence.ar}</Line>
      <Line label="يُستعمل في: " palette={palette}>{source.uses.map(use => use.ar).join('، ')}</Line>
      {extra?.links?.map((row, i) => (
        <Text key={i} style={paragraph(palette)}>
          {row.map((link, j) => (
            <Text key={link.url}>{j > 0 && ' · '}<Text style={{ color: palette.muted }}>{link.prefix.ar}</Text><ExternalLink url={link.url} color={palette.accent} size={17}>{link.label.ar}</ExternalLink></Text>
          ))}
        </Text>
      ))}
      {extra?.notes.map(note => <Text key={note.ar} style={[paragraph(palette, true), { marginTop: 4 }]}>{note.ar}</Text>)}
    </Card>
  );
}

function Attributions({ palette }: { palette: Palette }) {
  return (
    <>
      <Text style={paragraph(palette)}>{ATTRIBUTIONS_INTRO.ar}</Text>
      {GROUPS.map(({ group, title }) => (
        <View key={group} style={{ gap: 12 }}>
          <Text accessibilityRole="header" style={heading(palette)}>{title.ar}</Text>
          {SOURCES.filter(source => source.group === group).map(source => <SourceCard key={source.id} source={source} palette={palette} />)}
        </View>
      ))}
    </>
  );
}

/** About, privacy and the sources with their licences, in the app and offline (owner, 2026-11-18); the settings sheet opens them. */
export default function InfoScreen({ page }: { page: InfoPage }) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const Body = page === 'about' ? About : page === 'privacy' ? Privacy : Attributions;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={() => (router.canGoBack() ? router.back() : toTab('/'))} title={INFO_TITLES[page]} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 12 }}>
        <Body palette={palette} />
      </ScrollView>
    </View>
  );
}

export const AboutScreen = () => <InfoScreen page="about" />;
export const PrivacyScreen = () => <InfoScreen page="privacy" />;
export const AttributionsScreen = () => <InfoScreen page="attributions" />;
