import React, { useRef } from 'react';
import translations from '@/components/language/translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import type { Title } from '@/generated/prisma';

interface PeopleSearchProps {
  titles: Title[];
  selectedTitle: string;
  onTitleChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  language: 'en' | 'ar';
}

export default function PeopleSearch({
  titles,
  selectedTitle,
  onTitleChange,
  search,
  onSearchChange,
  language,
}: PeopleSearchProps) {
  const isArabic = language === 'ar';
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState(search);

  React.useEffect(() => {
    setInputValue(search);
  }, [search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    onSearchChange(inputValue);
  };

  return (
    <form
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 items-stretch sm:items-end w-full"
      onSubmit={handleSearch}
    >
      <div className="w-full sm:w-auto">
        <select
          className="border border-amber-400 rounded px-3 h-10 text-base w-full min-w-[140px] bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-amber-400 focus:border-amber-400 focus:ring-amber-400 focus-visible:outline-amber-400 dark:focus-visible:outline-amber-400"
          value={selectedTitle}
          onChange={e => onTitleChange(e.target.value)}
        >
          <option value="" className="text-gray-800 dark:text-gray-950">{isArabic ? 'الكل' : 'All'}</option>
          {titles.map((title) => (
            <option key={title.id} value={title.slug} className="text-gray-800 dark:text-gray-950">
              {isArabic ? title.name : title.nameTransliterated}
            </option>
          ))}
        </select>
      </div>
      {/* Input and button: stacked on mobile, inline on sm+ */}
      <div className="flex flex-col sm:flex-row w-full sm:flex-1 gap-3 sm:gap-2">
        <input
          ref={inputRef}
          type="text"
          className="border border-amber-400 rounded px-3 h-10 text-base w-full bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-amber-400 focus:border-amber-400 focus:ring-amber-400 dark:focus:border-amber-400 dark:focus:ring-amber-400 placeholder:text-gray-500 dark:placeholder-amber-200 focus-visible:outline-amber-400 dark:focus-visible:outline-amber-400"
          placeholder={translations[language]?.search}
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-amber-400 hover:bg-amber-300 text-gray-950 rounded flex items-center justify-center h-10 w-full sm:w-10 border border-amber-400 transition-colors"
          aria-label={translations[language]?.search}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </form>
  );
}