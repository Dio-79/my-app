"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ================= THEME CONSTANTS ================= */
const theme = {
  background: "#1a1a1a",
  dropdownBg: "#222222",
  primaryRed: "#e11d48",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
  hover: "#2a2a2a",
};

/* ================= MEMBER ROUTES ================= */
/* Make sure these match your folder structure in `app/` */
const MemberRoutes = {
  MemberList: "/project/member/list",
  CurrentVisitor: "/project/member/visitor",
  Billboard: "/project/member/billboard",
  Trophies: "/project/member/trophies",
};

export function MemberDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSelect = (key: keyof typeof MemberRoutes) => {
    setOpen(false);
    const route = MemberRoutes[key];
    if (route) router.push(route);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Dropdown trigger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          color: theme.textMain,
          fontSize: "0.85rem",
          fontWeight: "bold",
          cursor: "pointer",
          padding: "10px 5px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        MEMBERS <span style={{ fontSize: "0.6rem", color: theme.textDim }}>▼</span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <>
          {/* Click outside to close */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 10 }}
          />

          <div
            style={{
              position: "absolute",
              top: "45px",
              left: 0,
              backgroundColor: theme.dropdownBg,
              border: `1px solid ${theme.border}`,
              borderTop: `2px solid ${theme.primaryRed}`,
              borderRadius: "2px",
              padding: "5px 0",
              width: "180px",
              zIndex: 11,
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            }}
          >
            <DropdownItem label="Member List" onClick={() => handleSelect("MemberList")} />
            <DropdownItem label="Current Visitor" onClick={() => handleSelect("CurrentVisitor")} />
            <DropdownItem label="Billboard" onClick={() => handleSelect("Billboard")} />
            <div style={{ height: "1px", backgroundColor: theme.border, margin: "5px 0" }} />
            <DropdownItem label="Trophies" onClick={() => handleSelect("Trophies")} />
          </div>
        </>
      )}
    </div>
  );
}

/* ================= DROPDOWN ITEM ================= */
function DropdownItem({ label, onClick }: { label: string; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "10px 15px",
        cursor: "pointer",
        color: isHovered ? theme.primaryRed : theme.textMain,
        backgroundColor: isHovered ? theme.hover : "transparent",
        fontSize: "0.85rem",
        transition: "0.2s",
      }}
    >
      {label}
    </div>
  );
}