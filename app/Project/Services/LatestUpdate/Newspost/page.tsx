"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../Auth/firebase";

type Post = {
  id: string;
  title: string;
  content: string;
  likes: number;
  createdAt: number;
};

/* ================= THEME (Consistent with your Member UI) ================= */
const THEME = {
  background: "#1a1a1a",
  cardBg: "#222222",
  primaryRed: "#e11d48",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
};

export default function NewPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 🆕 Query Firestore to sort by 'createdAt' descending (newest first)
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const data: Post[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, "id">),
        }));

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div style={{ color: THEME.textDim, padding: "20px" }}>Loading latest updates...</div>;
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🆕 NEW POSTS</h1>
      <p style={textStyle}>Here are the latest posts from the community.</p>

      {posts.length === 0 ? (
        <p style={{ color: THEME.textDim }}>No posts found.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} style={cardStyle}>
            <h3 style={{ color: THEME.primaryRed, margin: "0 0 10px 0" }}>{post.title}</h3>
            <p style={{ color: THEME.textMain, lineHeight: "1.5" }}>{post.content}</p>
            <div style={metaStyle}>
              <span>❤️ {post.likes}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle: React.CSSProperties = {
  backgroundColor: THEME.background,
  minHeight: "100vh",
  padding: "40px 20px",
  fontFamily: "sans-serif",
};

const titleStyle: React.CSSProperties = {
  color: THEME.textMain,
  fontSize: "1.5rem",
  fontWeight: "bold",
  letterSpacing: "1px",
  marginBottom: "5px",
};

const textStyle: React.CSSProperties = {
  color: THEME.textDim,
  marginBottom: "30px",
  fontSize: "0.9rem",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: THEME.cardBg,
  border: `1px solid ${THEME.border}`,
  borderRadius: "4px",
  padding: "20px",
  marginBottom: "15px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const metaStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "15px",
  paddingTop: "10px",
  borderTop: `1px solid ${THEME.border}`,
  fontSize: "0.75rem",
  color: THEME.textDim,
};