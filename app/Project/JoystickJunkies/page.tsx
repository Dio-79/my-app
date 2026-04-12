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
    <nav style={navStyle}>
      <div style={{ fontWeight: "bold", color: theme.textMain }}>
        <span style={{ color: theme.primaryRed }}>JOYSTICK</span> JUNKIES
      </div>

      <div style={navLinks}>
        <Home />
        <WhatNewDropdown />
        <MemberDropdown />
      </div>

      <div style={rightNav}>
        {user && profile && (
          <div
            onClick={() => router.push("/Project/Profile")}
            style={profileBox}
          >
            <Image
              src={profile.photoURL || "/default-avatar.png"}
              alt="Profile"
              width={30}
              height={30}
              style={{ borderRadius: "50%" }}
            />
            <span style={{ color: theme.textMain }}>
              {profile.username}
            </span>
          </div>
        )}

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

/* ================= FORUM ================= */
function ServicesSection() {
  const { user } = useUserAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          setServices(service as Service[]);
          return;
        }

        const snapshot = await getDocs(collection(db, "services"));

        const data: Service[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Service, "id">),
        }));

        setServices(data.length ? data : (service as Service[]));
      } catch {
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
    <main style={forumLayout}>
      {/* LEFT SIDE */}
      <div style={forumMain}>
        <h2 style={sectionTitle}>Discussion</h2>

        {services.map((s) => (
          <div
            key={s.id || s.name}
            onClick={() =>
              router.push(`/Project/DiscussionBoard?topic=${s.name}`)
            }
            style={forumRow}
          >
            <div style={iconBox}>💬</div>

            <div style={{ flex: 1 }}>
              <div style={forumName}>{s.name}</div>
              <div style={forumSub}>Click to enter discussion</div>
            </div>

            <div style={forumStats}>
              <div>--</div>
              <span style={{ color: theme.textDim }}>Threads</span>
            </div>

            <div style={forumStats}>
              <div>--</div>
              <span style={{ color: theme.textDim }}>Messages</span>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT SIDEBAR */}
      <div style={sidebar}>
        <div style={sidebarBox}>
          <h3 style={sidebarTitle}>Members Online</h3>
          <p style={{ color: theme.textDim }}>
            User1, User2, User3...
          </p>
        </div>

        <div style={sidebarBox}>
          <h3 style={sidebarTitle}>Latest Posts</h3>
          <p style={{ color: theme.textDim }}>
            New discussion activity will appear here
          </p>
        </div>

        <div style={sidebarBox}>
          <h3 style={sidebarTitle}>Forum Stats</h3>
          <p style={{ color: theme.textDim }}>
            Threads: -- <br />
            Messages: -- <br />
            Members: --
          </p>
        </div>
      </div>
    </main>
  );
}

/* ================= STYLES ================= */

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0 40px",
  height: "70px",
  backgroundColor: theme.navBg,
  borderBottom: `2px solid ${theme.primaryRed}`,
  alignItems: "center",
};

const navLinks = {
  display: "flex",
  gap: "30px",
  alignItems: "center",
};

const rightNav = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
};

const profileBox = {
  display: "flex",
  gap: "8px",
  cursor: "pointer",
  alignItems: "center",
  color: theme.textMain,
};

const authBtn = {
  background: "none",
  border: "1px solid #333",
  color: theme.textMain,
  padding: "6px 12px",
  cursor: "pointer",
};

/* ===== FORUM LAYOUT ===== */

const forumLayout = {
  display: "grid",
  gridTemplateColumns: "3fr 1fr",
  gap: "20px",
  padding: "40px",
  background: theme.background,
  minHeight: "100vh",
};

const forumMain = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
  color: theme.textMain, 
};

const sectionTitle = {
  borderBottom: `2px solid ${theme.primaryRed}`,
  paddingBottom: "10px",
  color: theme.textMain,
};

const forumRow = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "15px",
  backgroundColor: "#1c1c1c",
  border: `1px solid ${theme.border}`,
  borderRadius: "6px",
  cursor: "pointer",
  color: theme.textMain, 
};

const iconBox = {
  width: "40px",
  height: "40px",
  backgroundColor: theme.primaryRed,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
};

const forumName = {
  fontWeight: "bold",
  color: theme.textMain,
};

const forumSub = {
  fontSize: "12px",
  color: theme.textDim,
};

const forumStats = {
  width: "80px",
  textAlign: "center" as const,
  color: theme.textMain,
};

/* ===== SIDEBAR ===== */

const sidebar = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "15px",
};

const sidebarBox = {
  backgroundColor: "#1c1c1c",
  border: `1px solid ${theme.border}`,
  padding: "15px",
  borderRadius: "6px",
};

const sidebarTitle = {
  borderBottom: `1px solid ${theme.border}`,
  marginBottom: "10px",
  paddingBottom: "5px",
  color: theme.textMain,
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