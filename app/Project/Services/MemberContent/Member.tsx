"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/* ================= LOCAL THEME (Replaces Import) ================= */
const THEME = {
  background: "#1a1a1a",
  dropdownBg: "#222222",
  primaryRed: "#e11d48",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
  hover: "#2a2a2a"
};

const MemberRoutes = {
  MemberList: "/project/member/list",
  CurrentVisitor: "/project/member/visitor",
  Billboard: "/project/member/billboard",
  Trophies: "/project/member/trophies"
};
export function MemberDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (value: string) => {
    setOpen(false);
    const route = MemberRoutes[value as keyof typeof MemberRoutes];
    if (route) router.push(route);
  };

  return (
    <div style={{ position: "relative", fontFamily: "sans-serif" }}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
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
        MEMBERS <span style={{ fontSize: "0.6rem", color: THEME.textDim }}>▼</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setOpen(false)} 
            style={{ position: "fixed", inset: 0, zIndex: 10 }} 
          />

          {/* Dropdown Container */}
          <div
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
              zIndex: 11,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <DropdownItem 
              label="Member List" 
              onClick={() => handleSelect("MemberList")} 
              active={pathname === MemberRoutes.MemberList}
            />
            <DropdownItem 
              label="Current Visitor" 
              onClick={() => handleSelect("CurrentVisitor")} 
              active={pathname === MemberRoutes.CurrentVisitor}
            />
            <DropdownItem 
              label="Billboard" 
              onClick={() => handleSelect("Billboard")} 
              active={pathname === MemberRoutes.Billboard}
            />
            
            <div style={{ height: "1px", backgroundColor: THEME.border, margin: "5px 0" }} />
            
            <DropdownItem 
              label="Trophies" 
              onClick={() => handleSelect("Trophies")} 
              active={pathname === MemberRoutes.Trophies}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* ================= ITEM COMPONENT ================= */

function DropdownItem({ label, onClick, active }: { label: string; onClick: () => void; active?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "12px 18px",
        cursor: "pointer",
        color: (isHovered || active) ? THEME.primaryRed : THEME.textMain,
        backgroundColor: isHovered ? THEME.hover : "transparent",
        fontSize: "0.85rem",
        transition: "0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeft: active ? `2px solid ${THEME.primaryRed}` : "none"
      }}
    >
      {label}
    </div>
  );
}