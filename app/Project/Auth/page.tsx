"use client";

import { UserAuthContextProvider } from "./auth-context";
import MainContent from "./components/MainContent";

export default function AuthPage() {
  return (
    <UserAuthContextProvider>
      <MainContent />
    </UserAuthContextProvider>
  );
}