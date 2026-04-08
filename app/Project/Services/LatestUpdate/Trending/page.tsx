"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../Auth/firebase";

/* ================= TYPES ================= */
type Post = {
  id: string;
  title: string;
  content: string;
  likes: number;
};

/* ================= THEME ================= */
const THEME = {
  background: "#1a1a1a",
  cardBg: "#222222",
  primaryRed: "#e11d48",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
};

/* ================= PAGE ================= */
export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // 🔥 Sort by MOST LIKES (Trending logic)
        const ref = collection(db, "posts");
        const q = query(ref, orderBy("likes", "desc"));

        const snapshot = await getDocs(q);

        const data: Post[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, "id">),
        }));

        setPosts(data);
      } catch (err) {
        console.error("Trending fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", color: THEME.textDim }}>
        Loading trending posts...
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🔥 TRENDING POSTS</h1>

      {posts.length === 0 ? (
        <p style={{ color: THEME.textDim }}>No trending posts yet.</p>
      ) : (
        posts.map((post, index) => (
          <div key={post.id} style={cardStyle}>
            {/* Rank Badge */}
            <div style={rankStyle}>#{index + 1}</div>

            <div style={{ flex: 1 }}>
              <h3 style={postTitleStyle}>{post.title}</h3>
              <p style={postContentStyle}>{post.content}</p>

              <div style={metaStyle}>
                ❤️ {post.likes} likes
              </div>
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
  marginBottom: "25px",
};

const cardStyle: React.CSSProperties = {
  display: "flex",
  gap: "15px",
  backgroundColor: THEME.cardBg,
  border: `1px solid ${THEME.border}`,
  borderRadius: "4px",
  padding: "20px",
  marginBottom: "15px",
  alignItems: "flex-start",
};

const rankStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: THEME.primaryRed,
  minWidth: "30px",
};

const postTitleStyle: React.CSSProperties = {
  margin: "0 0 10px 0",
  color: THEME.primaryRed,
};

const postContentStyle: React.CSSProperties = {
  margin: 0,
  color: THEME.textMain,
  fontSize: "0.9rem",
  lineHeight: "1.5",
};

const metaStyle: React.CSSProperties = {
  marginTop: "10px",
  fontSize: "0.75rem",
  color: THEME.textDim,
};