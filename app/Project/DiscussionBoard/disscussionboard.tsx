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
import { useUserAuth } from "../Auth/auth-context";

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
  userId?: string;
};

export   function DiscussionBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const { user } = useUserAuth();

  /* ================= REAL-TIME FETCH ================= */
  useEffect(() => {
    const q = query(collection(db, "posts"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Post[] = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<Post, "id">),
        }));

        const sorted = data.sort(
          (a, b) => b.likes - a.likes || b.createdAt - a.createdAt
        );

        setPosts(sorted);
      },
      (error) => {
        console.error("SNAPSHOT ERROR:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ================= CREATE POST ================= */
  const createPost = async () => {
    try {
      if (!title || !content) {
        alert("Fill all fields");
        return;
      }

      if (!user) {
        alert("You must be logged in to post");
        return;
      }

      await addDoc(collection(db, "posts"), {
        title,
        content,
        likes: 0,
        createdAt: Date.now(),
        userId: user.uid,
      });

      setTitle("");
      setContent("");
      setShowCreate(false);
    } catch (err) {
      console.error("CREATE POST ERROR:", err);
      alert("Permission denied or Firebase error");
    }
  };

  /* ================= LIKE ================= */
  const likePost = async (id: string) => {
    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, { likes: increment(1) });
    } catch (err) {
      console.error("LIKE ERROR:", err);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* HEADER */}
        <h1 style={headerStyle}>
          <span style={{ color: theme.primaryRed }}>🔥</span> COMMUNITY DISCUSSIONS
        </h1>

        {/* RED CREATE BUTTON */}
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={createBtn}
        >
          {showCreate ? "✖ CANCEL" : "➕ NEW DISCUSSION"}
        </button>

        {/* CREATE BOX */}
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

      <div style={rightPanel}>
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {post.likes}
        </div>

        <div style={{ fontSize: "0.7rem", color: theme.textDim }}>
          LIKES
        </div>

        <button
          onClick={() => likePost(post.id)}
          style={likeBtn}
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
  padding: "12px",
  marginBottom: "10px",
  backgroundColor: theme.inputBg,
  border: `1px solid ${theme.border}`,
  color: "white",
  borderRadius: "6px",
};

const postBtn = {
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
};

const titleStyle = {
  color: theme.primaryRed,
};

const contentStyle = {
  color: "#ccc",
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
};

const likeBtn = {
  marginTop: "10px",
  background: "transparent",
  border: `1px solid ${theme.primaryRed}`,
  color: theme.primaryRed,
  padding: "5px 10px",
  cursor: "pointer",
};

const commentBtn = {
  marginTop: "10px",
  background: "none",
  border: "none",
  color: "#aaa",
  cursor: "pointer",
};