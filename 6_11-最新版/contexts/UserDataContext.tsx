import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { quizMarubatsuData } from '../data/quizMarubatsu';
import { quizFillInData } from '../data/quizFillIn';
import { auth, db } from '../firebase'; // Using v8 compat db
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// No need to import doc, onSnapshot, setDoc from 'firebase/firestore' for v8 compat

// 1. 型定義 (Preserved from original)
export interface QuizResults {
  [quizId: string]: boolean; // true for correct, false for incorrect
}

export interface StandardStats {
  totalQuizzes: number;
  answeredQuizzes: number;
  correctQuizzes: number;
  progress: number; // 0-100 percentage
  accuracy: number; // 0-100 percentage of answered quizzes
  isMastered: boolean;
}

export interface UserData {
  bookmarkedStandardIds: string[];
  quizResults: QuizResults;
  viewedStandardIds: string[];
}

export interface FirestoreStatus {
  online: boolean;
  message: string;
}

// Updated UserDataContextType (removed currentUserId)
export interface UserDataContextType {
  currentUser: firebase.User | null;
  isLoadingAuth: boolean;
  bookmarkedStandardIds: string[];
  quizResults: QuizResults;
  viewedStandardIds: string[];
  firestoreStatus: FirestoreStatus; // Added Firestore status
  toggleStandardBookmark: (id: string) => void;
  setQuizResult: (quizId: string, isCorrect: boolean) => void;
  getStandardStats: (standardId: string) => StandardStats;
  resetStandardResults: (standardId: string) => void;
  addViewedStandard: (id: string) => void;
}

// Preserved from original
const INITIAL_USER_DATA: UserData = {
  bookmarkedStandardIds: [],
  quizResults: {},
  viewedStandardIds: [],
};

const INITIAL_FIRESTORE_STATUS: FirestoreStatus = {
  online: true,
  message: '',
};

// 2. Contextの作成
const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// Providerコンポーネント
interface UserDataProviderProps { // Preserved from original
  children: ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [firestoreStatus, setFirestoreStatus] = useState<FirestoreStatus>(INITIAL_FIRESTORE_STATUS);


  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
      if (!user) { // Reset firestore status if user logs out
        setFirestoreStatus(INITIAL_FIRESTORE_STATUS);
      }
    });
    return unsubscribe;
  }, []);

  // Firestore data loading (v8 compatibility)
  useEffect(() => {
    if (!currentUser) {
      setUserData(INITIAL_USER_DATA); // Reset data if no user
      return;
    }

    const userDocRef = db.collection('users').doc(currentUser.uid);
    const userDataDocRef = userDocRef.collection('userData').doc('progress');

    const unsubscribe = userDataDocRef.onSnapshot((docSnap) => {
      if (docSnap.exists) {
        const data = docSnap.data() as UserData;
        // Validate data structure to match UserData robustly
        setUserData({
            bookmarkedStandardIds: Array.isArray(data.bookmarkedStandardIds) ? data.bookmarkedStandardIds : [],
            quizResults: (typeof data.quizResults === 'object' && data.quizResults !== null) ? data.quizResults : {},
            viewedStandardIds: Array.isArray(data.viewedStandardIds) ? data.viewedStandardIds : [],
        });
      } else {
        // Create initial data for new user if document doesn't exist
        userDataDocRef.set(INITIAL_USER_DATA).catch(error => {
            console.error("Error creating initial user data in Firestore: ", error);
             if (error.code === 'unavailable') {
                setFirestoreStatus({ online: false, message: '接続が不安定です。初期データの作成に失敗しました。' });
            }
        });
        setUserData(INITIAL_USER_DATA);
      }
      // If snapshot is successful, assume online
      setFirestoreStatus(INITIAL_FIRESTORE_STATUS);
    }, (error) => {
        console.error("Error fetching user data from Firestore: ", error);
        if (error.code === 'unavailable') {
            setFirestoreStatus({ online: false, message: '接続が不安定です。オフラインで動作中です。' });
        } else {
            setFirestoreStatus({ online: false, message: 'データ取得エラー。一部機能が制限される可能性があります。' });
        }
        setUserData(INITIAL_USER_DATA); // Fallback on error
    });

    return unsubscribe; // Cleanup Firestore listener
  }, [currentUser]);

  // Firestore data writing (v8 compatibility)
  useEffect(() => {
    if (currentUser && (userData.bookmarkedStandardIds.length > 0 || Object.keys(userData.quizResults).length > 0 || userData.viewedStandardIds.length > 0 || userData !== INITIAL_USER_DATA) ) {
      const userDocRef = db.collection('users').doc(currentUser.uid);
      const userDataDocRef = userDocRef.collection('userData').doc('progress');
      userDataDocRef.set(userData, { merge: true })
        .then(() => {
            // On successful write, ensure status is online if it was previously offline due to write error
            if (!firestoreStatus.online && firestoreStatus.message.includes('保存')) {
                 setFirestoreStatus(INITIAL_FIRESTORE_STATUS);
            }
        })
        .catch(error => { 
          console.error("Error writing user data to Firestore: ", error);
          if (error.code === 'unavailable') {
            setFirestoreStatus({ online: false, message: '接続が不安定です。変更は保存されない可能性があります。' });
          } else {
            setFirestoreStatus({ online: false, message: 'データの保存に失敗しました。' });
          }
      });
    }
  }, [userData, currentUser, firestoreStatus.online, firestoreStatus.message]); // Added firestoreStatus to dependencies to re-evaluate if it was an error state
  
  // Functions without useCallback
  const toggleStandardBookmark = (id: string) => {
    if (!currentUser) return;
    setUserData(prevData => ({
      ...prevData,
      bookmarkedStandardIds: prevData.bookmarkedStandardIds.includes(id)
        ? prevData.bookmarkedStandardIds.filter(bookmarkId => bookmarkId !== id)
        : [...prevData.bookmarkedStandardIds, id],
    }));
  };

  const setQuizResult = (quizId: string, isCorrect: boolean) => {
    if (!currentUser) return;
    setUserData(prevData => ({
      ...prevData,
      quizResults: {
        ...prevData.quizResults,
        [quizId]: isCorrect,
      },
    }));
  };
  
  const addViewedStandard = (id: string) => {
    if (!currentUser) return;
    setUserData(prevData => {
      if (!prevData.viewedStandardIds.includes(id)) {
        return {
          ...prevData,
          viewedStandardIds: [...prevData.viewedStandardIds, id],
        };
      }
      return prevData;
    });
  };

  const getStandardStats = (standardId: string): StandardStats => {
    const marubatsuForStandard = quizMarubatsuData.filter(q => q.standardId === standardId);
    const fillInForStandard = quizFillInData.filter(q => q.standardId === standardId);
    const totalQuizzes = marubatsuForStandard.length + fillInForStandard.length;

    if (totalQuizzes === 0) {
      return { totalQuizzes: 0, answeredQuizzes: 0, correctQuizzes: 0, progress: 0, accuracy: 0, isMastered: false };
    }

    let answeredQuizzes = 0;
    let correctQuizzes = 0;
    const allQuizIdsForStandard = [
      ...marubatsuForStandard.map(q => q.id),
      ...fillInForStandard.map(q => q.id)
    ];

    allQuizIdsForStandard.forEach(quizId => {
      if (userData.quizResults.hasOwnProperty(quizId)) {
        answeredQuizzes++;
        if (userData.quizResults[quizId] === true) {
          correctQuizzes++;
        }
      }
    });

    const progress = totalQuizzes > 0 ? Math.round((answeredQuizzes / totalQuizzes) * 100) : 0;
    const accuracy = answeredQuizzes > 0 ? Math.round((correctQuizzes / answeredQuizzes) * 100) : 0;
    const isMastered = progress === 100 && accuracy >= 80;
    
    return {
      totalQuizzes,
      answeredQuizzes,
      correctQuizzes,
      progress,
      accuracy,
      isMastered
    };
  };

  const resetStandardResults = (standardId: string) => {
    if (!currentUser) return;
    const marubatsuIdsToRemove = quizMarubatsuData
      .filter(q => q.standardId === standardId)
      .map(q => q.id);
    const fillInIdsToRemove = quizFillInData
      .filter(q => q.standardId === standardId)
      .map(q => q.id);
    const quizIdsToRemoveSet = new Set([...marubatsuIdsToRemove, ...fillInIdsToRemove]);

    setUserData(prevData => {
      const newQuizResults = { ...prevData.quizResults };
      quizIdsToRemoveSet.forEach(quizId => {
        delete newQuizResults[quizId];
      });
      return {
        ...prevData,
        quizResults: newQuizResults,
      };
    });
  };

  // Context value created directly without useMemo
  const contextValue: UserDataContextType = {
    currentUser,
    isLoadingAuth,
    bookmarkedStandardIds: userData.bookmarkedStandardIds,
    quizResults: userData.quizResults,
    viewedStandardIds: userData.viewedStandardIds,
    firestoreStatus, // Expose firestoreStatus
    toggleStandardBookmark,
    setQuizResult,
    getStandardStats,
    resetStandardResults,
    addViewedStandard,
  };

  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
};

// 3. カスタムフック (Preserved from original)
export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};