import React, { useRef } from 'react';
import translations from './translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface Title {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
}

interface PeopleFilterProps {
  titles: Title[];
  selectedTitle: string;
  onTitleChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  language: 'en' | 'ar';
}

const PeopleFilter: React.FC<PeopleFilterProps> = ({
  titles,
  selectedTitle,
  onTitleChange,
  search,
  onSearchChange,
  language,
}) => {
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
          className="border rounded px-3 h-10 text-base w-full min-w-[140px]"
          value={selectedTitle}
          onChange={e => onTitleChange(e.target.value)}
        >
          <option value="">{isArabic ? 'الكل' : 'All'}</option>
          {titles.map((title) => (
            <option key={title.id} value={title.slug}>
              {isArabic ? title.nameAr : title.name}
            </option>
          ))}
        </select>
      </div>
      {/* Input and button: stacked on mobile, inline on sm+ */}
      <div className="flex flex-col sm:flex-row w-full sm:flex-1 gap-3 sm:gap-2">
        <input
          ref={inputRef}
          type="text"
          className="border rounded px-3 h-10 text-base w-full"
          placeholder={translations[language]?.search}
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center justify-center h-10 w-full sm:w-10"
          aria-label={translations[language]?.search}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </form>
  );
};

export default PeopleFilter; 