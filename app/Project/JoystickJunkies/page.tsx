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

/* ================= THEME ================= */
const theme = {
  background: "linear-gradient(to bottom, #111 0%, #1a1a1a 100%)",
  navBg: "#0b0b0b",
  primaryRed: "#e11d48",
  border: "#2a2a2a",
  textMain: "#ffffff",
  textDim: "#b0b0b0",
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
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: "70px",
        backgroundColor: theme.navBg,
        borderBottom: `2px solid ${theme.primaryRed}`,
        color: theme.textMain,
      }}
    >
      {/* LOGO */}
      <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
        <span style={{ color: theme.primaryRed }}>JOYSTICK</span>{" "}
        <span>JUNKIES</span>
      </div>

      {/* NAV LINKS */}
      <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
        <NavItem><Home /></NavItem>
        <NavItem><WhatNewDropdown /></NavItem>
        <NavItem><MemberDropdown /></NavItem>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {/* PROFILE */}
        {user && profile && (
          <div
            onClick={() => router.push("/Project/Profile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <img
              src={profile.photoURL}
              width={28}
              height={28}
              style={{
                borderRadius: "50%",
                border: `1px solid ${theme.border}`,
              }}
            />
            <span style={{ fontSize: "0.85rem" }}>
              {profile.username}
            </span>
          </div>
        )}

        {/* AUTH */}
        {user ? (
          <button style={authBtn} onClick={signOutUser}>
            Logout
          </button>
        ) : (
          <button style={authBtn} onClick={signInWithGoogle}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

/* ================= NAV ITEM ================= */
function NavItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: "#e5e5e5",
        fontSize: "0.85rem",
        fontWeight: "600",
        cursor: "pointer",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}

/* ================= SERVICES ================= */
function ServicesSection() {
  const { user } = useUserAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (!user) {
          setServices(service);
          setLoading(false);
          return;
        }

        const snapshot = await getDocs(collection(db, "services"));

        const data: Service[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Service, "id">),
        }));

        setServices(data.length ? data : service);
      } catch {
        setServices(service);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user]);

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main style={{ background: theme.background, minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
        
        <input
          type="text"
          placeholder="Search forums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            backgroundColor: "#2a2a2a",
            border: `1px solid ${theme.border}`,
            color: "white",
          }}
        />

        {filtered.map((item, i) => (
          <div key={item.id || i} style={cardStyle}>
            {item.name}
          </div>
        ))}
      </div>
    </main>
  );
}

/* ================= STYLES ================= */
const cardStyle = {
  padding: "15px",
  marginBottom: "10px",
  backgroundColor: "#1c1c1c",
  border: "1px solid #2a2a2a",
  borderLeft: "3px solid #e11d48",
  borderRadius: "6px",
  color: "white",
};

const authBtn = {
  background: "none",
  border: "1px solid #333",
  color: "#e5e5e5",
  padding: "6px 12px",
  cursor: "pointer",
};

/* ================= APP ================= */
export default function JoystickJunkies() {
  return (
    <UserAuthContextProvider>
      <Navbar />
      <ServicesSection />
    </UserAuthContextProvider>
  );
}