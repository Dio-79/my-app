"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../Auth/firebase";

type Post = {
  id: string;
  title: string;
  content: string;
};

/* ================= THEME ================= */
const THEME = {
  background: "#1a1a1a",
  cardBg: "#222222",
  primaryRed: "#e11d48",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
  inputBg: "#111",
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "posts"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, "id">),
        }));
        setPosts(data);
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter logic
  const filtered = posts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🔍 SEARCH</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={inputStyle}
        />
      </div>

      <p style={textStyle}>
        {searchQuery 
          ? `Found ${filtered.length} result${filtered.length === 1 ? "" : "s"} for "${searchQuery}"`
          : "Showing all posts"}
      </p>

      {loading ? (
        <p style={{ color: THEME.textDim }}>Initializing database...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {filtered.length > 0 ? (
            filtered.map(post => (
              <div key={post.id} style={cardStyle}>
                <h3 style={{ color: THEME.primaryRed, marginTop: 0 }}>{post.title}</h3>
                <p style={{ color: THEME.textMain, margin: 0, fontSize: "0.9rem" }}>{post.content}</p>
              </div>
            ))
          ) : (
            <div style={emptyStateStyle}>
              No matches found for your search.
            </div>
          )}
        </div>
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
  marginBottom: "20px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "500px",
  padding: "12px 16px",
  backgroundColor: THEME.inputBg,
  border: `1px solid ${THEME.border}`,
  borderRadius: "4px",
  color: THEME.textMain,
  fontSize: "1rem",
  outline: "none",
};

const textStyle: React.CSSProperties = {
  color: THEME.textDim,
  fontSize: "0.85rem",
  marginBottom: "20px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: THEME.cardBg,
  border: `1px solid ${THEME.border}`,
  borderRadius: "4px",
  padding: "20px",
  transition: "transform 0.1s ease",
};

const emptyStateStyle: React.CSSProperties = {
  padding: "40px",
  textAlign: "center",
  color: THEME.textDim,
  border: `1px dashed ${THEME.border}`,
  borderRadius: "4px",
};