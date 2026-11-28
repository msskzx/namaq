import { router, useLocalSearchParams } from 'expo-router';
import ProphetStory from '@/components/ProphetStory';
import { toTab } from '@/lib/ways';
import TopBar from '@/ui/TopBar';

export default function ProphetScreen() {
  const { slug = '', event, surah } = useLocalSearchParams<{ slug?: string; event?: string; surah?: string }>();
  const back = (help: () => void) => <TopBar back={() => (router.canGoBack() ? router.back() : toTab('/prophets'))} help={help} />;
  return <ProphetStory slug={slug} header={back} startEvent={event !== undefined && /^\d+$/.test(event) ? Number(event) : undefined}
    startSurah={surah !== undefined && /^\d+$/.test(surah) ? Number(surah) : undefined} />;
}

