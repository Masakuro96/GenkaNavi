
import React from 'react';
import { Link } from 'react-router-dom';
import { useUserData } from '../../../contexts/UserDataContext';
import { quizMarubatsuData } from '../../../data/quizMarubatsu';
import { quizFillInData } from '../../../data/quizFillIn';
import { QuizMarubatsu } from '../../../components/QuizMarubatsu';
import { QuizFillIn } from '../../../components/QuizFillIn';
import { ArrowLeftIcon } from '../../../components/icons/ArrowLeftIcon';
import { ClipboardListIcon } from '../../../components/icons/ClipboardListIcon';
import { standardsData } from '../../../data/standards'; // For linking back to standard
import { QuizMarubatsuItem, QuizFillInItem } from '../../../types'; // Import specific quiz item types

// Define a discriminated union for the items to be displayed
type IncorrectQuizDisplayItem =
  | { type: 'marubatsu'; quiz: QuizMarubatsuItem; standardTitle?: string; standardId?: string }
  | { type: 'fillIn'; quiz: QuizFillInItem; standardTitle?: string; standardId?: string };

const IncorrectQuizzesPage: React.FC = () => {
  const { quizResults } = useUserData();

  const incorrectQuizItems: IncorrectQuizDisplayItem[] = Object.entries(quizResults)
    .filter(([quizId, isCorrect]) => !isCorrect)
    .map(([quizId, _]): IncorrectQuizDisplayItem | null => { // Add explicit return type for map callback
      const marubatsuQuiz = quizMarubatsuData.find(q => q.id === quizId);
      if (marubatsuQuiz) {
        const standard = standardsData.find(s => s.id === marubatsuQuiz.standardId);
        return { type: 'marubatsu', quiz: marubatsuQuiz, standardTitle: standard?.title, standardId: standard?.id };
      }

      const fillInQuiz = quizFillInData.find(q => q.id === quizId);
      if (fillInQuiz) {
        const standard = standardsData.find(s => s.id === fillInQuiz.standardId);
        return { type: 'fillIn', quiz: fillInQuiz, standardTitle: standard?.title, standardId: standard?.id };
      }
      return null;
    })
    .filter((item): item is IncorrectQuizDisplayItem => item !== null); // Use a type guard to filter out nulls and refine type


  const incorrectQuizElements = incorrectQuizItems.map((item, index) => {
    // After the filter, item is guaranteed to be IncorrectQuizDisplayItem, so item itself cannot be null.
    // The key is item.quiz.id, which exists on both QuizMarubatsuItem and QuizFillInItem.

    return (
      <div key={item.quiz.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-4 md:p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-md md:text-lg font-semibold text-gray-700">復習 {index + 1} ({item.type === 'marubatsu' ? 'まるばつ' : '穴埋め'})</p>
            {item.standardTitle && item.standardId && (
               <Link to={`/standards/${item.standardId}`} className="text-xs text-sky-600 hover:underline">
                 関連基準: {item.standardTitle}
               </Link>
            )}
          </div>
        </div>
        {item.type === 'marubatsu' && (
          // TypeScript now knows that if item.type is 'marubatsu', then item.quiz is QuizMarubatsuItem
          <QuizMarubatsu
            id={item.quiz.id}
            question={item.quiz.question}
            answer={item.quiz.answer} // Accessing 'answer' is now safe
            explanation={item.quiz.explanation}
          />
        )}
        {item.type === 'fillIn' && (
          // TypeScript now knows that if item.type is 'fillIn', then item.quiz is QuizFillInItem
          <QuizFillIn
            id={item.quiz.id}
            question={item.quiz.question}
            options={item.quiz.options} // Accessing 'options' is now safe
            answerIndex={item.quiz.answerIndex} // Accessing 'answerIndex' is now safe
            explanation={item.quiz.explanation}
          />
        )}
      </div>
    );
  }); // .filter(Boolean) is not strictly necessary here if the map always returns a valid element or if map handles its own filtering logic. The primary filter is after the map.

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <ClipboardListIcon className="w-8 h-8 text-red-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">苦手な問題</h1>
            </div>
        </div>
         <p className="text-gray-600 text-lg mt-2">間違えたクイズを復習しましょう。各基準のページから「再挑戦する」ことで個別にリセットできます。</p>
      </header>

      {incorrectQuizElements.length > 0 ? (
        <div className="space-y-6 md:space-y-8">
          {incorrectQuizElements}
        </div>
      ) : (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <ClipboardListIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-xl text-gray-700 font-semibold mb-2">苦手な問題はありません</p>
          <p className="text-gray-500">クイズで間違えると、ここに自動的に追加されます。</p>
           <Link to="/standards" className="mt-6 inline-block bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors">
            クイズに挑戦する
          </Link>
        </div>
      )}
    </div>
  );
};

export default IncorrectQuizzesPage;
