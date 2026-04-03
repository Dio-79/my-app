"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../Auth/firebase";
import { AuthContextProvider, useUserAuth } from "../Auth/auth-context";
import { WhatNewDropdown } from "../Services/WhatsNew";
import { MemberDropdown } from "../Services/Member";

/* ================= TYPES ================= */
interface Service {
  id: string;
  name: string;
}

/* ================= NAVBAR ================= */
function Navbar() {
  const { user, signInWithGoogle, signOutUser } = useUserAuth();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <WhatNewDropdown />
        <MemberDropdown />

      <div style={{ display: "flex", gap: "10px" }}>
       

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
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, "services"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[];

        setServices(data);
        setFilteredServices(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter((service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const handleAddService = async () => {
    const newService = { name: "New Service" };
    const docRef = await addDoc(collection(db, "services"), newService);

    setServices((prev) => [...prev, { id: docRef.id, ...newService }]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main style={{ padding: "20px" ,textAlign:"-khtml-left" }}>
     
      <input
       
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button onClick={handleAddService} style={{backgroundColor:"grey" ,color:"white" }}>Search</button>

      <ul>
        {filteredServices.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
    </main>
  );
}

/* ================= MAIN ================= */
export default function Page() {
  return (
    <AuthContextProvider>
      <Navbar />
      <ServicesSection />
    </AuthContextProvider>
  );
}