import type { ReactNode } from 'react';

interface ToggleProps {
  checked: boolean;
  label: string;
  disabled?: boolean;
  describedBy?: string;
  id?: string;
  onChange(checked: boolean): void;
  onIcon?: ReactNode;
  offIcon?: ReactNode;
}

export default function Toggle({ checked, label, disabled = false, describedBy, id, onChange, onIcon, offIcon }: ToggleProps) {
  const hasIcons = onIcon !== undefined || offIcon !== undefined;
  return (
    <label className={`relative inline-block shrink-0 ${hasIcons ? 'h-7 w-[52px]' : 'h-5 w-9'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input id={id} className="peer sr-only" type="checkbox" role="switch" checked={checked} aria-label={label} aria-describedby={describedBy} disabled={disabled} onChange={(event) => onChange(event.currentTarget.checked)} />
      <span className="absolute inset-0 rounded-full border border-gray-300 bg-white transition-colors peer-checked:bg-amber-100 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:peer-checked:bg-amber-900/60" aria-hidden="true" />
      <span className={`absolute start-0.5 top-1/2 -translate-y-1/2 rounded-full bg-white shadow transition-[background-color,transform] peer-checked:translate-x-full rtl:peer-checked:-translate-x-full peer-checked:bg-amber-500 peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500 peer-focus-visible:ring-offset-1 dark:bg-gray-300 dark:peer-checked:bg-amber-500 dark:peer-focus-visible:ring-offset-gray-900 ${hasIcons ? 'size-6' : 'size-4'}`} aria-hidden="true" />
      {offIcon && <span className="absolute start-1 top-1/2 z-10 grid size-5 -translate-y-1/2 place-items-center text-black transition-[color,opacity] peer-checked:text-gray-500 peer-checked:opacity-70 dark:peer-checked:text-gray-400" aria-hidden="true">{offIcon}</span>}
      {onIcon && <span className="absolute end-1 top-1/2 z-10 grid size-5 -translate-y-1/2 place-items-center text-gray-500 opacity-90 transition-[color,opacity] peer-checked:text-white peer-checked:opacity-100 dark:text-gray-400 dark:peer-checked:text-white" aria-hidden="true">{onIcon}</span>}
    </label>
  );
}
