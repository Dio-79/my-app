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
import { useParams } from "next/navigation";
import Image from "next/image";

/* ================= TYPES ================= */
interface Comment {
  id: string;
  text: string;
  createdAt: number;
  user?: {
    name?: string;
    photoURL?: string;
  };
}

export default function CommentPage() {
  const params = useParams();
  const id = params?.id as string;

  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  /* ================= REAL-TIME LISTENER ================= */
  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, "posts", id, "comments"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Comment[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
      }));

      setComments(data);
    });

    return () => unsubscribe();
  }, [id]);

  /* ================= ADD COMMENT ================= */
  const addComment = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "posts", id, "comments"), {
      text,
      createdAt: Date.now(),
      user: {
        name: "Anonymous",
        photoURL: "/default-avatar.png",
      },
    });

    setText("");
  };

  return (
    <div
      style={{
        padding: "40px",
        color: "white",
        background: "#1a1a1a",
        minHeight: "100vh",
      }}
    >
      <h1>💬 Comments</h1>

      {/* INPUT */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          style={{
            padding: "10px",
            width: "100%",
            background: "#2a2a2a",
            border: "1px solid #333",
            color: "white",
          }}
        />

        <button onClick={addComment} style={{ marginTop: "10px" }}>
          Add Comment
        </button>
      </div>

      {/* COMMENTS LIST */}
      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
            background: "#222",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          <Image
            src={c.user?.photoURL || "/default-avatar.png"}
            alt="User avatar"
            width={35}
            height={35}
            style={{ borderRadius: "50%" }}
          />

          <div>
            <strong>{c.user?.name || "User"}</strong>
            <p>{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}