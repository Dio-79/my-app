"use client";

import { useUserAuth } from "../auth-context";

export default function MainContent() {
  const { user, signInWithGoogle, signOutUser, loading } = useUserAuth();

  return (
    <div style={{ display: "flex", gap: "15px", padding: "20px", alignItems: "center" }}>
      {user ? (
        <>
          <p>Welcome {user.displayName}</p>
          <button onClick={signOutUser}>Logout</button>
        </>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={signInWithGoogle} disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
          <button onClick={signInWithGoogle} disabled={loading}>
            {loading ? "Signing in..." : "Signup"}
          </button>
        </div>
      )}
    </div>
  );
}