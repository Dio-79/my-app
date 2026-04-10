"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

/* ================= THEME ================= */
const theme = {
  textMain: "#ffffff",
  textDim: "#b0b0b0",
  primaryRed: "#e11d48",
  border: "#2a2a2a",
  dropdownBg: "#1a1a1a",
};

type RouteKey =
  | "Member List"
  | "Current Visitor"
  | "Billboard"
  | "Trophies";

const MemberRoutes: Record<RouteKey, string> = {
  "Member List": "/Project/Services/MemberContent/MemberList",
  "Current Visitor": "/Project/Services/MemberContent/CurrentVisitor",
  "Billboard": "/Project/Services/MemberContent/billboard",
  "Trophies": "/Project/Services/MemberContent/Trophies",
};

export function MemberDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  /* CLOSE ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      
      {/*  MATCHES Latest Updates BUTTON */}
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
          textTransform: "uppercase",
        }}
      >
        Members
        <span style={{ fontSize: "0.6rem", color: theme.textDim }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/*  DROPDOWN MENU */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: theme.dropdownBg,
            border: `1px solid ${theme.border}`,
            borderRadius: "6px",
            minWidth: "180px",
            marginTop: "8px",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {Object.entries(MemberRoutes).map(([key, route]) => (
            <div
              key={key}
              onClick={() => {
                router.push(route);
                setOpen(false);
              }}
              style={{
                padding: "10px 15px",
                cursor: "pointer",
                fontSize: "0.8rem",
                color:
                  pathname === route
                    ? theme.primaryRed
                    : theme.textMain,
                backgroundColor:
                  pathname === route ? "#2a2a2a" : "transparent",
                borderLeft:
                  pathname === route
                    ? `3px solid ${theme.primaryRed}`
                    : "3px solid transparent",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget.style.backgroundColor = "#2a2a2a");
              }}
              onMouseLeave={(e) => {
                if (pathname !== route) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {key}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}