import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/quizzes'));
export { ErrorBoundary } from '@/components/CrashScreen';
