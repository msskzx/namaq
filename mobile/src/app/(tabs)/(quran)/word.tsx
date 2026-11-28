import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/word'));
export { ErrorBoundary } from '@/components/CrashScreen';
