import { useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { GalleryHorizontal } from 'lucide-react-native';
import example from '@shared/data/quiz/example.json';
import type { Branch, Variant } from '@shared/quran/branches';
import { num } from '@shared/quran/arabicNumber';
import { askedNodes, branchNodes } from '@shared/quiz/branchAnswers';
import BranchTree, { type RenderNode } from './BranchTree';
import Button, { Row } from './Button';
import TreeIcon from './TreeIcon';
import { askedBox, MatrixInputs, type TreeQuestion } from './QuizTree';
import { type Palette } from '@/lib/theme';
import { branchView } from '@/lib/settings';
import { surahNames } from '@/lib/branches';

// The إن المتقين في tree, built by the same builder as every quiz tree (shared/quiz/branchQuestions.test.ts keeps it equal).
const tree = example.tree as Branch;
const prefixes = example.prefixes as Variant[];
const presentation = { tree, prefixes, offsets: {}, ayat: [] };
const NO_TYPING = () => {};

/**
 * How a tree question works: what you type, the example question as the quiz draws it (as a tree, or as the matrix where each
 * ayah reads on to its empty box), and how it is graded (the website's BranchExplainer).
 */
export default function QuizExplainer({ leaves, palette }: { leaves: number; palette: Palette }) {
  const [matrix, setMatrix] = useState(() => branchView.get() === 'matrix');
  // The root is on the right: a tree wider than the card opens scrolled to its right end, as in the quiz.
  const sideways = useRef<{ scrollToEnd: (options?: { animated?: boolean }) => void } | null>(null);
  const question = useMemo((): TreeQuestion => ({ tree, prefixes, asked: askedNodes(tree, leaves, () => 0.5) }), [leaves]);
  const values = useMemo(() => branchNodes(tree).map((node, index) => question.asked!.includes(index) ? '' : node.words.join(' ')), [question]);
  // The quiz's own asked box, empty and dashed here; every other box is drawn by BranchTree as in the quiz.
  const renderNode: RenderNode = (node, index) => question.asked!.includes(index)
    ? askedBox(node, <View accessibilityLabel="تكتبه أنت" style={{ width: 96, height: 30, borderWidth: 1, borderStyle: 'dashed', borderColor: palette.accent, borderRadius: 4 }} />, palette)
    : undefined;
  const rule = (title: string, text: string) => (
    <Text style={{ color: palette.ink, fontSize: 15, lineHeight: 24, textAlign: 'right' }}><Text style={{ fontWeight: '700' }}>{title}</Text>{text}</Text>
  );
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 24, textAlign: 'right' }}>
        {`تكتب ${num(leaves)} من أطراف الشجرة، ويُعرض باقيها مكتوبًا. الشجرة التي أطرافها أقل تُطلب كل أطرافها.`}
      </Text>
      <Row>
        <Button label="شجرة" Icon={TreeIcon} active={!matrix} onPress={() => setMatrix(false)} />
        <Button label="مصفوفة" Icon={GalleryHorizontal} active={matrix} onPress={() => setMatrix(true)} />
      </Row>
      {matrix
        ? <MatrixInputs question={question} values={values} hints={[]} onType={NO_TYPING} palette={palette} names={surahNames} readOnly />
        : <ScrollView ref={sideways as never} horizontal style={{ direction: 'ltr' }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} onContentSizeChange={() => sideways.current?.scrollToEnd({ animated: false })}>
          <BranchTree presentation={presentation} matches={{}} names={surahNames} palette={palette} onTap={() => {}} renderNode={renderNode} />
        </ScrollView>}
      {rule('التصحيح: ', 'تكفي من كل طرف كلمتاه الأوليان، ويجب أن تصح كل كلمة تكتبها وبترتيبها. اكتب بالإملاء المعتاد لا برسم المصحف، والهمزة على أي كرسي. لكل طرف صحيح نقطة، والأطراف المتشابهة في الشكل تقبل أي ترتيب.')}
      {rule('الكلمة الملوّنة: ', 'بعد التحقق، كلمة تكتبها الآيات بضبط مختلف، مثل «إِن» و«إِنْ»، تُرسم باللون الكهرماني كما في متشابهات القرآن. اضغط العقدة لترى كل آية في سياقها.')}
      {rule('الكلمة الأولى: ', 'إذا بدأت بعض الآيات بالواو أو الفاء رُسمت كل صيغة وحدها قبل الشجرة.')}
    </View>
  );
}
