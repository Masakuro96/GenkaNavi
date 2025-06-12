// /firebase.ts

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// ここに、FirebaseコンソールからコピーしたfirebaseConfigオブジェクトを貼り付ける

const firebaseConfig = {
apiKey: "AIzaSyAVzSCcz9h1DH8Q_ZpGy90XHHjs9eAvbO8",
authDomain: "cost-accounting-learner.firebaseapp.com",
projectId: "cost-accounting-learner",
storageBucket: "cost-accounting-learner.firebasestorage.app",
messagingSenderId: "966160592273",
appId: "1:966160592273:web:cbe0b9dd7dc79f7c433e30"
};

// Firebaseアプリを初期化
const app = firebase.initializeApp(firebaseConfig);

// 各サービスをエクスポートして、アプリの他の場所で使えるようにする
export const auth = firebase.auth();
export const db = firebase.firestore();