"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";

/* ================= TYPES ================= */

interface Profile {
  username: string;
  photoURL: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/* ================= PROVIDER ================= */

export function UserAuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (u) {
        setProfile({
          username: u.displayName || "User",
          photoURL: u.photoURL || "/default-avatar.png", // ✅ FIX
        });
      } else {
        setProfile(null); // ✅ FIX
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOutUser = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signInWithGoogle, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export const useUserAuth = () => useContext(AuthContext);