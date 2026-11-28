import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/library'));
export { ErrorBoundary } from '@/components/CrashScreen';
