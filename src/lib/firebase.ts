import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBW7rCLSaPDGcANiSU4GO6wPd4LRLm7-nY",
  authDomain: "feedback-project-4c44e.firebaseapp.com",
  projectId: "feedback-project-4c44e",
  storageBucket: "feedback-project-4c44e.firebasestorage.app",
  messagingSenderId: "180336319356",
  appId: "1:180336319356:web:28b073f7a0c62c82b362f9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
