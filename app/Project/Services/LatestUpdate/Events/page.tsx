"use client";

export default function EventsPage() {
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>📅 EVENTS</h1>
      <ul style={listStyle}>
        <li>🎮 Gaming Tournament - April 10</li>
        <li>🚀 Dev Meetup - April 15</li>
        <li>🔥 Esports Finals - April 20</li>
      </ul>
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

const listStyle = {
  color: "#ccc",
  lineHeight: "2",
};