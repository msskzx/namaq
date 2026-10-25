import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--home-paper)]">
      <LoadingSpinner fill />
    </div>
  );
}
