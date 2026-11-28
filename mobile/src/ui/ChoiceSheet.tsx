import { useState } from 'react';
import { View } from 'react-native';
import type { LucideProps } from 'lucide-react-native';
import { usePalette } from '@/lib/theme';
import { Text } from '@/ui/Text';
import IconButton from '@/ui/IconButton';
import Button, { Row } from '@/ui/Button';
import Sheet from '@/ui/Sheet';

type Icon = (props: LucideProps) => React.ReactNode;
export type Choice = { key: string; label: string; Icon: Icon; accessibilityLabel?: string; onPress: () => void };

export default function ChoiceSheet({ Icon, title, choices }: { Icon: Icon; title: string; choices: Choice[] }) {
  const palette = usePalette();
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton Icon={Icon} label={title} onPress={() => setOpen(true)} expanded={open} />
      <Sheet open={open} onClose={() => setOpen(false)} palette={palette}>
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 10 }}>
          <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16 }}>{title}</Text>
          <Row>{choices.map(choice => <Button key={choice.key} grow Icon={choice.Icon} label={choice.label} accessibilityLabel={choice.accessibilityLabel}
            onPress={() => { setOpen(false); choice.onPress(); }} />)}</Row>
        </View>
      </Sheet>
    </>
  );
}
