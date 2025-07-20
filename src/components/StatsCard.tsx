import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useState, useEffect } from 'react';

function useCountUp(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    let frame: number;
    function animate() {
      start += increment;
      if (start < target) {
        setCount(Math.floor(start));
        frame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return count;
}

interface StatsCardProps {
  icon: IconDefinition;
  value: number;
  suffix: string;
  label: string;
  desc: string;
  dir?: 'rtl' | 'ltr';
}

export default function StatsCard({ icon, value, suffix, label, desc, dir = 'ltr' }: StatsCardProps) {
  const animatedValue = useCountUp(value, 1200);
  const textAlign = dir === 'rtl' ? 'text-start' : 'text-end';
  return (
    <div className={`flex flex-col bg-indigo-50 dark:bg-gray-900 border-l-4 border-amber-400 rounded-2xl p-6 shadow-lg text-indigo-900 dark:text-indigo-100 min-h-[170px]`} dir={dir}>
      <div className="flex flex-row items-center justify-between gap-4 mb-2">
        <div className="text-4xl text-amber-400">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="text-3xl sm:text-4xl font-bold text-amber-400">
          {animatedValue}{suffix}
        </div>
      </div>
      <div className={`font-arabic text-lg sm:text-xl mb-1 text-indigo-300 ${textAlign}`}>{label}</div>
      <div className={`text-sm sm:text-base text-gray-700 dark:text-indigo-100 ${textAlign}`}>{desc}</div>
    </div>
  );
} 