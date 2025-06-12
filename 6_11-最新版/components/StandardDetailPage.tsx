

'use client';
import React, { useEffect, useMemo, useState, useRef } from 'react'; // Added useState, useRef
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { standardsData } from '../data/standards';
import { quizMarubatsuData } from '../data/quizMarubatsu';
import { quizFillInData } from '../data/quizFillIn';
import { useUserData, StandardStats } from '../contexts/UserDataContext';

import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { HelpCircleIcon } from './icons/HelpCircleIcon'; 
import { FileTextIcon } from './icons/FileTextIcon';   
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { PencilSquareIcon } from './icons/PencilSquareIcon';
import { StarIcon } from './icons/StarIcon'; 
import { StarOutlineIcon } from './icons/StarOutlineIcon'; 
import { RepeatIcon } from './icons/RepeatIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';

export const StandardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const standard = standardsData.find(s => s.id === id);
  
  const relatedMarubatsuQuizzes = quizMarubatsuData.filter(q => q.standardId === id);
  const marubatsuQuizCount = relatedMarubatsuQuizzes.length;

  const relatedFillInQuizzes = quizFillInData.filter(q => q.standardId === id);
  const fillInQuizCount = relatedFillInQuizzes.length;

  const [isConfirmingRetry, setIsConfirmingRetry] = useState(false);
  const confirmTimeoutRef = useRef<number | null>(null); // Changed NodeJS.Timeout to number

  const { 
    bookmarkedStandardIds, 
    toggleStandardBookmark, 
    addViewedStandard, 
    getStandardStats, 
    resetStandardResults, // Changed from resetQuizResults to resetStandardResults
    quizResults
  } = useUserData();
  
  const isBookmarked = standard ? bookmarkedStandardIds.includes(standard.id) : false;

  useEffect(() => {
    if (standard) {
      addViewedStandard(standard.id);
    }
  }, [standard, addViewedStandard]);

  // useEffect for timeout cleanup
  useEffect(() => {
    return () => {
      if (confirmTimeoutRef.current) {
        clearTimeout(confirmTimeoutRef.current);
      }
    };
  }, []);

  const stats: StandardStats | null = useMemo(() => {
    if (standard) {
      return getStandardStats(standard.id);
    }
    return null;
  }, [standard?.id, getStandardStats, quizResults]); 

  if (!standard || !stats) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] bg-gray-50 p-4">
        <HelpCircleIcon className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-4">基準が見つかりません</h2>
        <p className="text-gray-500 mb-6 text-center">お探しの原価計算基準は存在しないか、移動された可能性があります。</p>
        <Link
          to="/standards"
          className="inline-flex items-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          一覧に戻る
        </Link>
      </div>
    );
  }

  const handleBookmarkToggle = () => {
    if (standard) {
      toggleStandardBookmark(standard.id);
    }
  };

  const handleRetryQuizzes = () => {
    if (confirmTimeoutRef.current) {
      clearTimeout(confirmTimeoutRef.current);
      confirmTimeoutRef.current = null;
    }

    if (!isConfirmingRetry) {
      setIsConfirmingRetry(true);
      confirmTimeoutRef.current = window.setTimeout(() => { // Use window.setTimeout for browser
        setIsConfirmingRetry(false);
        confirmTimeoutRef.current = null;
      }, 3000); // Shortened to 3 seconds for quicker UI feedback
    } else {
      if (standard) {
        resetStandardResults(standard.id); // Use resetStandardResults
      }
      setIsConfirmingRetry(false);
    }
  };

  const handleCancelRetry = () => {
    if (confirmTimeoutRef.current) {
      clearTimeout(confirmTimeoutRef.current);
      confirmTimeoutRef.current = null;
    }
    setIsConfirmingRetry(false);
  };
  
  const totalQuizzesForStandard = marubatsuQuizCount + fillInQuizCount;

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto p-4">
          <Link 
            to="/standards" 
            className="text-sky-600 hover:text-sky-800 flex items-center transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            <span>基準一覧へ戻る</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <article className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
          
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex-grow">
              {standard.title}
            </h1>
            <button
              onClick={handleBookmarkToggle}
              aria-pressed={isBookmarked}
              aria-label={isBookmarked ? 'ブックマーク解除' : 'ブックマークに追加'}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors ml-4 flex-shrink-0"
            >
              {isBookmarked ? (
                <StarIcon className="w-6 h-6 text-yellow-400" />
              ) : (
                <StarOutlineIcon className="w-6 h-6 text-gray-500" />
              )}
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-6 md:mb-8">基準ID: {standard.id}</p>
          
          <section className="mb-10 md:mb-12">
            <h2 className="text-xl md:text-2xl font-semibold flex items-center mb-4 text-gray-700 border-b border-gray-200 pb-3">
              <FileTextIcon className="w-6 h-6 mr-3 text-sky-500"/>
              基準本文
            </h2>
            <div className="prose max-w-none lg:prose-lg text-gray-800 leading-relaxed">
              <ReactMarkdown>{standard.content.replace(/\n/g, "  \n")}</ReactMarkdown>
            </div>
          </section>

          <section className="bg-sky-50 border-l-4 border-sky-400 p-6 rounded-r-lg mb-10 md:mb-12 shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold flex items-center mb-4 text-sky-800">
              <LightBulbIcon className="w-6 h-6 mr-3 text-yellow-500" />
              ポイント解説
            </h2>
            <div className="prose max-w-none lg:prose-lg text-gray-700">
              <ReactMarkdown>{standard.commentary}</ReactMarkdown>
            </div>
          </section>
          
          {totalQuizzesForStandard > 0 && stats && (
            <section className="mb-10 md:mb-12 p-5 md:p-6 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <h2 className="text-xl md:text-2xl font-semibold flex items-center text-blue-800">
                  <ClipboardCheckIcon className="w-6 h-6 mr-3 text-blue-500" />
                  学習ステータス
                </h2>
                {stats.isMastered && (
                  <span className="mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold bg-green-500 text-white rounded-full flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                    習得済み！
                  </span>
                )}
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="font-medium text-gray-700">進捗率 ({stats.answeredQuizzes}/{stats.totalQuizzes} 問回答済)</span>
                  <span className="font-semibold text-blue-700">{stats.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3.5">
                  <div
                    className="bg-blue-500 h-3.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${stats.progress}%` }}
                    role="progressbar"
                    aria-valuenow={stats.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`進捗率 ${stats.progress.toFixed(0)}%`}
                  ></div>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-sm font-medium text-gray-700">
                  正答率: <span className="text-lg font-bold text-blue-700">{stats.accuracy.toFixed(0)}%</span>
                  {stats.answeredQuizzes > 0 && <span className="text-xs text-gray-500 ml-1"> ({stats.correctQuizzes}/{stats.answeredQuizzes} 問正解)</span>}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <button
                  onClick={handleRetryQuizzes}
                  className={`w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 duration-300
                    ${isConfirmingRetry
                      ? 'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-400'
                      : 'bg-blue-500 hover:bg-blue-600 text-white focus-visible:ring-blue-300'
                    }`
                  }
                  aria-label={isConfirmingRetry ? `「${standard.title}」のクイズの再挑戦を確定` : `「${standard.title}」のクイズを再挑戦する`}
                  aria-live="polite" // To announce the change in button text
                >
                  <RepeatIcon className="w-5 h-5 mr-2" />
                  {isConfirmingRetry ? '本当に再挑戦しますか？' : 'この基準のクイズを再挑戦する'}
                </button>
                {isConfirmingRetry && (
                  <button 
                      onClick={handleCancelRetry} 
                      className="mt-2 sm:mt-0 text-xs text-gray-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
                      aria-label="再挑戦をキャンセル"
                  >
                      キャンセル
                  </button>
                )}
              </div>
            </section>
          )}


          <section>
            <h2 className="text-xl md:text-2xl font-semibold flex items-center mb-4 text-gray-700">
              <CheckCircleIcon className="w-6 h-6 mr-3 text-green-500" />
              理解度チェック
            </h2>
            <p className="text-gray-600 mb-6">
              この基準に関するクイズに挑戦して、理解を深めましょう。
            </p>
            <div className="space-y-4">
              {marubatsuQuizCount > 0 ? (
                <Link 
                  to={`/standards/${standard.id}/quiz`} 
                  className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-transform transform hover:scale-105 duration-300 shadow-md w-full sm:w-auto text-base md:text-lg"
                >
                  <span>まるばつクイズ ({marubatsuQuizCount}問)</span>
                  <ArrowLeftIcon className="w-5 h-5 ml-3 transform rotate-180" />
                </Link>
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg text-left border border-gray-200">
                  <p className="text-gray-600">この基準のまるばつクイズは準備中です。</p>
                </div>
              )}

              {fillInQuizCount > 0 ? (
                <Link 
                  to={`/quiz-fill-in/${standard.id}`} 
                  className="inline-flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-transform transform hover:scale-105 duration-300 shadow-md w-full sm:w-auto text-base md:text-lg"
                >
                  <PencilSquareIcon className="w-5 h-5 mr-2" />
                  <span>穴埋めクイズ ({fillInQuizCount}問)</span>
                  <ArrowLeftIcon className="w-5 h-5 ml-3 transform rotate-180" />
                </Link>
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg text-left border border-gray-200">
                  <p className="text-gray-600">この基準の穴埋めクイズは準備中です。</p>
                </div>
              )}

              {(marubatsuQuizCount === 0 && fillInQuizCount === 0) && (
                 <div className="bg-gray-100 p-4 rounded-lg text-center border border-gray-200">
                    <p className="text-gray-600">この基準のクイズは全て準備中です。</p>
                 </div>
              )}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
};
