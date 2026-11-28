import { useRef, useState, type ComponentRef } from 'react';
import { View } from 'react-native';
import { Ellipsis, type LucideProps } from 'lucide-react-native';
import IconButton from '@/ui/IconButton';
import ActButton from '@/ui/ActButton';
import FloatingMenu, { type MenuAt } from '@/ui/FloatingMenu';
import { usePalette } from '@/lib/theme';

export type MoreItem = { Icon: (props: LucideProps) => React.ReactNode; name: string; label: string; onPress: () => void };

export default function MoreMenu({ items, label = 'خيارات البطاقة' }: { items: MoreItem[]; label?: string }) {
  const palette = usePalette();
  const box = useRef<ComponentRef<typeof View>>(null);
  const [at, setAt] = useState<MenuAt | null>(null);
  if (!items.length) return null;
  const open = () => box.current?.measureInWindow((x, y, width, height) => setAt({ x: x + width / 2, y: y + height / 2 }));
  const close = () => setAt(null);
  return (
    <>
      <View ref={box} collapsable={false}><IconButton Icon={Ellipsis} label={label} onPress={open} expanded={!!at} /></View>
      <FloatingMenu overlay at={at} label={label} onClose={close} palette={palette}>
        {items.map(item => <ActButton key={item.name} wide Icon={item.Icon} name={item.name} label={item.label} palette={palette} onPress={() => { close(); item.onPress(); }} />)}
      </FloatingMenu>
    </>
  );
}
