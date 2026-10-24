import { CircleAlert } from 'lucide-react';

interface ErrorMessageProps {
  title: string;
  description?: string;
}

export default function ErrorMessage({ title, description }: ErrorMessageProps) {
  return (
    <div role="alert" className="text-center py-12 text-[var(--home-ink)]">
      <CircleAlert aria-hidden className="mx-auto size-8 text-[var(--home-accent)]" />
      <h3 className="mt-2 text-lg font-medium">{title}</h3>
      {description && <p className="mt-1 text-sm text-[var(--home-muted)]">{description}</p>}
    </div>
  );
}
