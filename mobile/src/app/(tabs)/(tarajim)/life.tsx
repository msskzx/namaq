import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/life'));
export { ErrorBoundary } from '@/components/CrashScreen';
