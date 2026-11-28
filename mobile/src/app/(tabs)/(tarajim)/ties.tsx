import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/ties'));
export { ErrorBoundary } from '@/components/CrashScreen';
