"use client";

import { CSSProperties } from "react";

/* ================= THEME ================= */
const theme = {
  background: "#1a1a1a",
  cardBg: "#222222",
  border: "#333",
  textMain: "#ffffff",
  primaryRed: "#e11d48",
};

/* ================= DATA ================= */
const posts = [
  "🔥 New tournament announced!",
  "🎮 Top players this week",
  "🚀 Join our esports team",
];

/* ================= PAGE ================= */
export default function BillboardPage() {
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>
        COMMUNITY <span style={{ color: "white" }}>BILLBOARD</span>
      </h1>

      <div style={listStyle}>
        {posts.map((post, i) => (
          <div key={i} style={cardStyle}>
            <div style={accentStyle} />
            <span>{post}</span>
          </div>
        ))}
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

const titleStyle: CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: "bold",
  color: theme.primaryRed,
  borderBottom: `2px solid ${theme.border}`,
  paddingBottom: "15px",
  marginBottom: "30px",
  textTransform: "uppercase",
};

const listStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const cardStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
  backgroundColor: theme.cardBg,
  border: `1px solid ${theme.border}`,
  borderRadius: "4px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
};

const accentStyle: CSSProperties = {
  width: "4px",
  height: "24px",
  backgroundColor: theme.primaryRed,
  marginRight: "15px",
  borderRadius: "2px",
};