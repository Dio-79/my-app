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

type Comment = {
  id: string;
  text: string;
  createdAt: number;
  user?: UserInfo;
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
          <span style={{ color: theme.primaryRed }}>🔥</span> {topic} DISCUSSIONS
        </h1>

        <button onClick={() => setShowCreate(!showCreate)} style={createBtn}>
          {showCreate ? "✖ CANCEL" : "➕ NEW DISCUSSION"}
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
  const { user, profile } = useUserAuth();

  const [hover, setHover] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  /* ================= REAL-TIME COMMENTS ================= */
  useEffect(() => {
    if (!showComments) return;

    const q = query(collection(db, "posts", post.id, "comments"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Comment[] = snapshot.docs.map((docItem) => {
        const d = docItem.data() as DocumentData;

        return {
          id: docItem.id,
          text: d.text ?? "",
          createdAt: d.createdAt ?? 0,
          user: d.user,
        };
      });

      setComments(data);
    });

    return () => unsubscribe();
  }, [showComments, post.id]);

  /* ================= ADD COMMENT ================= */
  const addComment = async () => {
    if (!text.trim()) return;
    if (!user) return alert("Login required");

    await addDoc(collection(db, "posts", post.id, "comments"), {
      text,
      createdAt: Date.now(),
      user: {
        name: profile?.username || "User",
        photoURL: profile?.photoURL || "/default-avatar.png",
      },
    });

    setText("");
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...postCardStyle,
        backgroundColor: hover ? "#2a2a2a" : theme.cardBg,
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <h2 style={titleStyle}>{post.title}</h2>
          <p style={contentStyle}>{post.content}</p>

          <div style={dateStyle}>
            {new Date(post.createdAt).toLocaleString()}
          </div>

          <button
            onClick={() => setShowComments(!showComments)}
            style={commentBtn}
          >
            💬 {showComments ? "HIDE COMMENTS" : "VIEW COMMENTS"}
          </button>
        </div>

        <div style={rightPanel}>
          <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            {post.likes}
          </div>

          <div style={{ fontSize: "0.7rem", color: theme.textDim }}>
            LIKES
          </div>

          <button onClick={() => likePost(post.id)} style={likeBtn}>
            👍 LIKE
          </button>
        </div>
      </div>

      {showComments && (
        <div style={commentBox}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            style={inputStyle}
          />

          <button onClick={addComment}>Add Comment</button>

          {comments.map((c) => (
            <div key={c.id} style={commentItem}>
              <strong>{c.user?.name || "User"}</strong>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      )}
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
};

const titleStyle = { color: theme.primaryRed };
const contentStyle = { color: "#ccc" };
const dateStyle = { fontSize: "0.8rem", color: theme.textDim };

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
};

const commentBtn = {
  marginTop: "10px",
  background: "none",
  border: "none",
  color: "#aaa",
  cursor: "pointer",
};

const commentBox = {
  marginTop: "15px",
  padding: "15px",
  background: "#181818",
  borderRadius: "6px",
};

const commentItem = {
  padding: "10px",
  borderBottom: `1px solid ${theme.border}`,
};