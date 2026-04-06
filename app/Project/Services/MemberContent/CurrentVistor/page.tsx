"use client";

/* ================= THEME ================= */
const theme = {
  background: "#1a1a1a",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
  primaryRed: "#e11d48",
};

export default function CurrentVisitorPage() {
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>
        CURRENT <span style={{ color: "white" }}>VISITORS</span>
      </h1>
      
      <div style={infoBoxStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <span style={{ color: theme.primaryRed, fontSize: "1.2rem" }}>ℹ</span>
          <p style={{ margin: 0, fontWeight: "500" }}>
            You are currently browsing as a guest or logged-in user.
          </p>
        </div>

        <p style={{ color: theme.textDim, fontSize: "0.85rem", margin: 0 }}>
          Total members online: 1,240 | Guests: 3,502
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle = {
  backgroundColor: theme.background,
  minHeight: "100vh",
  padding: "40px",
  color: theme.textMain,
  fontFamily: "sans-serif",
};

const titleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: theme.primaryRed,
  letterSpacing: "1px",
  borderBottom: `2px solid ${theme.border}`,
  paddingBottom: "15px",
  marginBottom: "30px",
  textTransform: "uppercase",
};

const infoBoxStyle = {
  backgroundColor: "#222",
  borderLeft: `3px solid ${theme.primaryRed}`,
  padding: "20px",
  borderRadius: "3px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
};