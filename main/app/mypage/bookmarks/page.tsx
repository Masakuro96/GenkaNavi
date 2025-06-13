import React from 'react';
import { Link } from 'react-router-dom';
import { useUserData } from '../../../contexts/UserDataContext';
import { standardsData } from '../../../data/standards';
import { StarIcon as FilledStarIcon } from '../../../components/icons/StarIcon';
import { ArrowLeftIcon } from '../../../components/icons/ArrowLeftIcon';
import { ChevronRightIcon } from '../../../components/icons/ChevronRightIcon';
import { Standard } from '../../../types';

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

const BookmarksPage: React.FC = () => {
  const { bookmarkedStandardIds } = useUserData();
  const bookmarkedStandards = standardsData.filter(standard =>
    bookmarkedStandardIds.includes(standard.id)
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 md:mb-10">
        <Link 
            to="/mypage" 
            className="text-sky-600 hover:text-sky-800 flex items-center transition-colors group mb-4 text-sm"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            <span>マイページへ戻る</span>
        </Link>
        <div className="flex items-center space-x-3">
          <FilledStarIcon className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">ブックマークした基準</h1>
        </div>
        <p className="text-gray-600 text-lg mt-2">お気に入りに登録した基準の一覧です。</p>
      </header>

      {bookmarkedStandards.length > 0 ? (
        <div className="space-y-4">
          {bookmarkedStandards.map(standard => (
            <Link
              key={standard.id}
              to={`/standards/${standard.id}`}
              className="block bg-white shadow-lg rounded-xl p-5 md:p-6 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 ease-in-out border-l-4 border-yellow-500"
              aria-label={`${standard.title}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
                    {standard.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {standard.content.substring(0, 120)}...
                  </p>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4 self-center"/>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center">
                 <ImportanceBadge importance={standard.importance} />
                 {standard.category && <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{standard.category}</span>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <FilledStarIcon className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
          <p className="text-xl text-gray-700 font-semibold mb-2">ブックマークした基準はありません</p>
          <p className="text-gray-500">基準詳細ページで星アイコンをクリックするとブックマークに追加できます。</p>
          <Link to="/standards" className="mt-6 inline-block bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors">
            基準一覧へ
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;