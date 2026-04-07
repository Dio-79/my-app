"use client";

export default function TrendingPage() {
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🔥 TRENDING</h1>
      <p style={textStyle}>See what’s trending right now.</p>
    </div>
  );
}

const pageStyle = {
  padding: "40px",
  color: "white",
  backgroundColor: "#1a1a1a",
  minHeight: "100vh",
};

const titleStyle = {
  color: "#e11d48",
  fontSize: "1.5rem",
  marginBottom: "20px",
};

const textStyle = {
  color: "#aaa",
};