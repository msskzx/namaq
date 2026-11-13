import { useRef, type ComponentRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { router, type Href } from 'expo-router';
import { EyeOff, User, Users, type LucideProps } from 'lucide-react-native';
import TopBar from '@/components/TopBar';
import { usePalette, CARD } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/components/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';

// The website's /quizzes mode cards (src/app/quizzes/page.tsx QuizModes).
const MODES: { href: Href; Icon: (props: LucideProps) => React.ReactNode; title: string; text: string }[] = [
  { href: '/quiz/solo', Icon: User, title: 'اختبار فردي', text: 'أجب عن أسئلة في آيات القرآن، ثم راجع الإجابة والآيات المرتبطة بها.' },
  { href: '/quiz/party', Icon: Users, title: 'اختبار جماعي', text: 'ابدأ اختبارًا جماعيًا وشارك رقمه، أو انضم إلى غيرك من هاتفك.' },
  { href: '/read', Icon: EyeOff, title: 'تسميع', text: 'تُخفى الآيات في المصحف، وتُظهرها واحدة واحدة وأنت تسمّع، وتعلّم ما نسيته لتراجعه.' },
];

export default function QuizzesScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  // The quizzes tab tapped again: back to the top.
  useTabRetap('quizzes', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        {MODES.map(({ href, Icon, title, text }) => (
          <Pressable key={title} onPress={() => router.push(href)} accessibilityRole="link"
            style={({ pressed }) => ({ backgroundColor: pressed ? palette.paperDeep : palette.card, borderWidth: 1, borderColor: palette.rule, ...CARD, padding: 18, gap: 8, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
            <Icon size={44} color={palette.accent} strokeWidth={1.5} />
            <Text style={{ color: palette.ink, fontSize: 20, fontWeight: '700', textAlign: 'right' }}>{title}</Text>
            <Text style={{ color: palette.muted, fontSize: 16, lineHeight: 24, textAlign: 'right' }}>{text}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
