import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { UserIcon as MyPageUserIcon } from './icons/UserIcon'; // Renamed to avoid conflict
import { SwordsIcon } from './icons/SwordsIcon';
import { useUserData } from '../contexts/UserDataContext';
import { auth } from '../firebase'; // Import Firebase auth (now v8 compat style)
// import { signOut } from 'firebase/auth'; // No longer needed for v8 compat
import { UserCircleIcon } from './icons/UserCircleIcon'; // For logged in user display
import { ArrowRightOnRectangleIcon } from './icons/LogoutIcon'; // For logout
import { SignalSlashIcon } from './icons/SignalSlashIcon'; // For offline status

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isLoadingAuth, firestoreStatus } = useUserData();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Updated to v8 compat style
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error, e.g., display a message
    }
  };

  const navLinks = [
    { path: "/standards", label: "基準一覧", icon: <BookOpenIcon className="h-5 w-5" /> },
    { path: "/quiz-dojo", label: "クイズ道場", icon: <SwordsIcon className="h-5 w-5" /> },
    // MyPage link is conditional based on login state below
  ];

  if (currentUser) {
    navLinks.push({ path: "/mypage", label: "マイページ", icon: <MyPageUserIcon className="h-5 w-5" /> });
  }


  if (isLoadingAuth) {
    return (
      <nav className="bg-sky-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2 text-xl font-bold">
                <BookOpenIcon className="h-7 w-7" />
                <span>原価計算基準ラーナー</span>
              </div>
            </div>
            <div className="h-6 w-24 bg-sky-600 animate-pulse rounded-md"></div> {/* Loading placeholder */}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-sky-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 text-xl font-bold hover:text-sky-200 transition-colors">
                <BookOpenIcon className="h-7 w-7" />
                <span>原価計算基準ラーナー</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.startsWith(link.path) || (location.pathname === "/" && link.path === "/standards")
                      ? 'bg-sky-800 text-white'
                      : 'text-sky-100 hover:bg-sky-600 hover:text-white'
                  }`}
                  aria-current={location.pathname.startsWith(link.path) ? 'page' : undefined}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              {currentUser ? (
                <>
                  <span className="flex items-center space-x-2 px-3 py-2 text-sm text-sky-100" title={currentUser.email || undefined}>
                    <UserCircleIcon className="h-5 w-5" />
                    <span className="truncate max-w-[100px]">{currentUser.email || 'ユーザー'}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-sky-100 hover:bg-sky-600 hover:text-white transition-colors"
                    aria-label="ログアウト"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>ログアウト</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/login' ? 'bg-sky-800 text-white' : 'text-sky-100 hover:bg-sky-600 hover:text-white'
                    }`}
                  >
                    <span>ログイン</span>
                  </Link>
                  <Link
                    to="/signup"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-amber-500 hover:bg-amber-600 text-white`}
                  >
                    <span>新規登録</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className="md:hidden border-t border-sky-600">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex justify-around items-center">
            {navLinks.map(link => (
              <Link
                  key={`mobile-${link.path}`}
                  to={link.path}
                  className={`flex flex-col items-center w-1/3 px-1 py-2 rounded-md text-xs font-medium transition-colors ${
                    location.pathname.startsWith(link.path) || (location.pathname === "/" && link.path === "/standards")
                      ? 'bg-sky-800 text-white'
                      : 'text-sky-100 hover:bg-sky-600 hover:text-white'
                  }`}
                  aria-current={location.pathname.startsWith(link.path) ? 'page' : undefined}
                >
                  {React.cloneElement(link.icon, { className: "h-5 w-5 mb-0.5"})}
                  <span className="truncate">{link.label}</span>
                </Link>
            ))}
            {currentUser ? (
              <button
                  onClick={handleLogout}
                  className="flex flex-col items-center w-1/3 px-1 py-2 rounded-md text-xs font-medium text-sky-100 hover:bg-sky-600 hover:text-white transition-colors"
                  aria-label="ログアウト"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mb-0.5" />
                  <span>ログアウト</span>
                </button>
            ) : (
              <>
              <Link
                  to="/login"
                  className={`flex flex-col items-center w-1/3 px-1 py-2 rounded-md text-xs font-medium transition-colors ${
                    location.pathname === '/login' ? 'bg-sky-800 text-white' : 'text-sky-100 hover:bg-sky-600 hover:text-white'
                  }`}
                >
                  <MyPageUserIcon className="h-5 w-5 mb-0.5"/> {/* Placeholder, consider a login icon */}
                  <span>ログイン</span>
                </Link>
                <Link
                  to="/signup"
                  className={`flex flex-col items-center w-1/3 px-1 py-2 rounded-md text-xs font-medium transition-colors text-sky-100 hover:bg-sky-600 hover:text-white`}
                >
                  {/* Placeholder icon, consider a signup icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mb-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
                  <span>新規登録</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {!firestoreStatus.online && (
        <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-xs text-center py-1.5 px-4 flex items-center justify-center shadow-sm" role="alert">
          <SignalSlashIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{firestoreStatus.message}</span>
        </div>
      )}
    </>
  );
};