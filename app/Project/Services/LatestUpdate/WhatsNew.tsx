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
  hover: "#2a2a2a"
};

const WhatNewRoutes = {
  Newspost: "/whatnew/NewPost",
  Trending: "/whatnew/Trending",
  Search: "/whatnew/Search",
  Events: "/whatnew/Events"
};

export function WhatNewDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSelect = (value: string) => {
    setOpen(false);
    const route = WhatNewRoutes[value as keyof typeof WhatNewRoutes];
    if (route) {
      router.push(route);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Trigger Button */}
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
          textTransform: "uppercase"
        }}
      >
        Latest Updates <span style={{ fontSize: "0.6rem", color: theme.textDim }}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          {/* Close dropdown on outside click */}
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
              borderTop: `2px solid ${theme.primaryRed}`, // The "Gaming" accent bar
              borderRadius: "2px",
              padding: "5px 0",
              width: "180px",
              zIndex: 11,
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
            }}
          >
            <DropdownItem label="New Posts" onClick={() => handleSelect("Newspost")} />
            <DropdownItem label="Trending" onClick={() => handleSelect("Trending")} />
            <DropdownItem label="Search" onClick={() => handleSelect("Search")} />
            <div style={{ height: "1px", backgroundColor: theme.border, margin: "5px 0" }} />
            <DropdownItem label="Events" onClick={() => handleSelect("Events")} />
          </div>
        </>
      )}
    </div>
  );
}

/* Helper for hover functionality */
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
        transition: "background 0.2s, color 0.2s",
        fontWeight: "500"
      }}
    >
      {label}
    </div>
  );
}