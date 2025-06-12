
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { standardsData } from '../data/standards';
import { quizMarubatsuData } from '../data/quizMarubatsu';
import { QuizMarubatsu } from './QuizMarubatsu';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { BookOpenIcon } from './icons/BookOpenIcon'; 
import { HelpCircleIcon } from './icons/HelpCircleIcon'; // For "Not Found" state

export const QuizPage: React.FC = () => {
  const { id: standardId } = useParams<{ id: string }>();
  const standard = standardsData.find(s => s.id === standardId);
  const quizzesForStandard = quizMarubatsuData.filter(
    q => q.standardId === standardId
  );

  if (!standard) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-128px)]">
        <HelpCircleIcon className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3">基準情報エラー</h2>
        <p className="text-gray-500 mb-6">
          関連する基準情報が見つからないため、クイズを表示できません。
          <br />
          正しいページからアクセスしているかご確認ください。
        </p>
        <Link
          to="/standards"
          className="inline-flex items-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition-colors"
        >
          <BookOpenIcon className="w-5 h-5 mr-2" />
          基準一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {standard.title}
            </h1>
            <div className="flex space-x-2 sm:space-x-3 flex-shrink-0">
              <Link 
                to={`/standards/${standardId}`} 
                className="inline-flex items-center text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors group"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1 sm:mr-1.5 transition-transform group-hover:-translate-x-0.5" />
                基準詳細へ
              </Link>
              <Link 
                to="/standards" 
                className="inline-flex items-center text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-100 text-sky-700 font-medium rounded-md hover:bg-sky-200 transition-colors group"
              >
                <BookOpenIcon className="w-4 h-4 mr-1 sm:mr-1.5 transition-transform group-hover:scale-110" />
                基準一覧へ
              </Link>
            </div>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-sky-700">
          まるばつクイズ
        </h2>
      </div>

      {quizzesForStandard.length > 0 ? (
        <>
          <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg">
            この基準に関するまるばつクイズに挑戦して、理解度を確認しましょう。
          </p>
          <div className="space-y-6 md:space-y-8">
            {quizzesForStandard.map((quizItem, index) => (
              <div key={quizItem.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                 <div className="p-4 md:p-5 bg-gray-50 border-b border-gray-200">
                    <p className="text-md md:text-lg font-semibold text-gray-700">第 {index + 1} 問</p>
                 </div>
                <QuizMarubatsu 
                  id={quizItem.id}
                  question={quizItem.question}
                  answer={quizItem.answer}
                  explanation={quizItem.explanation}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg text-center border border-amber-300">
          <svg className="w-16 h-16 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.5 4.5 0 0012.016 15a4.5 4.5 0 00-3.198 1.354M9 10.5h.008v.008H9v-.008zm5.25 0h.008v.008H14.25v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15C8.21 13.04 9.944 11.5 12 11.5s3.79 1.54 4.5 3.5" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">クイズ準備中</h3>
          <p className="text-gray-500 mb-6">
            「{standard.title}」に関するクイズは現在準備中です。
            <br />
            他の基準のクイズをお試しいただくか、後ほど再度ご確認ください。
          </p>
          <Link
            to={`/standards/${standardId}`}
            className="inline-flex items-center px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            基準詳細へ戻る
          </Link>
        </div>
      )}

      {quizzesForStandard.length > 0 && (
        <div className="mt-10 md:mt-12 pt-6 border-t border-gray-200 text-center">
            <Link 
                to={`/standards/${standardId}`} 
                className="inline-flex items-center text-sky-600 hover:text-sky-700 hover:underline transition-colors group text-base"
            >
                <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                基準の学習ページに戻る
            </Link>
        </div>
      )}
    </div>
  );
};
