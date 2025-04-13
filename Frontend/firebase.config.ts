// firebase.js or firebaseClient.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config (same as before)
const firebaseConfig = {
  apiKey: "AIzaSyDcqiTNrII8p5LNDqA5M6LuShoDx5vggGY",
  authDomain: "seaxchange-ec524.firebaseapp.com",
  projectId: "seaxchange-ec524",
  storageBucket: "seaxchange-ec524.firebasestorage.app",
  messagingSenderId: "85034476226",
  appId: "1:85034476226:web:2a30fe65874799462c915b",
};

// Avoid reinitializing Firebase if it's already initialized
const app = initializeApp(firebaseConfig);

const auth = getAuth(app); // For web, no need to set custom persistence unless needed
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
