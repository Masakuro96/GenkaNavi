import React from 'react';
import { Link } from 'react-router-dom';
import { standardsData } from '../data/standards';
import { Standard } from '../types';
import { useUserData } from '../contexts/UserDataContext'; // Import useUserData
import { StarIcon as FilledStarIcon } from './icons/StarIcon'; // Alias to avoid conflict if another StarIcon is used
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { QuickNavDropdown } from './QuickNavDropdown'; // Added import

const ImportanceBadge: React.FC<{ importance: Standard['importance'] }> = ({ importance }) => {
  let bgColor = 'bg-slate-200 text-slate-700';
  let text = `重要度 ${importance}`;
  if (importance === 'A') {
    bgColor = 'bg-amber-500 text-white';
    text = '最重要';
  } else if (importance === 'B') {
    bgColor = 'bg-sky-500 text-white';
    text = '重要';
  }
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${bgColor} flex items-center space-x-1`}>
      {importance === 'A' && <FilledStarIcon className="w-3 h-3" />}
      <span>{text}</span>
    </span>
  );
};


export const StandardsListPage: React.FC = () => {
  const { bookmarkedStandardIds } = useUserData();

  const groupedStandards = standardsData.reduce((acc, standard) => {
    const category = standard.category || '未分類';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(standard);
    return acc;
  }, {} as Record<string, Standard[]>);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">原価計算基準一覧</h1>
        <p className="text-gray-600 text-lg">各基準をクリックして詳細を学習しましょう。</p>
      </header>

      <div className="mb-6 md:mb-8">
        <QuickNavDropdown />
      </div>

      {Object.entries(groupedStandards).map(([category, standardsInCategory]) => (
        <section key={category} className="mb-10">
          <h2 className="text-2xl font-semibold text-sky-700 border-b-2 border-sky-200 pb-2 mb-6">
            {category}
          </h2>
          <div className="space-y-4">
            {standardsInCategory.map((standard) => {
              const isBookmarked = bookmarkedStandardIds.includes(standard.id);
              return (
                <Link
                  key={standard.id}
                  to={`/standards/${standard.id}`}
                  className={`block bg-white shadow-lg rounded-xl p-5 md:p-6 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 ease-in-out ${
                    standard.importance === 'A' ? 'border-l-4 border-amber-500' : 'border-l-4 border-sky-500'
                  }`}
                  aria-label={`${standard.title}${isBookmarked ? ' (ブックマーク済み)' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
                        {standard.title}
                        {isBookmarked && (
                          <FilledStarIcon className="w-4 h-4 text-yellow-400 ml-2 flex-shrink-0" aria-hidden="true" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {standard.content.substring(0, 100)}...
                      </p>
                    </div>
                    <ChevronRightIcon className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4 self-center"/>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 flex items-center">
                     <ImportanceBadge importance={standard.importance} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};