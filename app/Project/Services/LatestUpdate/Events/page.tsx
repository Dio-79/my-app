"use client";

const events = [
  { title: "🎮 Gaming Tournament", date: "April 10" },
  { title: "🚀 Dev Meetup", date: "April 15" },
  { title: "🔥 Esports Finals", date: "April 20" },
];

export default function EventsPage() {
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>📅 EVENTS</h1>

      {events.map((event, i) => (
        <div key={i} style={cardStyle}>
          <h3 style={{ color: "#e11d48", margin: 0 }}>{event.title}</h3>
          <p style={textStyle}>{event.date}</p>
        </div>
      ))}
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

const cardStyle = {
  border: "1px solid #333",
  padding: "15px",
  marginBottom: "10px",
  backgroundColor: "#222",
};