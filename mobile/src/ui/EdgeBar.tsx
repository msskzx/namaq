import { View } from 'react-native';

export default function EdgeBar({ tone, width = 3, gap = 2, children }: { tone: string; width?: number; gap?: number; children: React.ReactNode }) {
  return <View style={{ borderRightWidth: width, borderColor: tone, paddingRight: 12, gap }}>{children}</View>;
}
