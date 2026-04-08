"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/* ================= THEME ================= */
const THEME = {
  background: "#1a1a1a",
  dropdownBg: "#222222",
  primaryRed: "#e11d48",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
  hover: "#2a2a2a",
};

/* ================= ROUTES ================= */
const MemberRoutes = {
  New: "/project/member/new",
  Trending: "/project/member/trending",
  Search: "/project/member/search",
  Trophies: "/project/member/trophies",
};

/* ================= LAYOUT ================= */
export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <div style={{ backgroundColor: THEME.background, minHeight: "100vh" }}>
      {/* NAVBAR */}
      <nav style={navBarStyle}>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpen(!open)}
            style={triggerButtonStyle}
          >
            EXPLORE FEED{" "}
            <span style={{ fontSize: "0.6rem" }}>
              {open ? "▲" : "▼"}
            </span>
          </button>

          {open && (
            <>
              {/* BACKDROP */}
              <div onClick={() => setOpen(false)} style={backdropStyle} />

              {/* DROPDOWN */}
              <div style={dropdownContainerStyle}>
                <DropdownItem
                  label="🆕 New Posts"
                  active={pathname === MemberRoutes.New}
                  onClick={() => handleNavigate(MemberRoutes.New)}
                />
                <DropdownItem
                  label="🔥 Trending"
                  active={pathname === MemberRoutes.Trending}
                  onClick={() => handleNavigate(MemberRoutes.Trending)}
                />
                <DropdownItem
                  label="🔍 Search"
                  active={pathname === MemberRoutes.Search}
                  onClick={() => handleNavigate(MemberRoutes.Search)}
                />

                <div style={dividerStyle} />

                <DropdownItem
                  label="🏆 Trophies"
                  active={pathname === MemberRoutes.Trophies}
                  onClick={() => handleNavigate(MemberRoutes.Trophies)}
                />
              </div>
            </>
          )}
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main style={mainStyle}>{children}</main>
    </div>
  );
}

/* ================= DROPDOWN ITEM ================= */
function DropdownItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 18px",
        cursor: "pointer",
        color: active ? THEME.primaryRed : THEME.textMain,
        backgroundColor: "transparent",
        fontSize: "0.85rem",
        borderLeft: active
          ? `3px solid ${THEME.primaryRed}`
          : "3px solid transparent",
        transition: "0.2s",
      }}
    >
      {label}
    </div>
  );
}

/* ================= STYLES ================= */

const navBarStyle: React.CSSProperties = {
  padding: "15px 20px",
  borderBottom: `1px solid ${THEME.border}`,
  display: "flex",
  justifyContent: "center",
};

const triggerButtonStyle: React.CSSProperties = {
  background: "none",
  border: `1px solid ${THEME.border}`,
  color: THEME.textMain,
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "0.75rem",
  letterSpacing: "1px",
};

const dropdownContainerStyle: React.CSSProperties = {
  position: "absolute",
  top: "40px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "200px",
  backgroundColor: THEME.dropdownBg,
  border: `1px solid ${THEME.border}`,
  zIndex: 100,
  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
};

const backdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 90,
};

const dividerStyle: React.CSSProperties = {
  height: "1px",
  backgroundColor: THEME.border,
  margin: "5px 0",
};

const mainStyle: React.CSSProperties = {
  maxWidth: "800px",
  margin: "0 auto",
};