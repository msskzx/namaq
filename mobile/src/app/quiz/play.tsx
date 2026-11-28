import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/quiz/play'));
export { ErrorBoundary } from '@/components/CrashScreen';
