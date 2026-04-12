"use client";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../Auth/firebase";
import { useUserAuth } from "../Auth/auth-context";
import { useEffect, useState } from "react";
import Image from "next/image";

/* ================= TYPES ================= */

interface Thread {
  id: string;
  title: string;
  createdBy: string;
  createdById: string;
  isPinned: boolean;
  createdAt?: Timestamp;
}

interface Comment {
  id: string;
  text: string;
  userId: string;
  username: string;
  photoURL?: string;
  parentId: string | null;
  likes: string[];
  createdAt?: Timestamp;
}

/* ================= MAIN ================= */

export default function JoystickJunkies() {
  const { user, profile } = useUserAuth();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [newThread, setNewThread] = useState("");
  const [loading, setLoading] = useState(true);

  const topic = "General"; // fixed topic (you can connect later)

  /* ===== FETCH THREADS ===== */
  useEffect(() => {
    const q = query(
      collection(db, "services", topic, "threads"),
      orderBy("isPinned", "desc"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data: Thread[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Thread, "id">),
      }));

      setThreads(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* ===== CREATE THREAD ===== */
  const createThread = async () => {
    if (!user || !newThread.trim()) return;

    await addDoc(collection(db, "services", topic, "threads"), {
      title: newThread,
      createdBy: profile?.username || "Anonymous",
      createdById: user.uid,
      isPinned: false,
      createdAt: serverTimestamp(),
    });

    setNewThread("");
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>🎮 Joystick Junkies</h1>

      {user && (
        <div>
          <input
            value={newThread}
            onChange={(e) => setNewThread(e.target.value)}
            placeholder="Create thread..."
          />
          <button onClick={createThread}>Post</button>
        </div>
      )}

      {loading && <Skeleton />}

      {threads.map((t) => (
        <ThreadItem key={t.id} thread={t} topic={topic} />
      ))}
    </div>
  );
}

/* ================= THREAD ================= */

function ThreadItem({
  thread,
  topic,
}: {
  thread: Thread;
  topic: string;
}) {
  const { user, profile } = useUserAuth();

  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  /* ===== FETCH COMMENTS ===== */
  useEffect(() => {
    const q = query(
      collection(db, "services", topic, "threads", thread.id, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setComments(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Comment, "id">),
        }))
      );
    });

    return () => unsub();
  }, [thread.id, topic]);

  /* ===== ADD COMMENT ===== */
  const addComment = async (parentId: string | null = null) => {
    if (!user || !text.trim()) return;

    await addDoc(
      collection(db, "services", topic, "threads", thread.id, "comments"),
      {
        text,
        userId: user.uid,
        username: profile?.username || "User",
        photoURL: profile?.photoURL || "",
        parentId,
        likes: [],
        createdAt: serverTimestamp(),
      }
    );

    setText("");
  };

  /* ===== LIKE ===== */
  const toggleLike = async (c: Comment) => {
    if (!user) return;

    const ref = doc(
      db,
      "services",
      topic,
      "threads",
      thread.id,
      "comments",
      c.id
    );

    const liked = c.likes.includes(user.uid);

    await updateDoc(ref, {
      likes: liked
        ? c.likes.filter((id) => id !== user.uid)
        : [...c.likes, user.uid],
    });
  };

  /* ===== NESTED COMMENTS ===== */
  const renderComments = (parentId: string | null, depth = 0) =>
    comments
      .filter((c) => c.parentId === parentId)
      .map((c) => (
        <div key={c.id} style={{ marginLeft: depth * 20 }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <Image
              src={c.photoURL || "/default-avatar.png"}
              alt="avatar"
              width={30}
              height={30}
              style={{ borderRadius: "50%" }}
            />

            <div>
              <strong>{c.username}</strong>
              <p>{c.text}</p>

              <button onClick={() => toggleLike(c)}>
                👍 {c.likes.length}
              </button>

              <button onClick={() => addComment(c.id)}>Reply</button>
            </div>
          </div>

          {renderComments(c.id, depth + 1)}
        </div>
      ));

  return (
    <div style={{ border: "1px solid #333", marginTop: "20px", padding: "10px" }}>
      <h3>{thread.isPinned && "📌"} {thread.title}</h3>

      {user?.uid === thread.createdById && (
        <button
          onClick={async () =>
            await deleteDoc(doc(db, "services", topic, "threads", thread.id))
          }
        >
          Delete
        </button>
      )}

      {renderComments(null)}

      {user && (
        <div>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write comment..."
          />
          <button onClick={() => addComment(null)}>Send</button>
        </div>
      )}
    </div>
  );
}

/* ================= SKELETON ================= */

function Skeleton() {
  return (
    <div>
      <div style={{ height: "20px", background: "#333", margin: "10px 0" }} />
      <div style={{ height: "20px", background: "#333", margin: "10px 0" }} />
    </div>
  );
}