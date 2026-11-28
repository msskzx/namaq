import { ArrowLeft } from 'lucide-react-native';
import Button from '@/ui/Button';

export default function OpenButton({ label, what, onPress }: { label: string; what?: string; onPress: () => void; palette?: unknown }) {
  return <Button pill label={what ? `افتح ${what}` : 'افتح'} Icon={ArrowLeft} accessibilityLabel={label} onPress={onPress} />;
}
