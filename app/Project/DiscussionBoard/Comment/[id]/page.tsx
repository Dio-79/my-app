"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../../Auth/firebase";
import { useUserAuth } from "../../../Auth/auth-context";
import { useParams } from "next/navigation";

/* ================= TYPES ================= */

type CommentType = {
  id: string;
  text: string;
  userId: string;
  username: string;
  parentId: string | null;
  upvotes: string[];
  downvotes: string[];
  createdAt?: Timestamp;
};

type PostType = {
  id: string;
  title: string;
  createdBy: string;
  createdAt?: Timestamp;
  views?: number;
  locked?: boolean;
};

/* ================= PAGE ================= */

export default function ThreadPage() {
  const { user, profile } = useUserAuth();
  const params = useParams();
  const postId = params?.id as string;

  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  /* ===== LOAD POST ===== */
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      const ref = doc(db, "services", "General", "threads", postId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as Omit<PostType, "id">;

        setPost({
          ...data,
          id: snap.id,
        });

        await updateDoc(ref, {
          views: increment(1),
        });
      }
    };

    fetchPost();
  }, [postId]);

  /* ===== COMMENTS ===== */
  useEffect(() => {
    if (!postId) return;

    const q = query(
      collection(db, "services", "General", "threads", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data: CommentType[] = snap.docs.map((docSnap) => {
        const data = docSnap.data() as Omit<CommentType, "id">;

        return {
          ...data,
          id: docSnap.id,
        };
      });

      setComments(data);
    });

    return () => unsub();
  }, [postId]);

  /* ===== ADD COMMENT ===== */
  const addComment = async () => {
    if (!user || !text.trim()) return;
    if (post?.locked) return;

    await addDoc(
      collection(db, "services", "General", "threads", postId, "comments"),
      {
        text,
        userId: user.uid,
        username: profile?.username || "User",
        parentId: replyTo,
        upvotes: [],
        downvotes: [],
        createdAt: serverTimestamp(),
      }
    );

    setText("");
    setReplyTo(null);
  };

  /* ===== VOTE ===== */
  const vote = async (c: CommentType, type: "up" | "down") => {
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

    let up = [...c.upvotes];
    let down = [...c.downvotes];

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

  /* ===== TREE ===== */
  const renderComments = (parentId: string | null, depth = 0) =>
    comments
      .filter((c) => c.parentId === parentId)
      .map((c) => {
        const score = c.upvotes.length - c.downvotes.length;

        return (
          <div key={c.id} style={{ marginLeft: depth * 20 }}>
            <p>
              <strong>{c.username}</strong>: {c.text}
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => vote(c, "up")}>⬆</button>
              <span>{score}</span>
              <button onClick={() => vote(c, "down")}>⬇</button>
              <button onClick={() => setReplyTo(c.id)}>Reply</button>
            </div>

            {renderComments(c.id, depth + 1)}
          </div>
        );
      });

  if (!post) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h1>{post.title}</h1>
      <p>👁 {post.views || 0}</p>

      {!post.locked && (
        <div>
          {replyTo && <p>Replying...</p>}

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={addComment}>Post</button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {renderComments(null)}
      </div>
    </div>
  );
}