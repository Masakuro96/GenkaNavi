import React from 'react';
import { Link } from 'react-router-dom';
import { TargetIcon } from '../../components/icons/TargetIcon';
import { ChevronRightIcon } from '../../components/icons/ChevronRightIcon';

const QuizDojoPage: React.FC = () => {
  const challengeOptions = [
    { count: 10, label: '10問に挑戦', description: '手軽に実力試し！短時間集中コース。', color: 'bg-sky-600 hover:bg-sky-700' },
    { count: 30, label: '30問に挑戦', description: 'バランスの取れた標準コース。', color: 'bg-amber-500 hover:bg-amber-600' },
    { count: 50, label: '50問に挑戦', description: '徹底的に知識を試す上級コース。', color: 'bg-red-600 hover:bg-red-700' },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[calc(100vh-180px)] flex flex-col justify-center">
      <header className="text-center mb-10 md:mb-16">
        <TargetIcon className="w-20 h-20 text-sky-600 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">クイズ道場</h1>
        <p className="text-xl text-gray-600 mt-3">己の限界に挑み、知識を磨き上げよ！</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {challengeOptions.map((option) => (
          <Link
            key={option.count}
            to={`/quiz-dojo/session?count=${option.count}`}
            className={`group p-6 md:p-8 rounded-xl shadow-2xl text-white text-center transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col justify-between items-center ${option.color}`}
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{option.label}</h2>
              <p className="text-sm opacity-90 mb-4">{option.description}</p>
            </div>
            <div className="mt-auto">
                <span className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md bg-white/20 hover:bg-white/30 transition-colors">
                    挑戦開始
                    <ChevronRightIcon className="w-5 h-5 ml-2" />
                </span>
            </div>
          </Link>
        ))}
      </div>
       <div className="text-center mt-12">
        <p className="text-gray-500">
          各コースでは、全範囲からランダムに問題が出題されます。
        </p>
      </div>
    </div>
  );
};

export default QuizDojoPage;