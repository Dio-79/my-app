"use client";

import { UserAuthContextProvider } from "./Auth/auth-context";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserAuthContextProvider>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#1a1a1a",
          color: "white",
        }}
      >
        {children}
      </div>
    </UserAuthContextProvider>
  );
}
