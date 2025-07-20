import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface FactCardProps {
  icon: IconDefinition;
  text: string;
  dir?: 'rtl' | 'ltr';
}

export default function FactCard({ icon, text, dir }: FactCardProps) {
  return (
    <div className="flex flex-row items-center bg-gray-900 border-l-4 border-amber-400 rounded-2xl p-6 shadow-lg text-indigo-100 min-h-[110px] w-full max-w-md">
      <div className="text-3xl text-amber-400 ml-6 flex-shrink-0">
        <FontAwesomeIcon icon={icon} />
      </div>
      <span className="font-arabic text-lg sm:text-xl" dir={dir}>
        {text}
      </span>
    </div>
  );
}