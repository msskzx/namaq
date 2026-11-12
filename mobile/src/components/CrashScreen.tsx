import { ScrollView, View } from 'react-native';
import { router, type ErrorBoundaryProps } from 'expo-router';
import { RotateCcw, House } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import Button from '@/components/Button';
import { usePalette } from '@/lib/theme';

/**
 * Shown in place of a screen that crashed, so the app never goes blank. Screens re-export it as `ErrorBoundary`
 * (expo-router's convention). The error text is shown and selectable, so it can be copied into a bug report.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const palette = usePalette();
  const details = (error.stack ?? error.message).split('\n').slice(0, 8).join('\n');
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.paper }}>
      <View style={{ flex: 1, padding: 20, gap: 16, direction: 'rtl' }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: palette.ink }}>حدث خطأ في هذه الصفحة</Text>
        <ScrollView style={{ flex: 1, borderWidth: 1, borderColor: palette.rule, borderRadius: 10 }} contentContainerStyle={{ padding: 12 }}>
          {/* Error text is code, read left to right. */}
          <Text selectable style={{ fontFamily: 'monospace', fontSize: 12, color: palette.muted, writingDirection: 'ltr', textAlign: 'left' }}>{details}</Text>
        </ScrollView>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label="أعد المحاولة" Icon={RotateCcw} variant="primary" grow onPress={retry} />
          <Button label="الرئيسية" Icon={House} grow onPress={() => { router.replace('/'); retry(); }} />
        </View>
      </View>
    </SafeAreaView>
  );
}
