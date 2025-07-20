import React from 'react';
import Link from 'next/link';

interface MotivationCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  url: string;
  color?: string;
  borderColor?: string;
}

const MotivationCard: React.FC<MotivationCardProps> = ({ icon, title, desc, url, color = "text-amber-400", borderColor = "border-amber-400" }) => {
  return (
    <Link href={url} className="block">
              <div className={`relative group bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center border ${borderColor} transition-transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer min-h-[140px]`}>
        <div className="mb-3 text-4xl">{icon}</div>
        <div className={`font-bold text-lg ${color} text-center`}>{title}</div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 dark:bg-gray-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 z-10">
          <span className="text-indigo-950 dark:text-gray-200 text-center text-base">{desc}</span>
        </div>
      </div>
    </Link>
  );
};

export default MotivationCard; 