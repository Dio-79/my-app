import { AuthContextProvider } from "./Auth/auth-context";


// app/Project/layout.tsx
import React from "react";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1>Joystick Junkies Project</h1>
      </header>

      <main className="flex-1 p-4">{children}</main>

      <footer className="bg-gray-200 text-center p-2">
        &copy; 2026 Joystick Junkies
      </footer>
    </div>
  );
}