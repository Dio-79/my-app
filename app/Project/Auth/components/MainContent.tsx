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

/* ================= MAIN CONTENT UI ================= */
function MainContent() {
  const { user, loading, signInWithGoogle, signOutUser } = useUserAuth();

  if (loading) {
    return <p style={{ color: "white" }}>Loading...</p>;
  }

  return (
    <div style={{ color: "white", padding: "20px" }}>
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={signOutUser}>Logout</button>
        </>
      ) : (
        <>
          <p>You are not logged in</p>
          <button onClick={signInWithGoogle}>Login with Google</button>
        </>
      )}
    </div>
  );
}

export default MainContent;