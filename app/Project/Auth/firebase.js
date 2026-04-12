import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

/* ================= CONFIG (KEEP YOURS EXACTLY) ================= */
const firebaseConfig = {
  apiKey: "AIzaSyDXTD6n5G_IRkK8YEEPNpG60whu6x1GZXU",
  authDomain: "cprg306-227e8.firebaseapp.com",
  databaseURL: "https://cprg306-227e8-default-rtdb.firebaseio.com",
  projectId: "cprg306-227e8",
  storageBucket: "cprg306-227e8.firebasestorage.app",
  messagingSenderId: "753489589211",
  appId: "1:753489589211:web:14f23bca015463709c2dfe",
  measurementId: "G-C2VNWTL5CV"
};

/* ================= INIT (SAFE FOR NEXT.JS HOT RELOAD) ================= */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/* ================= SERVICES ================= */
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

/* ================= PROVIDERS ================= */
export const googleAuthProvider = new GoogleAuthProvider();