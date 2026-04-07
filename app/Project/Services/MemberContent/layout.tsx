import { UserAuthContextProvider } from "../../Auth/auth-context";
import { MemberDropdown } from "./MemberDropdown";
import { Home } from "../Home";
import { WhatNewDropdown } from "../LatestUpdate/WhatsNew";

const theme = {
  navBg: "#121212",
  primaryRed: "#e11d48",
};

export default function MemberContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserAuthContextProvider>
      <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
        <nav style={{
          display: "flex",
          alignItems: "center",
          padding: "0 2rem",
          height: "70px",
          backgroundColor: theme.navBg,
          borderBottom: `2px solid ${theme.primaryRed}`,
          color: "white",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
          fontWeight: "bold",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}>
          <div style={{ fontSize: "1.5rem", letterSpacing: "-1px", color: theme.primaryRed }}>
            JOYSTICK<span style={{ color: "white" }}>JUNKIES</span>
          </div>

          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <Home />
            <WhatNewDropdown />
            <MemberDropdown />
          </div>
        </nav>

        {children}
      </div>
    </UserAuthContextProvider>
  );
}