'use client';

import { useOptimistic, useTransition } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Type, Layers3 } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';
import Toggle from '@/components/common/Toggle';

type Props = { on: boolean; offHref: string; onHref: string; offLabel?: string; onLabel?: string; label?: string; offIcon?: ReactNode; onIcon?: ReactNode };

export default function CompareModeToggle({
  on, offHref, onHref, offLabel, onLabel, label,
  offIcon = <Type size={14} aria-hidden />, onIcon = <Layers3 size={14} aria-hidden />,
}: Props) {
  const ar = useLanguage().language === 'ar';
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [shown, setShown] = useOptimistic(on);
  const style = (active: boolean) => (active ? 'font-semibold text-[var(--home-accent)]' : 'text-[var(--home-muted)]');
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className="flex items-center gap-2 text-sm">
      <span className={style(!shown)}>{offLabel ?? (ar ? 'النص' : 'Text')}</span>
      <Toggle
        label={label ?? (ar ? 'المقارنة بالمواضيع' : 'Compare by topic')}
        checked={shown}
        onChange={(checked) =>
          startTransition(() => {
            setShown(checked);
            router.push(checked ? onHref : offHref);
          })
        }
        offIcon={offIcon}
        onIcon={onIcon}
      />
      <span className={style(shown)}>{onLabel ?? (ar ? 'المواضيع' : 'Topics')}</span>
    </div>
  );
}
