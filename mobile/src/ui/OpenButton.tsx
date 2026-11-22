import { ArrowLeft } from 'lucide-react-native';
import Button from '@/ui/Button';

/**
 * A home card's one open button (owner, 2026-11-22; sketch home-open-button/open-label-dark.png, option 2): «افتح» and the
 * forward arrow, the same on every card, first in its row. It opens the card's item on its page; `label` says where for a
 * screen reader. A long card with no page opens whole in a sheet with it (ui/Card `cap`).
 */
export default function OpenButton({ label, onPress }: { label: string; onPress: () => void; palette?: unknown }) {
  return <Button pill label="افتح" Icon={ArrowLeft} iconAfter accessibilityLabel={label} onPress={onPress} />;
}
