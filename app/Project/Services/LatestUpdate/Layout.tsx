"use client";

import {  useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { ReactNode, CSSProperties } from "react";

import { UserAuthContextProvider } from "../../Auth/auth-context";
import { Home } from "../Home";
import { WhatNewDropdown } from "../LatestUpdate/WhatNewDropdown";
import { MemberDropdown } from "../MemberContent/MemberDropdown";

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

/* ================= LAYOUT ================= */
export default function MemberContentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );
console.log(pathname);
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
            <MemberDropdown /> 
          </div>
        </nav>

        {/* CONTENT */}
        <main style={mainStyle}>{children}</main>
      </div>
    </UserAuthContextProvider>
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

const mainStyle: CSSProperties = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: theme.spacing.xl,
};