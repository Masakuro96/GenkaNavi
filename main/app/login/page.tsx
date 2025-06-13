import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Corrected path
// import { signInWithEmailAndPassword } from 'firebase/auth'; // No longer needed for v8 compat
import { UserIcon } from '../../components/icons/UserIcon';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { EyeSlashIcon } from '../../components/icons/EyeSlashIcon';
import { ArrowPathIcon } from '@heroicons/react/24/outline';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password); // Updated to v8 compat style
      console.log('ログイン成功');
      navigate('/standards');
    } catch (err: any) {
       if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('メールアドレスまたはパスワードが正しくありません。');
      } else if (err.code === 'auth/invalid-email') {
        setError('有効なメールアドレスの形式ではありません。');
      }
      else {
        setError('ログインに失敗しました。しばらくしてから再度お試しください。');
        console.error('Firebase Login Error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <UserIcon className="w-16 h-16 text-sky-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">ログイン</h1>
          <p className="text-gray-500 mt-2">アカウント情報を入力してください。</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              placeholder="email@example.com"
              aria-label="メールアドレス"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              パスワード
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="••••••••"
                aria-label="パスワード"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center" role="alert">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 disabled:cursor-not-allowed transition-colors"
            >
               {loading ? (
                <>
                  <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                  処理中...
                </>
              ) : (
                'ログイン'
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          アカウントをお持ちでないですか？{' '}
          <Link to="/signup" className="font-medium text-sky-600 hover:text-sky-500 hover:underline">
            新規登録はこちら
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;