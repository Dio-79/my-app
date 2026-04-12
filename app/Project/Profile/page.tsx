"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../Auth/firebase";
import { useUserAuth } from "../Auth/auth-context";
import { uploadProfileImage } from "../utils/uploadprofileimage"; 
import { deleteUser } from "firebase/auth";
import { fonts, FontPreference } from "../utils/font"; 

/* ================= TYPES ================= */

type Profile = {
  username: string;
  email: string;
  photoURL: string;
  fontPreference: FontPreference;
  createdAt: number;
};

/* ================= MAIN ================= */

export default function ProfilePage() {
  const { user, loading } = useUserAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      const data = snap.data();

      if (data) {
        const typedProfile: Profile = {
          username: data.username || "",
          email: data.email || "",
          photoURL: data.photoURL || "/default-avatar.png",
          fontPreference: data.fontPreference || "default",
          createdAt: data.createdAt || 0,
        };

        setProfile(typedProfile);
        setUsername(typedProfile.username);

        document.body.style.fontFamily =
          fonts[typedProfile.fontPreference];
      }
    });

    return () => unsub();
  }, [user]);

  /* ================= IMAGE UPLOAD ================= */
  const handleFile = async (file: File) => {
    if (!user) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const url = await uploadProfileImage(file, user.uid);

    await updateDoc(doc(db, "users", user.uid), {
      photoURL: url,
    });

    // cleanup memory
    URL.revokeObjectURL(previewUrl);
  };

  /* ================= USERNAME UPDATE ================= */
  const updateUsername = async () => {
    if (!user) return;

    if (username.trim().length < 3) {
      alert("Username must be at least 3 characters");
      return;
    }

    await updateDoc(doc(db, "users", user.uid), {
      username,
    });
  };

  /* ================= FONT CHANGE ================= */
  const changeFont = async (font: FontPreference) => {
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), {
      fontPreference: font,
    });

    document.body.style.fontFamily = fonts[font];
  };

  /* ================= DELETE ACCOUNT ================= */
  const deleteAccount = async () => {
    if (!user) return;

    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
  };

  /* ================= STATES ================= */

  if (loading) {
    return <p style={{ color: "white" }}>Loading...</p>;
  }

  if (!user) {
    return <p style={{ color: "white" }}>Not logged in</p>;
  }

  if (!profile) {
    return <p style={{ color: "white" }}>Loading profile...</p>;
  }

  /* ================= UI ================= */

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Profile Settings</h1>

      {/* IMAGE */}
      <img
        src={preview || profile.photoURL || "/default-avatar.png"} // ✅ SAFE
        width={120}
        height={120}
        style={{ borderRadius: "50%", objectFit: "cover" }}
      />

      {/* FILE UPLOAD */}
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* USERNAME */}
      <div>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <button onClick={updateUsername}>Save Username</button>
      </div>

      {/* FONT */}
      <div>
        <select
          value={profile.fontPreference}
          onChange={(e) =>
            changeFont(e.target.value as FontPreference)
          }
        >
          <option value="default">Default</option>
          <option value="modern">Modern</option>
          <option value="mono">Mono</option>
        </select>
      </div>

      {/* DELETE */}
      <button onClick={deleteAccount} style={{ color: "red" }}>
        Delete Account
      </button>
    </div>
  );
}