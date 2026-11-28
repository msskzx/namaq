import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/quiz/party/code'));
export { ErrorBoundary } from '@/components/CrashScreen';
