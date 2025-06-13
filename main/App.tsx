
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { StandardsListPage } from './components/StandardsListPage';
import { StandardDetailPage } from './app/standards/[id]/page';
import { QuizPage } from './components/QuizPage';
import MyPage from './app/mypage/page';
import BookmarksPage from './app/mypage/bookmarks/page';
import IncorrectQuizzesPage from './app/mypage/incorrect-quizzes/page';
import QuizDojoPage from './app/quiz-dojo/page';
import QuizDojoSessionPage from './app/quiz-dojo/session/page';
import QuizFillInPage from './app/quiz-fill-in/[standardId]/page';
import SignUpPage from './app/signup/page'; // Import SignUpPage
import LoginPage from './app/login/page';   // Import LoginPage
import { useUserData } from './contexts/UserDataContext';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; // For loading indicator

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isLoadingAuth } = useUserData(); // Changed currentUserId to currentUser
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-128px)]">
        <ArrowPathIcon className="h-12 w-12 animate-spin text-sky-600" />
      </div>
    );
  }

  if (!currentUser) { // Changed currentUserId to currentUser
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App: React.FC = () => {
  const { currentUser, isLoadingAuth } = useUserData(); // Changed currentUserId to currentUser

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Routes that should redirect if user is logged in and tries to access them */}
           <Route
            path="/select-user" // Old route, redirect based on auth
            element={
              isLoadingAuth ? <div className="flex items-center justify-center min-h-screen"><ArrowPathIcon className="h-12 w-12 animate-spin text-sky-600" /></div> :
              currentUser ? <Navigate to="/standards" replace /> : <Navigate to="/login" replace /> // Changed currentUserId to currentUser
            }
          />

          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navigate to="/standards" replace />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/standards"
            element={<ProtectedRoute><StandardsListPage /></ProtectedRoute>}
          />
          <Route
            path="/standards/:id"
            element={<ProtectedRoute><StandardDetailPage /></ProtectedRoute>}
          />
          <Route
            path="/standards/:id/quiz"
            element={<ProtectedRoute><QuizPage /></ProtectedRoute>}
          />
          <Route
            path="/quiz-fill-in/:standardId"
            element={<ProtectedRoute><QuizFillInPage /></ProtectedRoute>}
          />
          <Route
            path="/mypage"
            element={<ProtectedRoute><MyPage /></ProtectedRoute>}
          />
          <Route
            path="/mypage/bookmarks"
            element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>}
          />
          <Route
            path="/mypage/incorrect-quizzes"
            element={<ProtectedRoute><IncorrectQuizzesPage /></ProtectedRoute>}
          />
          <Route
            path="/quiz-dojo"
            element={<ProtectedRoute><QuizDojoPage /></ProtectedRoute>}
          />
          <Route
            path="/quiz-dojo/session"
            element={<ProtectedRoute><QuizDojoSessionPage /></ProtectedRoute>}
          />
          
          {/* Fallback for any other authenticated routes, redirect to standards */}
          <Route path="*" element={
             isLoadingAuth ? <div className="flex items-center justify-center min-h-screen"><ArrowPathIcon className="h-12 w-12 animate-spin text-sky-600" /></div> :
             currentUser ? <Navigate to="/standards" replace /> : <Navigate to="/login" replace /> // Changed currentUserId to currentUser
          } />
        </Routes>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500">
        © 2025 原価計算基準ラーナー. All rights reserved.
      </footer>
    </div>
  );
};

export default App;