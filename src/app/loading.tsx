import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <LoadingSpinner fill />
    </div>
  );
}
