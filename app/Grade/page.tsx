import Link from "next/link";
// This pulls in your specific code from the GradeList.tsx file
import Grade from "./grade";
export default function Page() {
  return (
    <main style={{ padding: "20px", textAlign: "center", backgroundColor: "#000", minHeight: "100vh" }}>
      
      {/* 1. Show your specific GradeList code */}
      <Grade />

      {/* 2. Navigation Section -  */}
      <nav style={{ 
        marginTop: "30px", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center" 
      }}>
        <Link href="/" style={{ color: "red", fontWeight: "bold", textDecoration: "none" }}>
          ← Back to Homepage
        </Link>
      </nav>
    </main>
  );
}