"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../Auth/firebase";
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

export  function PostComments({ params }: { params: { id: string } }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  /* ================= FETCH COMMENTS ================= */
  useEffect(() => {
    const q = query(collection(db, "posts", params.id, "comments"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Comment[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
      }));

      setComments(data);
    });

    return () => unsubscribe();
  }, [params.id]);

  /* ================= ADD COMMENT ================= */
  const addComment = async () => {
    if (!text) return;

    await addDoc(collection(db, "posts", params.id, "comments"), {
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
    <div style={{ padding: "40px", color: "white", background: "#1a1a1a", minHeight: "100vh" }}>
      <h1>💬 Comments</h1>

      {/* COMMENT LIST */}
      {comments.map((c) => (
        <div key={c.id} style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
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

      {/* INPUT */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        style={{
          padding: "10px",
          width: "100%",
          marginTop: "20px",
          background: "#2a2a2a",
          border: "1px solid #333",
          color: "white",
        }}
      />

      <button onClick={addComment} style={{ marginTop: "10px" }}>
        Add Comment
      </button>
    </div>
  );
}