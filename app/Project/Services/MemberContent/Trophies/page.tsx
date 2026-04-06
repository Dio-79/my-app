"use client";
 


const THEME = {
  background: "#1a1a1a",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
  primaryRed: "#e11d48",
};

export default function TrophiesPage() {
  const trophies = [
    { name: "Top Player", year: 2025, rank: "gold" },
    { name: "Best Team", year: 2024, rank: "silver" },
    { name: "MVP Award", year: 2023, rank: "bronze" }
  ];

  return (
    <div style={{ backgroundColor: THEME.background, minHeight: "100vh", padding: "40px", color: THEME.textMain, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: "bold", color: THEME.primaryRed, borderBottom: `2px solid ${THEME.border}`, paddingBottom: "15px", marginBottom: "30px", textTransform: "uppercase" }}>
        ACHIEVEMENT <span style={{ color: "white" }}>TROPHIES</span>
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
        {trophies.map((t, i) => (
          <div key={i} style={{ textAlign: "center", padding: "25px", backgroundColor: "#222", border: `1px solid ${THEME.border}`, borderBottom: `3px solid ${THEME.border}`, borderRadius: "4px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🏆</div>
            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{t.name.toUpperCase()}</div>
            <div style={{ color: THEME.textDim, fontSize: "0.85rem" }}>Awarded: {t.year}</div>
          </div>
        ))}
      </div>
    </div>
  );
}