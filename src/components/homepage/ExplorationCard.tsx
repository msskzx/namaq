import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ExplorationCardProps {
  title: string;
  desc: string;
  url: string;
  img: string;
}

export default function ExplorationCard({ title, desc, url, img }: ExplorationCardProps) {
  return (
    <Link
      href={url}
      className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative aspect-square"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
        <h3 className="text-xl font-bold mb-3 group-hover:text-amber-300 transition-colors">
          {title}
        </h3>
        <p className="text-gray-200 text-sm leading-relaxed mb-4 opacity-90">
          {desc}
        </p>

      </div>
    </Link>
  );
}