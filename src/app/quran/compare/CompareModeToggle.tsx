'use client';

import { useOptimistic, useTransition } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { faFont, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toggle from '@/components/common/Toggle';

type Props = { on: boolean; offHref: string; onHref: string; offLabel?: string; onLabel?: string; label?: string; offIcon?: ReactNode; onIcon?: ReactNode };

export default function CompareModeToggle({
  on, offHref, onHref, offLabel = 'النص', onLabel = 'المواضيع', label = 'المقارنة بالمواضيع',
  offIcon = <FontAwesomeIcon icon={faFont} className="size-3" />, onIcon = <FontAwesomeIcon icon={faLayerGroup} className="size-3" />,
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [shown, setShown] = useOptimistic(on);
  const style = (active: boolean) => (active ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400');
  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 pt-4 flex items-center gap-2 text-sm">
      <span className={style(!shown)}>{offLabel}</span>
      <Toggle
        label={label}
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
      <span className={style(shown)}>{onLabel}</span>
    </div>
  );
}
