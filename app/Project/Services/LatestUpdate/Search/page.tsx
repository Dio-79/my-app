"use client";

import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🔍 SEARCH</h1>

      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={inputStyle}
      />

      <p style={textStyle}>Results for: {query}</p>
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

const inputStyle = {
  padding: "10px",
  width: "300px",
  marginBottom: "20px",
  backgroundColor: "#2a2a2a",
  border: "1px solid #333",
  color: "white",
};

const textStyle = {
  color: "#aaa",
};