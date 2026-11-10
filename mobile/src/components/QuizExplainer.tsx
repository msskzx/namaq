import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import example from '@shared/data/quiz/example.json';
import type { Branch } from '@shared/quran/branches';
import { num } from '@shared/quran/arabicNumber';
import { quranText } from '@/lib/quranText';
import { askedNodes, LEAF_WORDS } from '@shared/quiz/branchAnswers';
import BranchTree, { type RenderNode } from './BranchTree';
import { QURAN_FONT, type Palette } from '@/lib/theme';

const tree = example.tree as Branch;

/** How a tree question works: what you type, an example tree with the asked leaves empty, and how it is graded (the website's BranchExplainer). */
export default function QuizExplainer({ leaves, palette }: { leaves: number; palette: Palette }) {
  const asked = useMemo(() => askedNodes(tree, leaves, () => 0.5), [leaves]);
  const presentation = useMemo(() => ({ tree, prefixes: [], offsets: {}, ayat: [] }), []);
  const renderNode: RenderNode = (node, index) => {
    if (node.children.length > 0) return undefined;
    const shown = node.words.slice(0, LEAF_WORDS + 1);
    if (asked.includes(index)) return <View accessibilityLabel="تكتبه أنت" style={{ width: 96, height: 30, borderWidth: 1, borderStyle: 'dashed', borderColor: palette.accent, borderRadius: 4 }} />;
    return <Text style={{ fontFamily: QURAN_FONT, fontSize: 17, lineHeight: 32, color: palette.muted }}>{quranText(shown.join(' '))}{shown.length < node.words.length ? ' …' : ''}</Text>;
  };
  const rule = (title: string, text: string) => (
    <Text style={{ color: palette.ink, fontSize: 15, lineHeight: 24, textAlign: 'right' }}><Text style={{ fontWeight: '700' }}>{title}</Text>{text}</Text>
  );
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 24, textAlign: 'right' }}>
        {`تكتب ${num(leaves)} من أطراف الشجرة، ويُعرض باقيها مكتوبًا. الشجرة التي أطرافها أقل تُطلب كل أطرافها.`}
      </Text>
      <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <BranchTree presentation={presentation} matches={{}} names={{}} palette={palette} onTap={() => {}} renderNode={renderNode} />
      </ScrollView>
      {rule('التصحيح: ', 'تكفي من كل طرف كلمتاه الأوليان، ويجب أن تصح كل كلمة تكتبها وبترتيبها. اكتب بالإملاء المعتاد لا برسم المصحف، والهمزة على أي كرسي. لكل طرف صحيح نقطة، والأطراف المتشابهة في الشكل تقبل أي ترتيب.')}
    </View>
  );
}
