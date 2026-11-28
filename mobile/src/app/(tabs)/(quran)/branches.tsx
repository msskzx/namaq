import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/branches'));
export { ErrorBoundary } from '@/components/CrashScreen';
