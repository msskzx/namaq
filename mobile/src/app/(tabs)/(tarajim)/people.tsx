import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/people'));
export { ErrorBoundary } from '@/components/CrashScreen';
