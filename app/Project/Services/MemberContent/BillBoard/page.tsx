"use client";

import { CSSProperties } from "react";

/* ================= THEME ================= */
const theme = {
  background: "#1a1a1a",
  dropdownBg: "#222222",
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
        COMMUNITY <span style={{ color: theme.textMain }}>BILLBOARD</span>
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {posts.map((post, i) => (
          <div key={i} style={cardStyle}>
            <div style={accentLineStyle} />
            <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>{post}</div>
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
  letterSpacing: "1px",
};

const cardStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
  backgroundColor: theme.dropdownBg,
  border: `1px solid ${theme.border}`,
  borderRadius: "3px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
};

const accentLineStyle: CSSProperties = {
  width: "4px",
  height: "24px",
  backgroundColor: theme.primaryRed,
  marginRight: "15px",
  borderRadius: "2px",
  flexShrink: 0,
};