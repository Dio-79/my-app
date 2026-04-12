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
  where,
  DocumentData,
} from "firebase/firestore";
import { db } from "../Auth/firebase";
import { useUserAuth } from "../Auth/auth-context";
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

/* ================= TYPES ================= */

type UserInfo = {
  name?: string;
  photoURL?: string;
};

type Post = {
  id: string;
  title: string;
  content: string;
  topic: string;
  likes: number;
  createdAt: number;
  userId?: string;
};

/* ================= MAIN ================= */

export function DiscussionBoard({ topic }: { topic: string }) {
  const { user, profile } = useUserAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  /* ================= REAL-TIME POSTS ================= */
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("topic", "==", topic)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Post[] = snapshot.docs.map((docItem) => {
        const d = docItem.data() as DocumentData;

        return {
          id: docItem.id,
          title: d.title,
          content: d.content,
          topic: d.topic,
          likes: d.likes ?? 0,
          createdAt: d.createdAt ?? 0,
          userId: d.userId,
        };
      });

      const sorted = data.sort(
        (a, b) => b.likes - a.likes || b.createdAt - a.createdAt
      );

      setPosts(sorted);
    });

    return () => unsubscribe();
  }, [topic]);

  /* ================= CREATE POST ================= */
  const createPost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Fill all fields");
      return;
    }

    if (!user) {
      alert("Login required");
      return;
    }

    await addDoc(collection(db, "posts"), {
      title,
      content,
      topic,
      likes: 0,
      createdAt: Date.now(),
      userId: user.uid,
      user: {
        name: profile?.username || "User",
        photoURL: profile?.photoURL || "/default-avatar.png",
      },
    });

    setTitle("");
    setContent("");
    setShowCreate(false);
  };

  /* ================= LIKE ================= */
  const likePost = async (id: string) => {
    await updateDoc(doc(db, "posts", id), {
      likes: increment(1),
    });
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={headerStyle}>
          🔥 {topic} DISCUSSIONS
        </h1>

        <button onClick={() => setShowCreate(!showCreate)} style={createBtn}>
          {showCreate ? "✖ CANCEL" : "➕ NEW THREAD"}
        </button>

        {showCreate && (
          <div style={createBoxStyle}>
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

            <button onClick={createPost} style={postBtn}>
              POST THREAD
            </button>
          </div>
        )}

        {/* THREAD LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {posts.map((post) => (
            <ThreadCard
              key={post.id}
              post={post}
              likePost={likePost}
              onClick={() => router.push(`/Project/DiscussionBoard/${post.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= THREAD CARD ================= */

function ThreadCard({
  post,
  likePost,
  onClick,
}: {
  post: Post;
  likePost: (id: string) => void;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...postCardStyle,
        backgroundColor: hover ? "#2a2a2a" : theme.cardBg,
        cursor: "pointer",
      }}
    >
      {/* LEFT CONTENT */}
      <div style={{ flex: 1 }}>
        <h2 style={titleStyle}>{post.title}</h2>

        <p style={contentStyle}>
          {post.content.slice(0, 120)}...
        </p>

        <div style={dateStyle}>
          {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={rightPanel}>
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {post.likes}
        </div>

        <div style={{ fontSize: "0.7rem", color: theme.textDim }}>
          LIKES
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 prevent navigation
            likePost(post.id);
          }}
          style={likeBtn}
        >
          👍
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
  marginBottom: "20px",
};

const createBtn = {
  backgroundColor: theme.primaryRed,
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  marginBottom: "20px",
};

const createBoxStyle = {
  backgroundColor: theme.cardBg,
  padding: "20px",
  borderRadius: "6px",
  border: `1px solid ${theme.border}`,
  marginBottom: "30px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  backgroundColor: theme.inputBg,
  border: `1px solid ${theme.border}`,
  color: "white",
};

const postBtn = {
  backgroundColor: theme.primaryRed,
  color: "white",
  border: "none",
  padding: "10px",
  cursor: "pointer",
};

const postCardStyle = {
  display: "flex",
  padding: "20px",
  border: `1px solid ${theme.border}`,
  borderRadius: "6px",
  transition: "0.2s",
};

const titleStyle = {
  color: theme.primaryRed,
  marginBottom: "5px",
};

const contentStyle = {
  color: "#ccc",
  fontSize: "0.9rem",
};

const dateStyle = {
  fontSize: "0.75rem",
  color: theme.textDim,
  marginTop: "5px",
};

const rightPanel = {
  textAlign: "center" as const,
  borderLeft: `1px solid ${theme.border}`,
  paddingLeft: "20px",
};

const likeBtn = {
  marginTop: "10px",
  border: `1px solid ${theme.primaryRed}`,
  color: theme.primaryRed,
  background: "transparent",
  cursor: "pointer",
  padding: "5px 8px",
};