"use client";

import Link from "next/link";

/* ================= THEME ================= */
const theme = {
  bg: "#121212",
  border: "#333",
  text: "#ccc",
  active: "#e11d48",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#1a1a1a", minHeight: "100vh" }}>
      
      {/* NAV BAR */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "15px 30px",
          background: theme.bg,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <NavItem href="/Project/Services/LatestUpdate/Newspost" label="New Posts" />
        <NavItem href="/Project/Services/LatestUpdate/Trending" label="Trending" />
        <NavItem href="/Project/Services/LatestUpdate/Search" label="Search" />
        <NavItem href="/Project/Services/LatestUpdate/Events" label="Events" />
      </div>

      {/* PAGE CONTENT */}
      <div style={{ padding: "30px" }}>
        {children}
      </div>
    </div>
  );
}

/* ================= NAV ITEM ================= */
function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        color: "#ccc",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "0.85rem",
      }}
    >
      {label}
    </Link>
  );
}