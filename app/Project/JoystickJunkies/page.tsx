"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Auth/firebase";
import { UserAuthContextProvider, useUserAuth } from "../Auth/auth-context";
import { WhatNewDropdown } from "../Services/WhatsNew";
import { MemberDropdown } from "../Services/Member";
import { Home } from "../Services/Home";

/* ================= THEME CONSTANTS ================= */
const theme = {
  background: "#1a1a1a",
  navBg: "#121212",
  primaryRed: "#e11d48", 
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
};

/* ================= TYPES ================= */
interface Service {
  id: string;
  name: string;
}

/* ================= NAVBAR ================= */
function Navbar() {
  const { user, signInWithGoogle, signOutUser } = useUserAuth();

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      padding: "0 2rem",
      height: "70px",
      backgroundColor: theme.navBg,
      borderBottom: `2px solid ${theme.primaryRed}`,
      color: theme.textMain,
      justifyContent: "space-between",
      fontFamily: "sans-serif",
      fontWeight: "bold",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
    }}>
      <div style={{ fontSize: "1.5rem", letterSpacing: "-1px", color: theme.primaryRed }}>
        JOYSTICK<span style={{ color: "white" }}>JUNKIES</span>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Home />
        <WhatNewDropdown />
        <MemberDropdown />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        {user ? (
          <button style={buttonStyle} onClick={signOutUser}>LOGOUT</button>
        ) : (
          <button style={buttonStyle} onClick={signInWithGoogle}>LOGIN</button>
        )}
        <button style={{ ...buttonStyle, backgroundColor: theme.primaryRed }} onClick={signInWithGoogle}>SIGN UP</button>
      </div>
    </nav>
  );
}

/* ================= SERVICES SECTION ================= */
function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch services from Firebase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const data: Service[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Service, "id">),
        }));
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
  }, []);

  // Filter services by search
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main style={{ 
      backgroundColor: theme.background, 
      minHeight: "100vh", 
      padding: "40px",
      color: "white" 
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Search Bar */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="Search forums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 15px",
              backgroundColor: "#2a2a2a",
              border: `1px solid ${theme.border}`,
              color: "white",
              borderRadius: "4px"
            }}
          />
          <button style={buttonStyle}>SEARCH</button>
        </div>

        {/* Services List */}
        <div style={{ border: `1px solid ${theme.border}`, borderRadius: "4px", overflow: "hidden" }}>
          <div style={{
            backgroundColor: "#222",
            padding: "10px 20px",
            borderBottom: `1px solid ${theme.border}`,
            color: theme.textDim,
            fontSize: "0.8rem",
            fontWeight: "bold"
          }}>
            LATEST SERVICES
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {filteredServices.map(service => (
              <li key={service.id} style={{
                padding: "15px 20px",
                borderBottom: `1px solid ${theme.border}`,
                backgroundColor: "#1e1e1e",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ fontWeight: "500" }}>{service.name}</span>
                <span style={{ color: theme.primaryRed, fontSize: "0.8rem" }}>VIEW DETAILS →</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

/* ================= BUTTON STYLE ================= */
const buttonStyle = {
  backgroundColor: "#333",
  color: "white",
  border: "none",
  padding: "8px 16px",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: "bold",
  borderRadius: "3px",
  transition: "0.2s"
};

/* ================= PAGE ================= */
export default function Page() {
  return (
    <UserAuthContextProvider>
      <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
        <Navbar />
        <ServicesSection />
      </div>
    </UserAuthContextProvider>
  );
}