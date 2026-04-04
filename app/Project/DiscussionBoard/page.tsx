"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  increment,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../Auth/firebase";

/* ================= THEME ================= */
const theme = {
  background: "#1a1a1a",
  cardBg: "#222222",
  inputBg: "#2a2a2a",
  primaryRed: "#e11d48",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
};

type Post = {
  id: string;
  title: string;
  content: string;
  likes: number;
  createdAt: number;
};

export default function DiscussionBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  /* ================= REAL-TIME FETCH ================= */
  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Post[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Post, "id">),
      }));
      // Sort by likes descending, then by recency
      const sorted = data.sort((a, b) => b.likes - a.likes || b.createdAt - a.createdAt);
      setPosts(sorted);
    });

    return () => unsubscribe(); // cleanup on unmount
  }, []);

  /* ================= CREATE POST ================= */
  const createPost = async () => {
    if (!title || !content) return;
    await addDoc(collection(db, "posts"), {
      title,
      content,
      likes: 0,
      createdAt: Date.now(),
    });
    setTitle("");
    setContent("");
    // No need to call fetchPosts because onSnapshot handles updates
  };

  /* ================= LIKE POST ================= */
  const likePost = async (id: string) => {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, { likes: increment(1) });
  };

  return (
    <div
      style={{
        backgroundColor: theme.background,
        minHeight: "100vh",
        padding: "40px 20px",
        color: theme.textMain,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <h1
          style={{
            fontSize: "1.8rem",
            borderBottom: `2px solid ${theme.primaryRed}`,
            paddingBottom: "10px",
            marginBottom: "30px",
          }}
        >
          <span style={{ color: theme.primaryRed }}>🔥</span> COMMUNITY DISCUSSIONS
        </h1>

        {/* Create Post */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            padding: "20px",
            borderRadius: "6px",
            border: `1px solid ${theme.border}`,
            marginBottom: "40px",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "1rem", color: theme.textDim }}>
            POST A NEW TOPIC
          </h3>
          <input
            placeholder="Thread Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
          />
          <button onClick={createPost} style={actionButtonStyle}>
            POST THREAD
          </button>
        </div>

        {/* Posts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} likePost={likePost} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= POST CARD COMPONENT ================= */
function PostCard({ post, likePost }: { post: Post; likePost: (id: string) => void }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...postCardStyle,
        backgroundColor: hover ? "#2a2a2a" : theme.cardBg,
      }}
    >
      <div style={{ flex: 1 }}>
        <h2
          style={{
            margin: "0 0 10px 0",
            fontSize: "1.2rem",
            color: theme.primaryRed,
          }}
        >
          {post.title}
        </h2>
        <p style={{ color: "#ccc", lineHeight: 1.5, margin: "0 0 15px 0" }}>
          {post.content}
        </p>
        <div style={{ fontSize: "0.8rem", color: theme.textDim }}>
          Posted {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          borderLeft: `1px solid ${theme.border}`,
          paddingLeft: "20px",
          marginLeft: "20px",
          minWidth: "80px",
        }}
      >
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{post.likes}</div>
        <div style={{ fontSize: "0.7rem", color: theme.textDim, marginBottom: "10px" }}>
          LIKES
        </div>
        <button
          onClick={() => likePost(post.id)}
          style={{
            ...likeButtonStyle,
            borderColor: hover ? "#ff3f5c" : theme.primaryRed,
            color: hover ? "#ff3f5c" : theme.primaryRed,
          }}
        >
          👍 LIKE
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  backgroundColor: theme.inputBg,
  border: `1px solid ${theme.border}`,
  color: "white",
  borderRadius: "6px",
  outline: "none",
  boxSizing: "border-box" as const,
};

const actionButtonStyle = {
  backgroundColor: theme.primaryRed,
  color: "white",
  border: "none",
  padding: "10px 20px",
  fontWeight: "bold" as const,
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "0.2s",
};

const postCardStyle = {
  backgroundColor: theme.cardBg,
  padding: "20px",
  border: `1px solid ${theme.border}`,
  borderRadius: "6px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  transition: "0.2s",
};

const likeButtonStyle = {
  backgroundColor: "transparent",
  border: `1px solid ${theme.primaryRed}`,
  color: theme.primaryRed,
  padding: "5px 10px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: "bold" as const,
  transition: "0.2s",
};







