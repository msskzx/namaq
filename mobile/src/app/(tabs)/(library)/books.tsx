import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/books'));
export { ErrorBoundary } from '@/components/CrashScreen';
