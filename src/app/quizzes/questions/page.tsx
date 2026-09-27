import type { Metadata } from 'next';
import QuestionBankReview from './QuestionBankReview';

export const metadata: Metadata = { title: 'Quiz question bank', robots: { index: false, follow: false } };

export default function QuizQuestionsPage() {
  return <QuestionBankReview />;
}
