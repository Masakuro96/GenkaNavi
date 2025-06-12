'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { quizMarubatsuData } from '../../../data/quizMarubatsu';
import { QuizMarubatsu } from '../../../components/QuizMarubatsu';
import { QuizMarubatsuItem } from '../../../types';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; // Using heroicons for simplicity here
import { CheckSquareIcon } from '../../../components/icons/CheckSquareIcon';
import { RepeatIcon } from '../../../components/icons/RepeatIcon';
import { HomeIcon } from '../../../components/icons/HomeIcon';
import { ChevronRightIcon } from '../../../components/icons/ChevronRightIcon';


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
  const navigate = useNavigate();

  const [sessionQuizzes, setSessionQuizzes] = useState<QuizMarubatsuItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuizAttempted, setCurrentQuizAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialCount, setInitialCount] = useState(10);


  const startSession = useCallback((count: number) => {
    setIsLoading(true);
    const shuffledQuizzes = shuffleArray(quizMarubatsuData);
    const numQuestions = Math.min(count, shuffledQuizzes.length);
    setSessionQuizzes(shuffledQuizzes.slice(0, numQuestions));
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setCurrentQuizAttempted(false);
    setIsLoading(false);
    if (numQuestions === 0 && quizMarubatsuData.length > 0) {
        // This case should ideally not happen if count > 0 and data exists
        console.warn("No quizzes selected for the session, though data exists.");
    } else if (quizMarubatsuData.length === 0) {
        console.warn("No quiz data available to start a session.");
    }
  }, []);

  useEffect(() => {
    const countParam = searchParams.get('count');
    const count = parseInt(countParam || '10', 10);
    setInitialCount(count > 0 ? count : 10);
    startSession(count > 0 ? count : 10);
  }, [searchParams, startSession]);

  const handleAnswerInSession = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    setCurrentQuizAttempted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < sessionQuizzes.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setCurrentQuizAttempted(false);
    } else {
      setIsFinished(true);
    }
  };
  
  const handleTryAgain = () => {
    startSession(initialCount);
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-gray-600">
        <ArrowPathIcon className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl">道場の準備をしています...</p>
      </div>
    );
  }

  if (!isLoading && sessionQuizzes.length === 0) {
     return (
      <div className="container mx-auto p-4 md:p-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-128px)]">
        <CheckSquareIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3">問題準備エラー</h2>
        <p className="text-gray-500 mb-6">
          クイズ道場のための問題が見つかりませんでした。
          <br />
          管理者にお問い合わせください。
        </p>
        <Link
          to="/quiz-dojo"
          className="inline-flex items-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition-colors"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          道場トップへ戻る
        </Link>
      </div>
    );
  }


  if (isFinished) {
    const percentage = sessionQuizzes.length > 0 ? Math.round((score / sessionQuizzes.length) * 100) : 0;
    let resultMessage = "素晴らしい成績です！";
    if (percentage < 50) resultMessage = "もう少し頑張りましょう！";
    else if (percentage < 80) resultMessage = "良い調子ですね！";


    return (
      <div className="container mx-auto p-4 md:p-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
        <CheckSquareIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">結果発表！</h1>
        <p className="text-3xl md:text-4xl font-semibold text-sky-700 mb-3">
          {sessionQuizzes.length}問中 {score}問正解！
        </p>
        <p className="text-xl text-gray-600 mb-8">{resultMessage} (正答率: {percentage}%)</p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleTryAgain}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-md transition-colors text-lg"
          >
            <RepeatIcon className="w-5 h-5 mr-2" />
            もう一度 ({initialCount}問)
          </button>
          <Link
            to="/quiz-dojo"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-md transition-colors text-lg"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            道場トップへ
          </Link>
        </div>
      </div>
    );
  }

  const currentQuiz = sessionQuizzes[currentIndex];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-sky-700">クイズ道場</h1>
            <Link 
                to="/quiz-dojo"
                className="text-sm text-sky-600 hover:text-sky-700 hover:underline"
            >
                道場トップへ戻る
            </Link>
        </div>
        <div className="flex justify-between items-baseline">
            <p className="text-lg text-gray-600">
                第 {currentIndex + 1} 問 / {sessionQuizzes.length} 問
            </p>
            <p className="text-lg font-semibold text-green-600">
                現在のスコア: {score}点
            </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
                className="bg-sky-500 h-2.5 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${((currentIndex + (currentQuizAttempted ? 1: 0)) / sessionQuizzes.length) * 100}%` }}
            ></div>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        <QuizMarubatsu
          key={currentQuiz.id} // Ensure component re-renders fully if needed when question changes
          id={currentQuiz.id}
          question={currentQuiz.question}
          answer={currentQuiz.answer}
          explanation={currentQuiz.explanation}
          onAnswered={handleAnswerInSession}
        />
      </div>

      {currentQuizAttempted && (
        <div className="mt-6 md:mt-8 text-center">
          <button
            onClick={handleNextQuestion}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-10 rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300 text-lg"
          >
            {currentIndex < sessionQuizzes.length - 1 ? '次の問題へ' : '結果を見る'}
            <ChevronRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizDojoSessionPage;