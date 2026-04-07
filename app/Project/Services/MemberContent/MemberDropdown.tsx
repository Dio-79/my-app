"use client";

import { useState, useEffect, useRef } from "react";
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
const MemberRoutes: Record<string, string> = {
  MemberList: "/Project/Services/MemberContent/MemberList",
  CurrentVisitor: "/Project/Services/MemberContent/CurrentVisitor",
  Billboard: "/Project/Services/MemberContent/billboard",
  Trophies: "/Project/Services/MemberContent/Trophies",
};

const menuItems = [
  { key: "MemberList", label: "Member List" },
  { key: "CurrentVisitor", label: "Current Visitor" },
  { key: "Billboard", label: "Billboard" },
  { key: "divider", label: "" },
  { key: "Trophies", label: "Trophies" },
];

/* ================= MAIN COMPONENT ================= */
export function MemberDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (key: string) => {
    const route = MemberRoutes[key];
    if (!route) return;
    setOpen(false);
    router.push(route);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", fontFamily: "sans-serif" }}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        style={{
          background: "none",
          border: "none",
          color: THEME.textMain,
          fontSize: "0.85rem",
          fontWeight: "bold",
          cursor: "pointer",
          padding: "10px 5px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          textTransform: "uppercase",
        }}
      >
        MEMBERS{" "}
        <span
          style={{
            fontSize: "0.6rem",
            color: THEME.textDim,
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "45px",
            left: 0,
            backgroundColor: THEME.dropdownBg,
            border: `1px solid ${THEME.border}`,
            borderTop: `2px solid ${THEME.primaryRed}`,
            borderRadius: "2px",
            padding: "5px 0",
            width: "190px",
            zIndex: 50,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          {menuItems.map((item) =>
            item.key === "divider" ? (
              <div
                key="divider"
                style={{
                  height: "1px",
                  backgroundColor: THEME.border,
                  margin: "5px 0",
                }}
              />
            ) : (
              <DropdownItem
                key={item.key}
                label={item.label}
                onClick={() => handleSelect(item.key)}
                active={pathname === MemberRoutes[item.key]}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ================= ITEM COMPONENT ================= */
function DropdownItem({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "12px 18px",
        cursor: "pointer",
        color: isHovered || active ? THEME.primaryRed : THEME.textMain,
        backgroundColor: isHovered ? THEME.hover : "transparent",
        fontSize: "0.85rem",
        transition: "color 0.2s ease, background-color 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeft: active ? `2px solid ${THEME.primaryRed}` : "2px solid transparent",
      }}
    >
      {label}
      {active && (
        <span style={{ fontSize: "0.5rem", color: THEME.primaryRed }}>●</span>
      )}
    </div>
  );
}