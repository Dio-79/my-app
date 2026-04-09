"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../Auth/firebase";
import { useUserAuth } from "../../../Auth/auth-context";
import { useParams } from "next/navigation";

/* ================= TYPES ================= */
type Comment = {
  id: string;
  text: string;
  username: string;
  photoURL: string;
  createdAt: number;
};

export default function CommentPage() {
  const { user, profile } = useUserAuth();
  const { id } = useParams();

  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  /* 🔥 REALTIME COMMENTS */
  useEffect(() => {
    const q = query(
      collection(db, "posts", id as string, "comments"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data: Comment[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
      }));
      setComments(data);
    });

    return () => unsub();
  }, [id]);

  /* 🔥 ADD COMMENT */
  const addComment = async () => {
    if (!text || !user || !profile) return;

    await addDoc(collection(db, "posts", id as string, "comments"), {
      text,
      userId: user.uid,
      username: profile.username,
      photoURL: profile.photoURL,
      createdAt: Date.now(),
    });

    setText("");
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h2>💬 Comments</h2>

      {/* ADD COMMENT */}
      <div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={addComment}>Post</button>
      </div>

      {/* LIST */}
      {comments.map((c) => (
        <div key={c.id} style={{ marginTop: "15px" }}>
          <img src={c.photoURL} width={30} />
          <b>{c.username}</b>
          <p>{c.text}</p>
        </div>
      ))}
    </div>
  );
}