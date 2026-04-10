"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Auth/firebase";
import { UserAuthContextProvider, useUserAuth } from "../Auth/auth-context";
import { WhatNewDropdown } from "../Services/LatestUpdate/WhatNewDropdown";
import { MemberDropdown } from "../Services/MemberContent/MemberDropdown";
import { Home } from "../Services/Home";
import service from "../Services/Service.json";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ================= THEME ================= */
const theme = {
  background: "linear-gradient(to bottom, #111 0%, #1a1a1a 100%)",
  navBg: "#0b0b0b",
  primaryRed: "#e11d48",
  border: "#2a2a2a",
  textMain: "#ffffff",
};

/* ================= TYPES ================= */
interface Service {
  id?: string;
  name: string;
}

/* ================= NAVBAR ================= */
function Navbar() {
  const { user, profile, signInWithGoogle, signOutUser } = useUserAuth();
  const router = useRouter();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0 40px",
        height: "70px",
        backgroundColor: theme.navBg,
        borderBottom: `2px solid ${theme.primaryRed}`,
        alignItems: "center",
      }}
    >
      {/* LOGO */}
      <div style={{ fontWeight: "bold" }}>
        <span style={{ color: theme.primaryRed }}>JOYSTICK</span> JUNKIES
      </div>

      {/* NAV LINKS */}
      <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
        <Home />
        <WhatNewDropdown />
        <MemberDropdown />
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {user && profile && (
          <div
            onClick={() => router.push("/Project/Profile")}
            style={{
              display: "flex",
              gap: "8px",
              cursor: "pointer",
              alignItems: "center",
            }}
          >
            <Image
              src={profile.photoURL || "/default-avatar.png"}
              alt="Profile picture"
              width={30}
              height={30}
              style={{ borderRadius: "50%" }}
            />
            <span style={{ fontSize: "0.85rem" }}>
              {profile.username}
            </span>
          </div>
        )}

        {user ? (
          <button onClick={signOutUser}>Logout</button>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Not logged in → use JSON
        if (!user) {
          setServices(service as Service[]);
          return;
        }

        // 🔹 Fetch from Firestore
        const snapshot = await getDocs(collection(db, "services"));

        const data: Service[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Service, "id">),
        }));

        // 🔹 Fallback if empty
        setServices(data.length ? data : (service as Service[]));
      } catch (err) {
        console.error("Firestore error:", err);
        setServices(service as Service[]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <p style={{ color: "white", padding: "20px" }}>Loading...</p>;
  }

  return (
    <main
      style={{
        background: theme.background,
        minHeight: "100vh",
        padding: "40px",
        color: "white",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {services.map((s) => (
          <div
            key={s.id || s.name}
            style={{
              padding: "15px",
              marginBottom: "10px",
              backgroundColor: "#1c1c1c",
              border: `1px solid ${theme.border}`,
              borderLeft: `3px solid ${theme.primaryRed}`,
              borderRadius: "6px",
            }}
          >
            {s.name}
          </div>
        ))}
      </div>
    </main>
  );
}

/* ================= APP ================= */
export default function JoystickJunkies() {
  return (
    <UserAuthContextProvider>
      <Navbar />
      <ServicesSection />
    </UserAuthContextProvider>
  );
}