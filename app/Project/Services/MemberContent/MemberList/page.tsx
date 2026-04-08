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

/* ================= TYPES ================= */
interface Member {
  id: number;
  username: string;
}

/* ================= PAGE ================= */
export default function MemberListPage() {
  const members: Member[] = [
    { id: 1, username: "PlayerOne" },
    { id: 2, username: "ProGamer" },
    { id: 3, username: "NoScopeKing" },
    { id: 4, username: "EliteSniper" },
  ];

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>
        MEMBER <span style={{ color: "white" }}>LIST</span>
      </h1>

      <div style={listContainer}>
        {members.map((member) => (
          <div key={member.id} style={cardStyle}>
            <span style={dotStyle}>●</span>
            <span>{member.username}</span>
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

const listContainer: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const cardStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "15px 20px",
  backgroundColor: "#222",
  border: `1px solid ${theme.border}`,
  borderRadius: "4px",
  transition: "0.2s",
};

const dotStyle: CSSProperties = {
  color: theme.primaryRed,
  marginRight: "10px",
};