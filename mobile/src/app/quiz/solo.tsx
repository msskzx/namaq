import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/quiz/solo'));
export { ErrorBoundary } from '@/components/CrashScreen';
