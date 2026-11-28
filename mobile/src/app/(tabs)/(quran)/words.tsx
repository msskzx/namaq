import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/words'));
export { ErrorBoundary } from '@/components/CrashScreen';
