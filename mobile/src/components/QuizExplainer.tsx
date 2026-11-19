import { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import example from '@shared/data/quiz/example.json';
import type { Branch, Variant } from '@shared/quran/branches';
import { num } from '@shared/quran/arabicNumber';
import { askedNodes, branchNodes } from '@shared/quiz/branchAnswers';
import { MatrixInputs, type TreeQuestion } from './QuizTree';
import { type Palette } from '@/lib/theme';
import { surahNames } from '@/lib/branches';

// The إن المتقين في tree, built by the same builder as every quiz tree (shared/quiz/branchQuestions.test.ts keeps it equal).
const tree = example.tree as Branch;
const prefixes = example.prefixes as Variant[];

/**
 * How a متشابهات question works: what you type, the example question as the quiz draws it (the matrix, each ayah reading on
 * to its empty box), and how it is graded (the website's BranchExplainer).
 */
export default function QuizExplainer({ leaves, palette }: { leaves: number; palette: Palette }) {
  const question = useMemo((): TreeQuestion => ({ tree, prefixes, asked: askedNodes(tree, leaves, () => 0.5) }), [leaves]);
  const values = useMemo(() => branchNodes(tree).map((node, index) => question.asked!.includes(index) ? '' : node.words.join(' ')), [question]);
  const rule = (title: string, text: string) => (
    <Text style={{ color: palette.ink, fontSize: 15, lineHeight: 24, textAlign: 'right' }}><Text style={{ fontWeight: '700' }}>{title}</Text>{text}</Text>
  );
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 24, textAlign: 'right' }}>
        {`تكمل ${num(leaves)} من الآيات المتشابهة، ويُعرض باقيها مكتوبًا. فإن كانت أقل طُلبت كلها.`}
      </Text>
      <MatrixInputs question={question} values={values} hints={[]} palette={palette} names={surahNames} />
      {rule('التصحيح: ', 'تكفي من كل طرف كلمتاه الأوليان، ويجب أن تصح كل كلمة تكتبها وبترتيبها. اكتب بالإملاء المعتاد لا برسم المصحف، والهمزة على أي كرسي. لكل طرف صحيح نقطة، والأطراف المتشابهة في الشكل تقبل أي ترتيب.')}
      {rule('الكلمة الملوّنة: ', 'بعد التحقق، كلمة تكتبها الآيات بضبط مختلف، مثل «إِن» و«إِنْ»، تُرسم باللون الكهرماني كما في متشابهات القرآن. اضغط الآية لتراها في سياقها.')}
      {rule('الكلمة الأولى: ', 'إذا بدأت بعض الآيات بالواو أو الفاء جاءت كل صيغة في صفها.')}
    </View>
  );
}
