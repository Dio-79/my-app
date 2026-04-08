"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type RouteKey =
  | "MemberList"
  | "CurrentVisitor"
  | "Billboard"
  | "Trophies";

const MemberRoutes: Record<RouteKey, string> = {
  MemberList: "/Project/Services/MemberContent/MemberList",
  CurrentVisitor: "/Project/Services/MemberContent/CurrentVisitor",
  Billboard: "/Project/Services/MemberContent/Billboard",
  Trophies: "/Project/Services/MemberContent/Trophies",
};

export function MemberDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

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
    <div ref={ref}>
      <button onClick={() => setOpen(!open)}>MEMBERS</button>

      {open && (
        <div>
          {Object.entries(MemberRoutes).map(([key, route]) => (
            <div
              key={key}
              onClick={() => router.push(route)}
              style={{
                color: pathname === route ? "red" : "white",
                cursor: "pointer"
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