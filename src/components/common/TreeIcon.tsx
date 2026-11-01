import { GitFork, type LucideProps } from 'lucide-react';

/** GitFork stands root-down; turned a quarter counterclockwise it grows like the Arabic trees: one root on the right, two branches to the left. */
export default function TreeIcon({ className = '', ...props }: LucideProps) {
  return <GitFork className={`-rotate-90 ${className}`} {...props} />;
}
