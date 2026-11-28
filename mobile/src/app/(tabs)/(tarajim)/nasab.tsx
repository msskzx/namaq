import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/nasab'));
export { ErrorBoundary } from '@/components/CrashScreen';
