"use client";

import { CSSProperties } from "react";

/* ================= THEME ================= */
const theme = {
  background: "#1a1a1a",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
  primaryRed: "#e11d48",
};

type TrophyRank = "gold" | "silver" | "bronze";

const trophyColors: Record<TrophyRank, string> = {
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
};

export default function TrophiesPage() {
  const trophies = [
    { name: "Top Player", year: 2025, rank: "gold" },
    { name: "Best Team", year: 2024, rank: "silver" },
    { name: "MVP Award", year: 2023, rank: "bronze" }
  ];

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>
        ACHIEVEMENT <span style={{ color: "white" }}>TROPHIES</span>
      </h1>

      <div style={gridStyle}>
        {trophies.map((t, i) => (
          <div key={i} style={cardStyle}>
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "10px",
                color: trophyColors[t.rank as TrophyRank],
              }}
            >
              🏆
            </div>

            <div style={nameStyle}>{t.name.toUpperCase()}</div>

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
  letterSpacing: "1px",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px",
};

const cardStyle: CSSProperties = {
  textAlign: "center",
  padding: "25px",
  backgroundColor: "#222",
  border: `1px solid ${theme.border}`,
  borderBottom: `3px solid ${theme.border}`,
  borderRadius: "4px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
};

const nameStyle: CSSProperties = {
  fontWeight: "bold",
  fontSize: "1.1rem",
  marginBottom: "5px",
};

const yearStyle: CSSProperties = {
  color: theme.textDim,
  fontSize: "0.85rem",
};