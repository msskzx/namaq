import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface ScopeOption<T extends string> {
  value: T;
  label: string;
  icon: IconDefinition;
}

interface ScopeToggleProps<T extends string> {
  value: T;
  options: readonly [ScopeOption<T>, ScopeOption<T>];
  onChange: (value: T) => void;
  ariaLabel: string;
}

/**
 * A two-option slider in the shape of the theme and language switchers: both
 * choices stay readable and a pill slides to whichever is in force. One button
 * flips it, so `ariaLabel` says what a press does rather than naming the state.
 *
 * Two grid columns keep the halves equal and sized to the longer label, and the
 * pill is placed with logical properties, since the options swap sides under
 * Arabic while a fixed left offset would not.
 */
export default function ScopeToggle<T extends string>({ value, options, onChange, ariaLabel }: ScopeToggleProps<T>) {
  const [first, second] = options;
  const atSecond = value === second.value;

  return (
    <button
      type="button"
      onClick={() => onChange(atSecond ? first.value : second.value)}
      aria-label={ariaLabel}
      className="relative grid min-h-11 grid-cols-2 items-center overflow-hidden rounded-full border border-amber-400 bg-gray-100 text-xs font-medium sm:min-h-0 dark:bg-gray-700"
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 start-0 w-1/2 bg-amber-400 transition-transform duration-200 ${atSecond ? 'ltr:translate-x-full rtl:-translate-x-full' : ''}`}
      />
      {options.map(option => (
        <span
          key={option.value}
          className={`z-10 flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 transition-colors ${
            value === option.value ? 'text-gray-950' : 'text-gray-600 dark:text-gray-200'
          }`}
        >
          <FontAwesomeIcon icon={option.icon} />
          {option.label}
        </span>
      ))}
    </button>
  );
}
