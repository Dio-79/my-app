"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ================= THEME CONSTANTS ================= */
const theme = {
  dropdownBg: "#222222",
  primaryRed: "#e11d48",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
  hover: "#2a2a2a"
};

export function Home() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleRefreshHome = () => {
    setOpen(false);
    // window.location.href forces a full refresh to reset the services list/search
    window.location.href = "/"; 
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
        HOME <span style={{ fontSize: "0.6rem", color: theme.textDim }}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          {/* Backdrop */}
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
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
            }}
          >
            <HomeItem label="Go to Home Page" onClick={handleRefreshHome} />
          </div>
        </>
      )}
    </div>
  );
}

/* Helper Component for Hover Effect */
function HomeItem({ label, onClick }: { label: string; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "12px 15px",
        cursor: "pointer",
        color: isHovered ? theme.primaryRed : theme.textMain,
        backgroundColor: isHovered ? theme.hover : "transparent",
        fontSize: "0.85rem",
        transition: "0.2s",
        fontWeight: "500"
      }}
    >
      {label}
    </div>
  );
}