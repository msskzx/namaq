import ProphetStory from '@/components/ProphetStory';
import TopBar from '@/components/TopBar';

/** The prophets tab: Musa's timeline, the only story so far. */
export default function ProphetsTab() {
  return <ProphetStory slug="musa" header={<TopBar hideOnScroll />} inTab />;
}
