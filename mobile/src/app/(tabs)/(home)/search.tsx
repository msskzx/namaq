import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/search'));
export { ErrorBoundary } from '@/components/CrashScreen';
