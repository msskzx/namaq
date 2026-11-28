import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/book'));
export { ErrorBoundary } from '@/components/CrashScreen';
