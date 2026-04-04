"use client";

/* ================= THEME ================= */
const theme = {
  background: "#1a1a1a",
  border: "#333",
  textMain: "#ffffff",
  primaryRed: "#e11d48",
};

export default function BillboardPage() {
  const posts = [
    "🔥 New tournament announced!",
    "🎮 Top players this week",
    "🚀 Join our esports team"
  ];

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>
        COMMUNITY <span style={{ color: "white" }}>BILLBOARD</span>
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {posts.map((post, i) => (
          <div key={i} style={cardStyle}>
            <div style={iconContainerStyle}>
              <div style={accentLineStyle} />
            </div>

            <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
              {post}
            </div>
          </div>
        ))}
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
  fontSize: "1.4rem",
  fontWeight: "bold",
  color: theme.primaryRed,
  borderBottom: `2px solid ${theme.border}`,
  paddingBottom: "15px",
  marginBottom: "30px",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const cardStyle = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
  backgroundColor: "#222",
  border: `1px solid ${theme.border}`,
  borderRadius: "3px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
};

const accentLineStyle = {
  width: "4px",
  height: "24px",
  backgroundColor: theme.primaryRed,
  marginRight: "15px",
  borderRadius: "2px",
};

const iconContainerStyle = {
  display: "flex",
  alignItems: "center",
};