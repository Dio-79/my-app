"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../Auth/firebase";

/* ================= TYPES ================= */
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
};

/* ================= PAGE ================= */
export default function SearchPage() {
  const [queryText, setQueryText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "posts"));

        const data: Post[] = snapshot.docs.map((doc) => {
          const docData = doc.data() as Omit<Post, "id">;

          return {
            id: doc.id,
            title: docData.title || "",
            content: docData.content || "",
          };
        });

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(queryText.toLowerCase()) ||
      p.content.toLowerCase().includes(queryText.toLowerCase())
  );

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🔍 SEARCH</h1>

      <input
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
        placeholder="Search..."
        style={inputStyle}
      />

      {filtered.length === 0 ? (
        <p style={{ color: "#aaa" }}>No results found.</p>
      ) : (
        filtered.map((p) => (
          <div key={p.id} style={cardStyle}>
            <h3 style={{ color: THEME.primaryRed }}>{p.title}</h3>
            <p>{p.content}</p>
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
  padding: "40px",
  color: THEME.textMain,
  fontFamily: "sans-serif",
};

const titleStyle: React.CSSProperties = {
  color: THEME.primaryRed,
  marginBottom: "20px",
};

const inputStyle: React.CSSProperties = {
  padding: "12px",
  width: "100%",
  marginBottom: "20px",
  backgroundColor: "#111",
  border: `1px solid ${THEME.border}`,
  color: "white",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: THEME.cardBg,
  padding: "15px",
  marginBottom: "10px",
  border: `1px solid ${THEME.border}`,
};