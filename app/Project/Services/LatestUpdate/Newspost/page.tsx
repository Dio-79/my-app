"use client";

export default function NewPostsPage() {
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🆕 NEW POSTS</h1>
      <p style={textStyle}>Here are the latest posts from the community.</p>
    </div>
  );
}

/* Styles */
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