'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { quizMarubatsuData } from '../../../data/quizMarubatsu';
import { quizFillInData } from '../../../data/quizFillIn';
import { standardsData } from '../../../data/standards';
import { QuizMarubatsu } from '../../../components/QuizMarubatsu';
import { QuizFillIn } from '../../../components/QuizFillIn';
import { QuizMarubatsuItem, QuizFillInItem } from '../../../types';
import { useUserData } from '../../../contexts/UserDataContext';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { CheckSquareIcon } from '../../../components/icons/CheckSquareIcon';
import { RepeatIcon } from '../../../components/icons/RepeatIcon';
import { HomeIcon } from '../../../components/icons/HomeIcon';
import { ChevronRightIcon } from '../../../components/icons/ChevronRightIcon';
import { CheckCircleIcon } from '../../../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../../../components/icons/XCircleIcon';

type DojoQuizItem =
  | ({ type: 'marubatsu' } & QuizMarubatsuItem)
  | ({ type: 'fillin' } & QuizFillInItem);

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const QuizDojoSessionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { quizResults, setQuizResult } = useUserData();

  const [sessionQuizzes, setSessionQuizzes] = useState<DojoQuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuizAttempted, setCurrentQuizAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [answerHistory, setAnswerHistory] = useState<(DojoQuizItem & { isCorrect: boolean })[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  // ★★★ quizResults の最新値を useRef で保持する ★★★
  const latestQuizResults = useRef(quizResults);
  useEffect(() => {
    latestQuizResults.current = quizResults;
  }, [quizResults]);

  const startSession = useCallback(() => {
    setIsLoading(true);

    const countParam = searchParams.get('count');
    const count = parseInt(countParam || '10', 10);
    const mode = searchParams.get('mode');
    const category = searchParams.get('category');
    
    const allQuizzes: DojoQuizItem[] = [
      ...quizMarubatsuData.map(q => ({ ...q, type: 'marubatsu' })),
      ...quizFillInData.map(q => ({ ...q, type: 'fillin' })),
    ];
    let sourceQuizzes = allQuizzes;

    if (mode === '苦手克服') {
      // ★★★ useRef で保持した最新の quizResults を使う ★★★
      const incorrectQuizIds = new Set(Object.keys(latestQuizResults.current).filter(id => !latestQuizResults.current[id]));
      sourceQuizzes = allQuizzes.filter(q => incorrectQuizIds.has(q.id));
    } else if (mode === '章別特訓' && category) {
      const standardIdsInCategory = new Set(standardsData.filter(s => s.category === category).map(s => s.id));
      sourceQuizzes = allQuizzes.filter(q => q.standardId && standardIdsInCategory.has(q.standardId));
    }

    const shuffledQuizzes = shuffleArray(sourceQuizzes);
    const numQuestions = (mode === '苦手克服' || mode === '章別特訓') ? shuffledQuizzes.length : Math.min(count, shuffledQuizzes.length);

    setSessionQuizzes(shuffledQuizzes.slice(0, numQuestions));
    
    setCurrentIndex(0);
    setScore(0);
    setAnswerHistory([]);
    setTimeElapsed(0);
    setIsFinished(false);
    setCurrentQuizAttempted(false);
    setIsLoading(false);
  }, [searchParams]); // ★★★ 依存配列から quizResults を削除 ★★★

  const handleAnswerInSession = (isCorrect: boolean) => {
    if (currentQuizAttempted) return;
    
    const currentQuiz = sessionQuizzes[currentIndex];
    if (!currentQuiz) return;
    
    setQuizResult(currentQuiz.id, isCorrect);
    setScore(prev => prev + (isCorrect ? 1 : 0));
    setAnswerHistory(prev => [...prev, { ...currentQuiz, isCorrect }]);
    setCurrentQuizAttempted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < sessionQuizzes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentQuizAttempted(false);
    } else {
      setIsFinished(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ★★★ useEffect のロジックを修正 ★★★
  useEffect(() => {
    startSession();
  }, [startSession]);

  useEffect(() => {
    if (!isLoading && !isFinished && sessionQuizzes.length > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoading, isFinished, sessionQuizzes.length]);
  

  // --- これ以降のJSX部分は変更なし ---
  // ... (省略) ...
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ArrowPathIcon className="w-12 h-12 animate-spin text-sky-600" />
      </div>
    );
  }

  if (sessionQuizzes.length === 0) {
    const mode = searchParams.get('mode');
    let message = "クイズが見つかりませんでした。";
    if (mode === '苦手克服') message = "苦手な問題はありません！";

    return (
        <div className="container mx-auto p-4 md:p-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-128px)]">
            {mode === '苦手克服' ? <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" /> : <CheckSquareIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3">{message}</h2>
            <Link to="/quiz-dojo" className="mt-6 inline-flex items-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition-colors">
                <HomeIcon className="w-5 h-5 mr-2" />
                道場トップへ戻る
            </Link>
        </div>
    );
  }
  
  const currentQuiz = sessionQuizzes[currentIndex];

  if (isFinished) {
    const actualPercentage = answerHistory.length > 0 ? Math.round((score / answerHistory.length) * 100) : 0;
    let resultMessage = "素晴らしい成績です！";
    if (actualPercentage < 50) resultMessage = "もう少し頑張りましょう！";
    else if (actualPercentage < 80) resultMessage = "良い調子ですね！";
    
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center">
            <CheckSquareIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">結果発表！</h1>
            <p className="text-3xl font-semibold text-sky-700 mb-3">{answerHistory.length}問中 {score}問正解！</p>
            <p className="text-xl text-gray-600 mb-2">{resultMessage} (正答率: {actualPercentage}%)</p>
            <p className="text-lg text-gray-500 mb-8">挑戦時間: {formatTime(timeElapsed)}</p>
        </div>
        
        <div className="mt-8 max-w-4xl mx-auto text-left border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">今回の挑戦結果詳細</h2>
            {answerHistory.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-3">
                    {answerHistory.map((item, index) => (
                        <div key={item.id + index} className={`p-4 rounded-lg border ${item.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-center mb-2">
                              {item.isCorrect ? <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" /> : <XCircleIcon className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />}
                              <p className="font-semibold text-gray-800 flex-grow">Q{index + 1}. ({item.type === 'marubatsu' ? '○×' : '穴埋め'})</p>
                            </div>
                            <p className="text-gray-700 mb-2 leading-relaxed text-sm">
                              {item.question.split(/(\[ ?\])/g).map((part, qPartIndex) => (part === '[ ]' || part === '[]') ? <span key={qPartIndex} className="font-semibold text-indigo-600 mx-1">（穴埋め箇所）</span> : <span key={qPartIndex}>{part}</span>)}
                            </p>
                            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 text-sm text-gray-600">
                              <h4 className="font-medium text-gray-700 mb-1">解説</h4>
                              <p>{item.explanation}</p>
                            </div>
                            {item.standardId && <Link to={`/standards/${item.standardId}`} className="text-xs text-sky-600 hover:underline mt-2 inline-block">関連基準: {standardsData.find(s => s.id === item.standardId)?.title || item.standardId} を確認する</Link>}
                        </div>
                    ))}
                </div>
            ) : <p>解答履歴がありません。</p>}
        </div>

        <div className="flex justify-center space-x-4 mt-8">
            <button onClick={startSession} className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-md">もう一度</button>
            <Link to="/quiz-dojo" className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-md">道場トップへ</Link>
        </div>
      </div>
    );
  }
  
  const incorrectCount = answerHistory.filter(item => !item.isCorrect).length;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-sky-700">クイズ道場</h1>
        <div className="flex justify-between items-baseline mt-2">
            <p>第 {currentIndex + 1} 問 / {sessionQuizzes.length} 問</p>
            <p><span className="text-green-600">正解: {score}</span> / <span className="text-red-600">不正解: {incorrectCount}</span></p>
        </div>
        <p className="text-sm text-right mt-1">経過時間: {formatTime(timeElapsed)}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${(answerHistory.length / sessionQuizzes.length) * 100}%` }}></div>
        </div>
      </header>
      
      <div className="bg-white rounded-xl shadow-xl p-6">
        {currentQuiz && (
            currentQuiz.type === 'marubatsu' ?
            <QuizMarubatsu {...currentQuiz} onAnswered={handleAnswerInSession} /> :
            <QuizFillIn {...currentQuiz} onAnswered={handleAnswerInSession} />
        )}
      </div>

      {currentQuizAttempted && (
        <div className="mt-8 text-center">
          <button onClick={handleNextQuestion} className="px-10 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md">
            {currentIndex < sessionQuizzes.length - 1 ? '次の問題へ' : '結果を見る'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizDojoSessionPage;