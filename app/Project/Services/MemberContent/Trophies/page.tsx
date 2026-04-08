"use client";

import { CSSProperties } from "react";

/* ================= THEME ================= */
const theme = {
  background: "#1a1a1a",
  cardBg: "#222",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
  primaryRed: "#e11d48",
};

/* ================= DATA ================= */
const trophies = [
  { name: "Top Player", year: 2025 },
  { name: "Best Team", year: 2024 },
  { name: "MVP Award", year: 2023 },
];

/* ================= PAGE ================= */
export default function TrophiesPage() {
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>
        ACHIEVEMENT <span style={{ color: "white" }}>TROPHIES</span>
      </h1>

      <div style={gridStyle}>
        {trophies.map((t, i) => (
          <div key={i} style={cardStyle}>
            <div style={iconStyle}>🏆</div>
            <div style={nameStyle}>{t.name}</div>
            <div style={yearStyle}>Awarded: {t.year}</div>
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

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px",
};

const cardStyle: CSSProperties = {
  textAlign: "center",
  padding: "25px",
  backgroundColor: theme.cardBg,
  border: `1px solid ${theme.border}`,
  borderRadius: "4px",
};

const iconStyle: CSSProperties = {
  fontSize: "2rem",
  marginBottom: "10px",
};

const nameStyle: CSSProperties = {
  fontWeight: "bold",
  fontSize: "1.1rem",
};

const yearStyle: CSSProperties = {
  color: theme.textDim,
  fontSize: "0.85rem",
};