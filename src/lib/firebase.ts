// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOyZzlREsyirlpt1QkTZvDmzfILPV2Vt4",
  authDomain: "dispensary-13773344-54196.firebaseapp.com",
  projectId: "dispensary-13773344-54196",
  storageBucket: "dispensary-13773344-54196.appspot.com",
  messagingSenderId: "210293046378",
  appId: "1:210293046378:web:2351647d3b963f9215de13"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
