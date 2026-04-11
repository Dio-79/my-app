"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../firebase";

/* ================= TYPE ================= */
interface AuthContextType {
  user: User | null;
  loading: boolean; // ✅ FIXED
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

/* ================= CONTEXT ================= */
const AuthContext = createContext<AuthContextType | null>(null);

/* ================= PROVIDER ================= */
export function UserAuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ✅ FIXED

  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // ✅ important
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading, // ✅ FIXED
        signInWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */
export function useUserAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used inside provider");
  }
  return context;
}