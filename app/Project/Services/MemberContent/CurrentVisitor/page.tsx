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

/* ================= PAGE ================= */
export default function CurrentVisitorPage() {
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>
        CURRENT <span style={{ color: "white" }}>VISITORS</span>
      </h1>

      <div style={infoBoxStyle}>
        <div style={rowStyle}>
          <span style={iconStyle}>ℹ</span>
          <p style={{ margin: 0 }}>
            You are currently browsing as a guest or logged-in user.
          </p>
        </div>

        <p style={subTextStyle}>
          Total members online: <b>1,240</b> | Guests: <b>3,502</b>
        </p>
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
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: theme.primaryRed,
  borderBottom: `2px solid ${theme.border}`,
  paddingBottom: "15px",
  marginBottom: "30px",
  textTransform: "uppercase",
};

const infoBoxStyle: CSSProperties = {
  backgroundColor: "#222",
  borderLeft: `3px solid ${theme.primaryRed}`,
  padding: "20px",
  borderRadius: "4px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
};

const iconStyle: CSSProperties = {
  color: theme.primaryRed,
  fontSize: "1.2rem",
};

const subTextStyle: CSSProperties = {
  color: theme.textDim,
  fontSize: "0.85rem",
  margin: 0,
};