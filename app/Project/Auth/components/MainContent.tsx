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
  loading: boolean; 
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
  const [loading, setLoading] = useState(true); 

  const provider = new GoogleAuthProvider();

  /* LOGIN */
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* LOGOUT */
  const signOutUser = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* AUTH LISTENER */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading, 
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