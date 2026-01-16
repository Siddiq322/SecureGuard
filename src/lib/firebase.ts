// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAPhGKVwWJvsEQ7FexP3I1MxVIVSiRv9XQ",
  authDomain: "sphere-80f53.firebaseapp.com",
  projectId: "sphere-80f53",
  storageBucket: "sphere-80f53.firebasestorage.app",
  messagingSenderId: "651176287348",
  appId: "1:651176287348:web:7c4dddfa63601604ee8521",
  measurementId: "G-XY9SD0E09X",
};

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
