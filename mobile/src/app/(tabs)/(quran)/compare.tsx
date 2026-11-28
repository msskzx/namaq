import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/compare'));
export { ErrorBoundary } from '@/components/CrashScreen';
