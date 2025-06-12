// This component is no longer used as Firebase Authentication handles user identification.
// You can safely delete this file from your project.
// If you prefer to keep it for reference, that's fine too.

/*
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon } from './icons/UserIcon';
import { TrashIcon } from './icons/TrashIcon';

const USER_ID_LIST_KEY = 'costAccountingLearnerUserIdsList'; // Key for the list of user IDs

interface UserSelectionPageProps {
  onSelectUser: (userId: string | null) => void; // Can also be null if no user is selected
}

export const UserSelectionPage: React.FC<UserSelectionPageProps> = ({ onSelectUser }) => {
  const [userIds, setUserIds] = useState<string[]>([]);
  const [newUserId, setNewUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedIds = localStorage.getItem(USER_ID_LIST_KEY);
      if (storedIds) {
        setUserIds(JSON.parse(storedIds));
      }
    } catch (error) {
      console.error('Failed to load user ID list from localStorage:', error);
      // Optionally clear corrupted data
      // localStorage.removeItem(USER_ID_LIST_KEY);
    }
  }, []);

  const saveUserIds = (updatedIds: string[]) => {
    setUserIds(updatedIds);
    localStorage.setItem(USER_ID_LIST_KEY, JSON.stringify(updatedIds));
  };

  const handleSelectOrCreateUser = (userIdToSelect: string) => {
    const trimmedUserId = userIdToSelect.trim();
    if (!trimmedUserId) {
      alert('ユーザーIDを入力してください。スペースのみのIDは使用できません。');
      return;
    }

    // Add to list or move to top if exists
    const otherIds = userIds.filter(id => id !== trimmedUserId);
    const updatedIdList = [trimmedUserId, ...otherIds];
    saveUserIds(updatedIdList);
    
    onSelectUser(trimmedUserId); // Set current user in context
    navigate('/standards'); // Navigate to the main app
  };

  const handleDeleteUserIdFromList = (e: React.MouseEvent, idToDelete: string) => {
    e.stopPropagation(); // Prevent triggering the select button
    if (window.confirm(`ユーザーID「\${idToDelete}」をこのリストから削除しますか？\n（このユーザーの学習データは削除されません。）`)) {
      const updatedIds = userIds.filter(id => id !== idToDelete);
      saveUserIds(updatedIds);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <UserIcon className="w-16 h-16 text-sky-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">ユーザーを選択</h1>
          <p className="text-gray-500 mt-2">学習データを切り替えるユーザーIDを選択または入力してください。</p>
        </div>

        <div className="mb-6">
          <label htmlFor="new-user-id" className="block text-sm font-medium text-gray-700 mb-2">
            新しいユーザーIDで開始 または 既存ID入力
          </label>
          <div className="flex space-x-2">
            <input
              id="new-user-id"
              type="text"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSelectOrCreateUser(newUserId);
                }
              }}
              placeholder="例: tanaka, user001"
              className="flex-grow block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-base"
              aria-label="新しいユーザーIDまたは既存のユーザーID"
            />
            <button
              onClick={() => handleSelectOrCreateUser(newUserId)}
              className="px-5 py-2 bg-sky-600 text-white font-semibold rounded-md shadow-sm hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              開始
            </button>
          </div>
        </div>
        
        {userIds.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-3 text-center border-b pb-2">
              または、以前のユーザーIDを選択
            </h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {userIds.map(id => (
                <div key={id} className="flex items-center bg-gray-50 rounded-lg group">
                  <button
                    onClick={() => handleSelectOrCreateUser(id)}
                    className="flex-grow text-left px-4 py-3 hover:bg-gray-100 rounded-l-lg transition-colors"
                    aria-label={`ユーザーID \${id} を選択`}
                  >
                    <span className="font-medium text-gray-800">{id}</span>
                  </button>
                  <button 
                    onClick={(e) => handleDeleteUserIdFromList(e, id)} 
                    className="p-2 m-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-50 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-1 focus:ring-red-300"
                    aria-label={`ユーザーID \${id} をリストから削除`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
*/
