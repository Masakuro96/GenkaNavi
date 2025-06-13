
import React, { useState, useEffect } from 'react';
import { useUserData } from '../contexts/UserDataContext';

interface QuizMarubatsuProps {
  id: string;
  question: string;
  answer: boolean;
  explanation: string;
  onAnswered?: (isCorrect: boolean) => void; // Optional callback for QuizDojo
}

export const QuizMarubatsu: React.FC<QuizMarubatsuProps> = ({ id, question, answer, explanation, onAnswered }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnsweredInternal, setIsAnsweredInternal] = useState<boolean>(false);
  const { setQuizResult } = useUserData(); // Use setQuizResult

  // Reset component state if the quiz ID changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnsweredInternal(false);
  }, [id]);


  const handleAnswer = (userAnswer: boolean) => {
    if (isAnsweredInternal) return;

    setSelectedAnswer(userAnswer);
    setIsAnsweredInternal(true);
    const correct = userAnswer === answer;

    // Record the result in the context
    setQuizResult(id, correct);

    if (onAnswered) { // For QuizDojo compatibility
      onAnswered(correct);
    }
  };

  const isCorrect = isAnsweredInternal && selectedAnswer === answer;

  return (
    <div className="bg-white p-5 md:p-6">
      <div className="mb-4">
        <span className="text-xs font-semibold bg-sky-100 text-sky-700 px-2 py-1 rounded-full">
          まるばつクイズ
        </span>
      </div>
      <p className="text-lg font-medium text-slate-800 mb-5 leading-relaxed" id={`quiz-question-${id}`}>
        {question}
      </p>

      <div className="flex items-center space-x-3 sm:space-x-4 mb-5">
        <button
          onClick={() => handleAnswer(true)}
          disabled={isAnsweredInternal}
          aria-label="回答：まる"
          aria-describedby={`quiz-question-${id}`}
          className={`flex-1 sm:flex-none sm:w-28 py-3 px-4 rounded-lg font-bold text-lg transition-all duration-150 ease-in-out
                      focus:outline-none focus:ring-4
                      ${
                        isAnsweredInternal
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-300'
                      }
                      ${
                        isAnsweredInternal && answer === true
                          ? '!bg-green-600 ring-2 ring-green-700 ring-offset-1 text-white' 
                          : ''
                      }
                      ${
                        isAnsweredInternal && selectedAnswer === true && !isCorrect
                          ? '!bg-red-500 ring-2 ring-red-600 ring-offset-1 text-white'
                          : ''
                      }`}
        >
          ○<span className="sr-only">正しい</span>
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={isAnsweredInternal}
          aria-label="回答：ばつ"
          aria-describedby={`quiz-question-${id}`}
          className={`flex-1 sm:flex-none sm:w-28 py-3 px-4 rounded-lg font-bold text-lg transition-all duration-150 ease-in-out
                      focus:outline-none focus:ring-4
                      ${
                        isAnsweredInternal
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300'
                      }
                      ${
                        isAnsweredInternal && answer === false && isCorrect
                          ? '!bg-green-600 ring-2 ring-green-700 ring-offset-1 text-white'
                          : ''
                      }
                      ${
                        isAnsweredInternal && selectedAnswer === false && !isCorrect
                          ? '!bg-red-500 ring-2 ring-red-600 ring-offset-1 text-white'
                          : ''
                      }`}
        >
          ×<span className="sr-only">誤り</span>
        </button>
      </div>

      {isAnsweredInternal && (
        <div role="alert" aria-live="assertive" className="mt-5 pt-5 border-t border-slate-200">
          <p
            className={`text-xl font-bold mb-3 ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isCorrect ? '正解！' : '不正解…'}
          </p>
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-700 mb-1 text-md">解説</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
