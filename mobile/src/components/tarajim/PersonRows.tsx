import { View } from 'react-native';
import { router } from 'expo-router';
import type { AppPerson } from '@shared/tarajim';
import { Text } from '@/ui/Text';
import Card from '@/ui/Card';
import TapRow from '@/ui/TapRow';
import type { Palette } from '@/lib/theme';
import { personLine, personName } from '@/lib/tarajim';

/**
 * People as rows in one card (owner, 2026-11-19; sketch tarajim-hub/sketch-dark.png): the name, and the kunya or laqab on
 * the left in muted text; a row opens the person's page. One card for the list, never a card for each person.
 * `line` replaces the muted line, for a group whose title would repeat on every row.
 */
export default function PersonRows({ people, palette, line = personLine }: { people: AppPerson[]; palette: Palette; line?: (person: AppPerson) => string }) {
  return (
    <Card palette={palette} pad={[0, 14]}>
      {people.map((person, i) => {
        const muted = line(person);
        return (
          <TapRow key={person.slug} role="link" label={personName(person)} onPress={() => router.push({ pathname: '/person', params: { slug: person.slug } })}
            style={{ alignItems: 'center', gap: 8, minHeight: 50, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: palette.glassEdge }}>
            <Text style={{ flex: 1, color: palette.ink, fontSize: 18, textAlign: 'right' }}>{personName(person)}</Text>
            {muted ? <View style={{ flexShrink: 1, maxWidth: '50%' }}><Text style={{ color: palette.muted, fontSize: 14, textAlign: 'left' }}>{muted}</Text></View> : null}
          </TapRow>
        );
      })}
    </Card>
  );
}
