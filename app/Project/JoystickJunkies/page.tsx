"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Auth/firebase";
import { UserAuthContextProvider, useUserAuth } from "../Auth/auth-context";
import { WhatNewDropdown } from "../Services/LatestUpdate/WhatNewDropdown";
import { MemberDropdown } from "../Services/MemberContent/MemberDropdown";
import { Home } from "../Services/Home";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
interface Service {
  id?: string;
  name: string;
}

/* ================= THEME ================= */
const theme = {
  background: "#1a1a1a",
  navBg: "#121212",
  primaryRed: "#e11d48",
  border: "#333",
  textMain: "#ffffff",
};

/* ================= NAVBAR ================= */
function Navbar() {
  const { user, profile, signInWithGoogle, signOutUser } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !profile) {
      router.push("/Project/ProfileSetup");
    }
  }, [user, profile, router]);

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "0 2rem",
      height: "70px",
      background: theme.navBg,
      color: "white"
    }}>
      <div>JOYSTICK JUNKIES</div>

      <div style={{ display: "flex", gap: "20px" }}>
        <Home />
        <WhatNewDropdown />
        <MemberDropdown />
      </div>

      <div>
        {user ? (
          <>
            {profile && (
              <span onClick={() => router.push("/Project/Profile")}>
                {profile.username}
              </span>
            )}
            <button onClick={signOutUser}>Logout</button>
          </>
        ) : (
          <button onClick={signInWithGoogle}>Login</button>
        )}
      </div>
    </nav>
  );
}

/* ================= SERVICES ================= */
function ServicesSection() {
  const { user } = useUserAuth();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const snap = await getDocs(collection(db, "services"));
      setServices(snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Service, "id">)
      })));
    };

    fetchData();
  }, [user]);

  return (
    <div style={{ color: "white", padding: "40px" }}>
      {services.map(s => <p key={s.id}>{s.name}</p>)}
    </div>
  );
}

/* ================= APP ================= */
export default function App() {
  return (
    <UserAuthContextProvider>
      <Navbar />
      <ServicesSection />
    </UserAuthContextProvider>
  );
}