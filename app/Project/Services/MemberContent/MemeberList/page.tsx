"use client";

/* ================= THEME ================= */
const theme = {
  background: "#1a1a1a",
  border: "#333",
  textMain: "#ffffff",
  primaryRed: "#e11d48", // 
};

/* ================= PAGE ================= */
export default function MemberListPage() {
  const members = ["PlayerOne", "ProGamer", "NoScopeKing"];

  return (
    <div style={pageStyle}>
      <h1
        style={{
          ...titleStyle,
          borderBottom: `2px solid ${theme.primaryRed}`,
          paddingBottom: "10px",
        }}
      >
        MEMBER LIST
      </h1>

      {members.map((m, i) => (
        <div key={i} style={cardStyle}>
          <span style={{ color: theme.primaryRed, marginRight: "10px" }}>
            ●
          </span>
          {m}
        </div>
      ))}
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
  fontSize: "1.2rem",
  marginBottom: "20px",
  fontWeight: "bold",
};

const cardStyle = {
  padding: "15px 20px",
  backgroundColor: "#222",
  border: `1px solid ${theme.border}`,
  marginBottom: "8px",
  borderRadius: "3px",
  display: "flex",
  alignItems: "center",
};