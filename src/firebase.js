import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDoMqDJjVTeItAeje2EFOJiBuJqlnlUZFI',
  authDomain: 'chat-app-96215.firebaseapp.com',
  projectId: 'chat-app-96215',
  storageBucket: 'chat-app-96215.appspot.com',
  messagingSenderId: '516192518885',
  appId: '1:516192518885:web:b143650398eb563fcf4a0c',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
