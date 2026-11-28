import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/utilities'));
export { ErrorBoundary } from '@/components/CrashScreen';
