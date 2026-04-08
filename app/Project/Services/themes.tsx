"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

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
    dropdownBg: "#222",
  },
  spacing: {
    sm: "8px",
    md: "16px",
    lg: "24px",
  },
  borderRadius: {
    sm: "3px",
  },
  font: {
    main: "sans-serif",
  },
};

/* ================= BUTTON ================= */
export const buttonStyles = {
  base: {
    padding: "8px 16px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold" as const,
  },
};

/* ================= ROUTES ================= */
const MEMBER_ROUTES = {
  MemberList: "/member/list",
  CurrentVisitor: "/member/visitor",
  Billboard: "/member/billboard",
  Trophies: "/member/trophies",
} as const;

type RouteKey = keyof typeof MEMBER_ROUTES;

/* ================= MAIN COMPONENT ================= */
export function MemberDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (key: RouteKey) => {
    setOpen(false);
    router.push(MEMBER_ROUTES[key]);
  };

  return (
    <div style={{ position: "relative", fontFamily: theme.font.main }}>
      
      {/* Trigger */}
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          ...buttonStyles.base,
          background: "none",
          color: theme.colors.textMain,
          fontSize: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          textTransform: "uppercase",
        }}
      >
        MEMBERS
        <span style={{ fontSize: "0.6rem", color: theme.colors.textDim }}>▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Click outside */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 10 }}
          />

          <div style={dropdownStyle}>
            {Object.entries(MEMBER_ROUTES).map(([key, route]) => (
              <DropdownItem
                key={key}
                label={formatLabel(key)}
                active={pathname === route}
                onClick={() => handleSelect(key as RouteKey)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ================= DROPDOWN ITEM ================= */
function DropdownItem({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  const [hover, setHover] = useState(false);

  const isActive = hover || active;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        cursor: "pointer",
        fontSize: "0.85rem",
        transition: "0.2s",
        color: isActive ? theme.colors.primary : theme.colors.textMain,
        backgroundColor: hover ? "#2a2a2a" : "transparent",
        borderLeft: active ? `2px solid ${theme.colors.primary}` : "none",
      }}
    >
      {label}
    </div>
  );
}

/* ================= STYLES ================= */
const dropdownStyle = {
  position: "absolute" as const,
  top: "45px",
  left: 0,
  width: "190px",
  backgroundColor: theme.colors.dropdownBg,
  border: `1px solid ${theme.colors.border}`,
  borderTop: `2px solid ${theme.colors.primary}`,
  borderRadius: theme.borderRadius.sm,
  padding: `${theme.spacing.sm} 0`,
  zIndex: 11,
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
};

/* ================= HELPERS ================= */
function formatLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").trim();
}