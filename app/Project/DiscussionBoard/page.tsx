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
import { useUserAuth } from "../Auth/auth-context"; // ✅ NEW

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
  dislikes: number; 
  username: string; 
  photoURL: string; 
  createdAt: number;
};

/* ================= MAIN COMPONENT ================= */
export function DiscussionBoard() {
  const { user, profile } = useUserAuth(); // ✅ NEW

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
        (a, b) =>
          (b.likes - (b.dislikes || 0)) -
          (a.likes - (a.dislikes || 0)) ||
          b.createdAt - a.createdAt
      );

      setPosts(sorted);
    });

    return () => unsubscribe();
  }, []);

  /* ================= CREATE POST (UPDATED 🔥) ================= */
  const createPost = async () => {
    if (!title || !content || !user || !profile) return;

    await addDoc(collection(db, "posts"), {
      title,
      content,
      likes: 0,
      dislikes: 0, // ✅ NEW
      userId: user.uid,
      username: profile.username, // ✅ NEW
      photoURL: profile.photoURL, // ✅ NEW
      createdAt: Date.now(),
    });

    setTitle("");
    setContent("");
    setShowCreate(false);
  };

  /* ================= VOTING ================= */
  const votePost = async (id: string, type: "like" | "dislike") => {
    const postRef = doc(db, "posts", id);

    await updateDoc(postRef, {
      [type === "like" ? "likes" : "dislikes"]: increment(1),
    });
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
          <PostCard key={post.id} post={post} votePost={votePost} />
        ))}
      </div>
    </div>
  );
}

/* ================= POST CARD ================= */
function PostCard({
  post,
  votePost,
}: {
  post: Post;
  votePost: (id: string, type: "like" | "dislike") => void;
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
        {/* ✅ USER INFO */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <img
            src={post.photoURL}
            width={35}
            height={35}
            style={{ borderRadius: "50%" }}
          />
          <span style={{ fontSize: "0.85rem", color: theme.textDim }}>
            {post.username}
          </span>
        </div>

        <h2 style={titleStyle}>{post.title}</h2>
        <p style={contentStyle}>{post.content}</p>

        <div style={dateStyle}>
          Posted {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={rightPanel}>
        <div style={{ fontSize: "1.1rem" }}>
          👍 {post.likes} | 👎 {post.dislikes || 0}
        </div>

        <button
          onClick={() => votePost(post.id, "like")}
          style={likeButtonStyle}
        >
          👍
        </button>

        <button
          onClick={() => votePost(post.id, "dislike")}
          style={dislikeButtonStyle}
        >
          👎
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
};

const titleStyle: CSSProperties = {
  color: theme.primaryRed,
  marginBottom: "10px",
};

const contentStyle: CSSProperties = {
  color: "#ccc",
};

const dateStyle: CSSProperties = {
  fontSize: "0.8rem",
  color: theme.textDim,
};

const rightPanel: CSSProperties = {
  textAlign: "center",
  borderLeft: `1px solid ${theme.border}`,
  paddingLeft: "20px",
  marginLeft: "20px",
};

const likeButtonStyle: CSSProperties = {
  marginTop: "10px",
  background: "transparent",
  border: "1px solid #22c55e",
  color: "#22c55e",
  padding: "5px 10px",
  cursor: "pointer",
};

const dislikeButtonStyle: CSSProperties = {
  marginTop: "5px",
  background: "transparent",
  border: "1px solid #ef4444",
  color: "#ef4444",
  padding: "5px 10px",
  cursor: "pointer",
};