"use client";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../Auth/firebase"; // Make sure path is correct

interface Service {
  id: string; // Firestore document IDs are usually strings
  name: string;
}

 export async function JoystickJunkiesServices() {
 

  async function fetchServices() {
    try {
      const servicesRef = collection(db, "services");
      const snapshot = await getDocs(servicesRef);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];
      return data;
    } catch (err) {
      console.error("Error fetching services:", err);
      throw err;
    }
  }

  async function addService(name: string) { 
    try {
      const newService = { name };
      const servicesRef = collection(db, "services");
      const docRef = await addDoc(servicesRef, newService);
      return { id: docRef.id, ...newService };
    }

    catch (err) {
      console.error("Error adding service:", err);
      throw err;
    }
  }

  return { fetchServices, addService };
}

