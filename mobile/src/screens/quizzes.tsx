import { useRef, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/ui/Text';
import { router, type Href } from 'expo-router';
import { MessageSquare, MessagesSquare, type LucideProps } from 'lucide-react-native';
import TopBar from '@/ui/TopBar';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import Card from '@/ui/Card';

// The website's /quizzes mode cards (src/app/quizzes/page.tsx QuizModes): solo and party only, every kind of question is
// chosen inside them (owner, 2026-11-17).
const MODES: { href: Href; Icon: (props: LucideProps) => React.ReactNode; title: string; text: string}[] = [
  { href: '/quiz/solo', Icon: MessageSquare, title: 'اختبار فردي', text: 'أجب عن أسئلة في آيات القرآن، ثم راجع الإجابة والآيات المرتبطة بها.' },
  { href: '/quiz/party', Icon: MessagesSquare, title: 'اختبار جماعي', text: 'ابدأ اختبارًا جماعيًا وشارك رقمه، أو انضم إلى غيرك من هاتفك.' },
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
          <Card key={title} onPress={() => router.push(href)} accessibilityRole="link" palette={palette} pad={18} gap={8}>
            <Icon size={44} color={palette.accent} strokeWidth={1.5} />
            <Text style={{ color: palette.ink, fontSize: 20, fontWeight: '700', textAlign: 'right' }}>{title}</Text>
            <Text style={{ color: palette.muted, fontSize: 16, lineHeight: 24, textAlign: 'right' }}>{text}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

