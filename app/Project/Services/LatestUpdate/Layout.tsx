"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { ReactNode, CSSProperties } from "react";

import { UserAuthContextProvider } from "../../Auth/auth-context";
import { Home } from "../Home";
import { WhatNewDropdown } from "../LatestUpdate/WhatNewDropdown";

/* ================= THEME ================= */
export const theme = {
  colors: {
    background: "#1a1a1a",
    navBg: "#121212",
    primary: "#e11d48",
    border: "#333",
    textMain: "#ffffff",
    textDim: "#a0a0a0",
    cardBg: "#1e1e1e",
    inputBg: "#2a2a2a",
    dropdownBg: "#222222",
  },
  spacing: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "40px",
  },
  borderRadius: {
    sm: "3px",
    md: "4px",
    lg: "8px",
  },
  font: {
    main: "sans-serif",
  },
};

/* ================= ROUTES ================= */
const MemberRoutes = {
  New: "/project/member/new",
  Trending: "/project/member/trending",
  Search: "/project/member/search",
  Trophies: "/project/member/trophies",
} as const;

type Route = (typeof MemberRoutes)[keyof typeof MemberRoutes];

/* ================= LAYOUT ================= */
export default function MemberContentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = useCallback(
    (path: Route) => {
      setOpen(false);
      router.push(path);
    },
    [router]
  );

  return (
    <UserAuthContextProvider>
      <div style={containerStyle}>
        {/* NAVBAR */}
        <nav style={navBarStyle}>
          {/* LOGO */}
          <div style={logoStyle}>
            JOYSTICK<span style={{ color: "white" }}>JUNKIES</span>
          </div>

          {/* NAV LINKS */}
          <div style={navLinksStyle}>
            <Home />
            <WhatNewDropdown />

            {/* EXPLORE DROPDOWN */}
            <div style={{ position: "relative" }}>
              <button
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                style={triggerButtonStyle}
              >
                EXPLORE FEED
                <span style={arrowStyle(open)}>▼</span>
              </button>

              {open && (
                <>
                  <div onClick={() => setOpen(false)} style={backdropStyle} />

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
          </div>
        </nav>

        {/* CONTENT */}
        <main style={mainStyle}>{children}</main>
      </div>
    </UserAuthContextProvider>
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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: `12px ${theme.spacing.md}`,
        cursor: "pointer",
        color: active || hovered ? theme.colors.primary : theme.colors.textMain,
        backgroundColor: hovered ? theme.colors.inputBg : "transparent",
        fontSize: "0.85rem",
        borderLeft: active
          ? `3px solid ${theme.colors.primary}`
          : "3px solid transparent",
        transition: "all 0.2s ease",
        fontWeight: "bold",
      }}
    >
      {label}
    </div>
  );
}

/* ================= STYLES ================= */

const containerStyle: CSSProperties = {
  backgroundColor: theme.colors.background,
  minHeight: "100vh",
  fontFamily: theme.font.main,
};

const navBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "0 2rem",
  height: "70px",
  backgroundColor: theme.colors.navBg,
  borderBottom: `2px solid ${theme.colors.primary}`,
  color: "white",
  justifyContent: "space-between",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
};

const logoStyle: CSSProperties = {
  fontSize: "1.5rem",
  letterSpacing: "-1px",
  color: theme.colors.primary,
  fontWeight: "bold",
};

const navLinksStyle: CSSProperties = {
  display: "flex",
  gap: "20px",
  alignItems: "center",
};

const triggerButtonStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: "white",
  padding: "10px 5px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "0.85rem",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const arrowStyle = (open: boolean): CSSProperties => ({
  fontSize: "0.6rem",
  color: theme.colors.textDim,
  transform: open ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform 0.2s ease",
});

const dropdownContainerStyle: CSSProperties = {
  position: "absolute",
  top: "45px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "200px",
  backgroundColor: theme.colors.dropdownBg,
  border: `1px solid ${theme.colors.border}`,
  borderTop: `2px solid ${theme.colors.primary}`,
  borderRadius: theme.borderRadius.sm,
  zIndex: 100,
  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  padding: `${theme.spacing.sm} 0`,
};

const backdropStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 90,
};

const dividerStyle: CSSProperties = {
  height: "1px",
  backgroundColor: theme.colors.border,
  margin: "5px 0",
};

const mainStyle: CSSProperties = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: theme.spacing.xl,
};