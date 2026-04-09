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
} from "firebase/firestore";
import { db } from "../Auth/firebase";
import { useRouter } from "next/navigation";

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
  };

  /* ================= LIKE ================= */
  const likePost = async (id: string) => {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, { likes: increment(1) });
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* HEADER */}
        <h1 style={headerStyle}>
          <span style={{ color: theme.primaryRed }}>🔥</span> COMMUNITY DISCUSSIONS
        </h1>

        {/* TOGGLE BUTTON */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setShowCreate(!showCreate)}
            style={toggleButtonStyle}
          >
            {showCreate ? "✖ CANCEL" : "➕ NEW DISCUSSION"}
          </button>
        </div>

        {/* ✅ CREATE POST (TOGGLED) */}
        {showCreate && (
          <div style={createBoxStyle}>
            <h3 style={{ color: theme.textDim }}>POST A NEW TOPIC</h3>

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

            <button
              onClick={async () => {
                await createPost();
                setShowCreate(false); // auto close
              }}
              style={actionButtonStyle}
            >
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
  const router = useRouter();

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...postCardStyle,
        backgroundColor: hover ? "#2a2a2a" : theme.cardBg,
      }}
    >
      {/* LEFT */}
      <div style={{ flex: 1 }}>
        <h2 style={titleStyle}>{post.title}</h2>

        <p style={contentStyle}>{post.content}</p>

        <div style={dateStyle}>
          Posted {new Date(post.createdAt).toLocaleString()}
        </div>

        <button
          onClick={() =>
            router.push(`/Project/DiscussionBoard/Comment/${post.id}`)
          }
          style={commentBtn}
        >
          💬 VIEW COMMENTS
        </button>
      </div>

      {/* RIGHT */}
      <div style={rightPanel}>
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {post.likes}
        </div>
        <div style={{ fontSize: "0.7rem", color: theme.textDim }}>
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

const pageStyle = {
  backgroundColor: theme.background,
  minHeight: "100vh",
  padding: "40px 20px",
  color: theme.textMain,
};

const headerStyle = {
  fontSize: "1.8rem",
  borderBottom: `2px solid ${theme.primaryRed}`,
  paddingBottom: "10px",
  marginBottom: "30px",
};

const toggleButtonStyle = {
  backgroundColor: theme.primaryRed,
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const createBoxStyle = {
  backgroundColor: theme.cardBg,
  padding: "20px",
  borderRadius: "6px",
  border: `1px solid ${theme.border}`,
  marginBottom: "40px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  backgroundColor: theme.inputBg,
  border: `1px solid ${theme.border}`,
  color: "white",
  borderRadius: "6px",
};

const actionButtonStyle = {
  backgroundColor: theme.primaryRed,
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
};

const postCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "20px",
  border: `1px solid ${theme.border}`,
  borderRadius: "6px",
  transition: "0.2s",
};

const titleStyle = {
  color: theme.primaryRed,
  marginBottom: "10px",
};

const contentStyle = {
  color: "#ccc",
  marginBottom: "10px",
};

const dateStyle = {
  fontSize: "0.8rem",
  color: theme.textDim,
};

const rightPanel = {
  textAlign: "center" as const,
  borderLeft: `1px solid ${theme.border}`,
  paddingLeft: "20px",
  marginLeft: "20px",
  minWidth: "80px",
};

const likeButtonStyle = {
  marginTop: "10px",
  background: "transparent",
  border: `1px solid ${theme.primaryRed}`,
  padding: "5px 10px",
  cursor: "pointer",
};

const commentBtn = {
  marginTop: "10px",
  background: "none",
  border: "none",
  color: "#aaa",
  cursor: "pointer",
  fontSize: "0.8rem",
};