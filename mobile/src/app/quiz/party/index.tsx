import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/quiz/party/index'));
export { ErrorBoundary } from '@/components/CrashScreen';
