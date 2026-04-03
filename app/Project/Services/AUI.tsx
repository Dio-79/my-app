import { useUserAuth } from "../Auth/auth-context";




/* ================= AUTH UI ================= */
export function MainContent() {
  const { user, signInWithGoogle, signOutUser } = useUserAuth();

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  const handleLogout = async () => {
    await signOutUser();
  };

  const handleSignup = async () => {
    await signInWithGoogle(); // same for now
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        padding: "20px",
        alignItems: "center",
      }}
    >
      {user ? (
        <>
          <p>Welcome {user.displayName}</p>
          <button onClick={handleLogout} style={{textAlign:"-khtml-left"}}>Logout</button>
        </>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignup}>Signup</button>
        </div>
      )}

    
    </div>
  );
}