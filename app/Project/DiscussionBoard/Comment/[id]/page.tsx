"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../Auth/firebase";
import { useUserAuth } from "../../../Auth/auth-context";
import { useParams } from "next/navigation";

/* ================= TYPES ================= */

type Comment = {
  id: string;
  text: string;
  username: string;
  parentId: string | null;
  upvotes: string[];
  downvotes: string[];
};

/* ================= PAGE ================= */

export default function ThreadPage() {
  const { user, profile } = useUserAuth();
  const params = useParams();
  const postId = params?.id as string;

  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "services", "General", "threads", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Comment, "id">),
      }));
      setComments(data);
    });

    return () => unsub();
  }, [postId]);

  const addComment = async () => {
    if (!user || !text.trim()) return;

    await addDoc(
      collection(db, "services", "General", "threads", postId, "comments"),
      {
        text,
        username: profile?.username || "User",
        parentId: replyTo,
        upvotes: [],
        downvotes: [],
        createdAt: Date.now(),
      }
    );

    setText("");
    setReplyTo(null);
  };

  const vote = async (c: Comment, type: "up" | "down") => {
    if (!user) return;

    const ref = doc(
      db,
      "services",
      "General",
      "threads",
      postId,
      "comments",
      c.id
    );

    let up = c.upvotes;
    let down = c.downvotes;

    if (type === "up") {
      up = up.includes(user.uid)
        ? up.filter((id) => id !== user.uid)
        : [...up, user.uid];
      down = down.filter((id) => id !== user.uid);
    } else {
      down = down.includes(user.uid)
        ? down.filter((id) => id !== user.uid)
        : [...down, user.uid];
      up = up.filter((id) => id !== user.uid);
    }

    await updateDoc(ref, { upvotes: up, downvotes: down });
  };

  const render = (parentId: string | null, depth = 0) =>
    comments
      .filter((c) => c.parentId === parentId)
      .map((c) => {
        const score = c.upvotes.length - c.downvotes.length;

        return (
          <div key={c.id} style={{ marginLeft: depth * 20 }}>
            <div style={styles.comment}>
              <div>
                <strong style={{ color: "#e11d48" }}>{c.username}</strong>
                <p>{c.text}</p>

                <div style={styles.actions}>
                  <button onClick={() => vote(c, "up")}>⬆</button>
                  <span>{score}</span>
                  <button onClick={() => vote(c, "down")}>⬇</button>

                  <button onClick={() => setReplyTo(c.id)}>Reply</button>
                </div>
              </div>
            </div>

            {render(c.id, depth + 1)}
          </div>
        );
      });

  return (
    <div style={styles.page}>
      <h1>💬 Thread</h1>

      <div style={styles.inputBox}>
        {replyTo && <p>Replying...</p>}

        <input
          style={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write comment..."
        />

        <button style={styles.button} onClick={addComment}>
          Post
        </button>
      </div>

      {render(null)}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    background: "#1a1a1a",
    minHeight: "100vh",
    padding: "40px",
    color: "white",
  },
  inputBox: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    background: "#2a2a2a",
    border: "1px solid #333",
    color: "white",
  },
  button: {
    marginTop: "10px",
    background: "#e11d48",
    border: "none",
    padding: "10px",
    color: "white",
    cursor: "pointer",
  },
  comment: {
    background: "#222",
    padding: "10px",
    border: "1px solid #333",
    borderRadius: "6px",
    marginTop: "10px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
};