import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/stories'));
export { ErrorBoundary } from '@/components/CrashScreen';
