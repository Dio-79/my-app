"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
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
  createdAt: Timestamp;
};

type PostType = {
  id: string;
  text: string;
  userId: string;
  username: string;
  createdAt: Timestamp;
};

/* ================= PAGE ================= */
export default function CommentPage() {
  const { user, profile } = useUserAuth();
  const params = useParams();
  const postId = params?.id as string;

  const [comments, setComments] = useState<CommentType[]>([]);
  const [text, setText] = useState("");

  /* ===== REAL-TIME COMMENTS ===== */
  useEffect(() => {
    if (!postId) return;

    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: CommentType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<CommentType, "id">),
      }));
      setComments(data);
    });

    return () => unsubscribe();
  }, [postId]);

  /* ===== ADD COMMENT ===== */
  const addComment = async (parentId: string | null = null) => {
    if (!user || !text.trim()) return;

    await addDoc(collection(db, "posts", postId, "comments"), {
      text,
      userId: user.uid,
      username: profile?.username || "Anonymous",
      parentId,
      createdAt: Timestamp.now(),
    });

    setText("");
  };

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h1>Comments</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
      />
      <button onClick={() => addComment(null)}>Comment</button>

      <CommentTree
        comments={comments}
        parentId={null}
        onReply={addComment}
      />
    </div>
  );
}

/* ================= COMMENT TREE ================= */
function CommentTree({
  comments,
  parentId,
  onReply,
}: {
  comments: CommentType[];
  parentId: string | null;
  onReply: (parentId: string | null) => void;
}) {
  return (
    <div style={{ marginLeft: parentId ? 20 : 0 }}>
      {comments
        .filter((c) => c.parentId === parentId)
        .map((c) => (
          <div
            key={c.id}
            style={{
              marginTop: 10,
              borderLeft: "2px solid #333",
              paddingLeft: 10,
            }}
          >
            <p>
              <strong>{c.username}</strong>: {c.text}
            </p>

            <button onClick={() => onReply(c.id)}>Reply</button>

            <CommentTree
              comments={comments}
              parentId={c.id}
              onReply={onReply}
            />
          </div>
        ))}
    </div>
  );
}