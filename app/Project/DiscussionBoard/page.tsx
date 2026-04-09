"use client";

import { useEffect, useState, CSSProperties } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  increment,
  onSnapshot,
  query,
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

/* ================= TYPES ================= */
type Post = {
  id: string;
  title: string;
  content: string;
  likes: number;
  createdAt: number;
};

/* ================= MAIN COMPONENT ================= */
export function DiscussionBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  /* ================= REAL-TIME FETCH ================= */
  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Post[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Post, "id">),
      }));
      const sorted = data.sort(
        (a, b) => b.likes - a.likes || b.createdAt - a.createdAt
      );
      setPosts(sorted);
    });
    return () => unsubscribe();
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
    setShowCreate(false);
  };

  /* ================= LIKE ================= */
  const likePost = async (id: string) => {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, { likes: increment(1) });
  };

  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>
        <span style={{ color: theme.primaryRed }}>🔥</span> COMMUNITY DISCUSSIONS
      </h1>

      {/* TOGGLE BUTTON */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={toggleButtonStyle}
        >
          {showCreate ? "✖ Cancel" : "➕ New Discussion"}
        </button>
      </div>

      {/* CREATE POST */}
      {showCreate && (
        <div style={createBoxStyle}>
          <h3 style={{ color: theme.textDim }}>Post a New Discussion</h3>
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
            style={{ ...inputStyle, minHeight: "100px" }}
          />
          <button onClick={createPost} style={actionButtonStyle}>
            POST THREAD
          </button>
        </div>
      )}

      {/* POSTS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} likePost={likePost} />
        ))}
      </div>
    </div>
  );
}

/* ================= POST CARD ================= */
function PostCard({
  post,
  likePost,
}: {
  post: Post;
  likePost: (id: string) => void;
}) {
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
        <h2 style={titleStyle}>{post.title}</h2>
        <p style={contentStyle}>{post.content}</p>
        <div style={dateStyle}>
          Posted {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>

      <div style={rightPanel}>
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{post.likes}</div>
        <div style={{ fontSize: "0.7rem", color: theme.textDim }}>LIKES</div>
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
const pageStyle: CSSProperties = {
  backgroundColor: theme.background,
  minHeight: "100vh",
  padding: "40px",
  color: theme.textMain,
  fontFamily: "sans-serif",
};

const headerStyle: CSSProperties = {
  fontSize: "1.8rem",
  borderBottom: `2px solid ${theme.primaryRed}`,
  paddingBottom: "10px",
  marginBottom: "30px",
};

const toggleButtonStyle: CSSProperties = {
  backgroundColor: theme.primaryRed,
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const createBoxStyle: CSSProperties = {
  backgroundColor: theme.cardBg,
  padding: "20px",
  borderRadius: "6px",
  border: `1px solid ${theme.border}`,
  marginBottom: "40px",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  backgroundColor: theme.inputBg,
  border: `1px solid ${theme.border}`,
  color: "white",
  borderRadius: "6px",
};

const actionButtonStyle: CSSProperties = {
  backgroundColor: theme.primaryRed,
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
};

const postCardStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "20px",
  border: `1px solid ${theme.border}`,
  borderRadius: "6px",
  transition: "0.2s",
};

const titleStyle: CSSProperties = { color: theme.primaryRed, marginBottom: "10px" };
const contentStyle: CSSProperties = { color: "#ccc", marginBottom: "10px" };
const dateStyle: CSSProperties = { fontSize: "0.8rem", color: theme.textDim };
const rightPanel: CSSProperties = {
  textAlign: "center",
  borderLeft: `1px solid ${theme.border}`,
  paddingLeft: "20px",
  marginLeft: "20px",
  minWidth: "80px",
};
const likeButtonStyle: CSSProperties = {
  marginTop: "10px",
  background: "transparent",
  border: `1px solid ${theme.primaryRed}`,
  padding: "5px 10px",
  cursor: "pointer",
};