
import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '../../components/icons/StarIcon';
import { ClipboardListIcon } from '../../components/icons/ClipboardListIcon';
import { ChevronRightIcon } from '../../components/icons/ChevronRightIcon';
import { useUserData } from '../../contexts/UserDataContext';
import { standardsData } from '../../data/standards'; // Import standardsData

const MyPage: React.FC = () => {
  const { viewedStandardIds } = useUserData();
  const totalStandards = standardsData.length;
  const viewedCount = viewedStandardIds.length;
  const percentage = totalStandards > 0 ? (viewedCount / totalStandards) * 100 : 0;

  const menuItems = [
    {
      title: 'ブックマークした基準',
      description: 'お気に入りに登録した基準を確認できます。',
      link: '/mypage/bookmarks',
      icon: <StarIcon className="w-8 h-8 text-yellow-500" />,
    },
    {
      title: '苦手な問題',
      description: '間違えたクイズを復習して理解を深めましょう。',
      link: '/mypage/incorrect-quizzes',
      icon: <ClipboardListIcon className="w-8 h-8 text-red-500" />,
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">マイページ</h1>
        <p className="text-gray-600 text-lg">学習状況の確認や設定ができます。</p>
      </header>

      {/* 学習進捗セクション */}
      <section className="mb-8 md:mb-10 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">学習進捗</h2>
        <div className="flex justify-between items-center mb-1 text-sm">
          <span className="font-medium text-gray-600">
            達成状況: {viewedCount} / {totalStandards} 基準
          </span>
          <span className="font-semibold text-sky-700">
            {percentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4 dark:bg-slate-700">
          <div
            className="bg-sky-500 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`学習進捗 ${percentage.toFixed(0)}%`}
          >
          </div>
        </div>
        {viewedCount === totalStandards && totalStandards > 0 && (
          <p className="mt-4 text-center text-green-600 font-semibold text-lg">
            全基準コンプリート！素晴らしいです！🎉
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-start space-x-4 group"
          >
            <div className="flex-shrink-0 p-3 bg-slate-100 rounded-full">
              {item.icon}
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-sky-600 transition-colors">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <ChevronRightIcon className="w-6 h-6 text-gray-400 self-center group-hover:text-sky-600 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyPage;