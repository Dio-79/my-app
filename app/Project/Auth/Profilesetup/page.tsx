"use client";

import { useState } from "react";
import { useUserAuth } from "../auth-context"
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"
import { useRouter } from "next/navigation";

export default function ProfileSetup() {
  const { user } = useUserAuth();
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<string>("");
  const router = useRouter();

  const handleSave = async () => {
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      username,
      photoURL: image,
    });

    router.push("/Project"); // go to homepage
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Create Your Profile</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Profile Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
}