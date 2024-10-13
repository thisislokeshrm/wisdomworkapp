/* eslint-disable @typescript-eslint/no-require-imports */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAprKkAD_ZLAGlZVrzdq0sFadGs_vqL3q4",
  authDomain: "app-wisdomwork.firebaseapp.com",
  databaseURL: "https://app-wisdomwork-default-rtdb.firebaseio.com",
  projectId: "app-wisdomwork",
  storageBucket: "app-wisdomwork.appspot.com",
  messagingSenderId: "668834440579",
  appId: "1:668834440579:web:4b16034bfa9e53207242b6",
  measurementId: "G-YF0LW14WKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Check if running in the browser before using window
if (typeof window !== 'undefined') {
  const { getAnalytics } = require('firebase/analytics');
  const analytics = getAnalytics(app);
}

export { app, auth, db, storage };