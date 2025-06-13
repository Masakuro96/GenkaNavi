
'use client';
import React, { useState, useEffect } from 'react';
import { useUserData } from '../contexts/UserDataContext';
import { QuizFillInItem } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface QuizFillInProps extends Omit<QuizFillInItem, 'standardId'> {
  onAnswered?: (isCorrect: boolean) => void; //
  // No onAnswered needed for now, as fill-in is not in QuizDojo yet
}


export const QuizFillIn: React.FC<QuizFillInProps> = ({
  id,
  question,
  options,
  answerIndex,
  explanation,
  onAnswered, // ★この行を追加
}) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const { setQuizResult } = useUserData(); // Use setQuizResult

  useEffect(() => {
    setSelectedOptionIndex(null);
    setIsAnswered(false);
  }, [id]);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;

    setSelectedOptionIndex(index);
    setIsAnswered(true);
    const isCorrect = index === answerIndex;

    // Record the result in the context
    setQuizResult(id, isCorrect);

    // ★ここから追加
    if (onAnswered) { 
      onAnswered(isCorrect);
    }
    // ★ここまで追加
  };

  const questionParts = question.split(/(\[ ?\])/g);

  return (
    <div className="bg-white p-5 md:p-6">
      <div className="mb-4">
        <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
          穴埋めクイズ
        </span>
      </div>
      <div className="text-lg font-medium text-slate-800 mb-5 leading-relaxed flex flex-wrap items-baseline" id={`quiz-question-${id}`}>
        {questionParts.map((part, index) => {
          if (part === '[ ]' || part === '[]') {
            return (
              <span key={index} className="font-semibold text-indigo-600 mx-1">
                （穴埋め箇所）
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {options.map((option, index) => {
          const isSelected = selectedOptionIndex === index;
          const isCorrectOption = answerIndex === index;
          let buttonStyle = `bg-slate-50 hover:bg-slate-200 text-slate-700 focus:ring-slate-400`;

          if (isAnswered) {
            if (isCorrectOption) {
              buttonStyle = 'bg-green-500 text-white ring-2 ring-green-600 ring-offset-1 cursor-default';
            } else if (isSelected && !isCorrectOption) {
              buttonStyle = 'bg-red-500 text-white ring-2 ring-red-600 ring-offset-1 cursor-default';
            } else {
              buttonStyle = 'bg-slate-200 text-slate-500 cursor-default opacity-70';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswered}
              aria-label={`選択肢 ${index + 1}: ${option}`}
              aria-describedby={`quiz-question-${id}`}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-150 ease-in-out border border-slate-300
                          focus:outline-none focus:ring-2
                          ${buttonStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div role="alert" aria-live="assertive" className="mt-5 pt-5 border-t border-slate-200">
          <p
            className={`text-xl font-bold mb-3 flex items-center ${
              selectedOptionIndex === answerIndex ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {selectedOptionIndex === answerIndex ? (
              <CheckCircleIcon className="w-6 h-6 mr-2" />
            ) : (
              <XCircleIcon className="w-6 h-6 mr-2" />
            )}
            {selectedOptionIndex === answerIndex ? '正解！' : '不正解…'}
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
