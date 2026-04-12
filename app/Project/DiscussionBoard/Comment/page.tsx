"use client";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../Auth/firebase";
import { useUserAuth } from "../../Auth/auth-context";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ================= TYPES ================= */

interface Thread {
  id: string;
  title: string;
  createdBy: string;
  createdById: string;
  isPinned: boolean;
  createdAt?: Timestamp;
  views?: number;
}

/* ================= MAIN ================= */

export default function DiscussionBoard() {
  const { user, profile } = useUserAuth();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [newThread, setNewThread] = useState("");

  const topic = "General";

  useEffect(() => {
    const q = query(
      collection(db, "services", topic, "threads"),
      orderBy("isPinned", "desc"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data: Thread[] = snap.docs.map((docSnap) => {
        const data = docSnap.data() as Omit<Thread, "id">;

        return {
          ...data,
          id: docSnap.id,
        };
      });

      setThreads(data);
    });

    return () => unsub();
  }, []);

  const createThread = async () => {
    if (!user || !newThread.trim()) return;

    await addDoc(collection(db, "services", topic, "threads"), {
      title: newThread,
      createdBy: profile?.username || "Anonymous",
      createdById: user.uid,
      isPinned: false,
      createdAt: serverTimestamp(),
      views: 0,
    });

    setNewThread("");
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>🧵 Discussion Board</h1>

      {user && (
        <div style={{ marginBottom: 20 }}>
          <input
            value={newThread}
            onChange={(e) => setNewThread(e.target.value)}
            placeholder="Create thread..."
          />
          <button onClick={createThread}>Post</button>
        </div>
      )}

      {threads.map((t) => (
        <Link key={t.id} href={`/Project/DiscussionBoard/Comment/${t.id}`}>
          <div
            style={{
              border: "1px solid #333",
              padding: "15px",
              marginTop: "10px",
              cursor: "pointer",
              background: "#1f1f1f",
            }}
          >
            <h3>
              {t.isPinned && "📌"} {t.title}
            </h3>
            <p style={{ fontSize: 12, color: "#aaa" }}>
              by {t.createdBy} • 👁 {t.views || 0}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}