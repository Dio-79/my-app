import Link from 'next/link';

function FirstPage() {
  return (
    <>
      <header style={{ fontSize: "8px", fontWeight: "bold" }}>MY Homepage</header>
      
      <br />
      
      <div style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
        Welcome to the Homepage
      </div>
      
      <br />
      
      <nav>
        <ul style={{ 
          listStyleType: "none", 
          display: "flex", 
          justifyContent: "center", 
          gap: "20px", 
          backgroundColor: "#a82d2d", 
          padding: "10px" 
        }}>
          <li style={{ textAlign: "center" }}>
            <Link href="/" style={{ color: "white", textDecoration: "none" }}>Home Page</Link>
          </li>
          <li style={{ textAlign: "center" }}>
            <Link href="#" style={{ color: "white", textDecoration: "none" }}>About</Link>
          </li>
          <li style={{ textAlign: "center" }}>
            <Link href="#" style={{ color: "white", textDecoration: "none" }}>Settings</Link>
          </li>
          <li style={{ textAlign: "center" }}>
            <Link href="#" style={{ color: "white", textDecoration: "none" }}>Contact</Link>
          </li>
        </ul>
      </nav>
      

      <br />

      <div style={{ textAlign: "center" }}>
        <Link href="Students" style={{ color: "blue", textDecoration: "underline" }}>
          Student Information
        </Link>
      </div>
     <div style={{ textAlign: "center" }}>
        <Link href="Grade" style={{ color: "blue", textDecoration: "underline" }}>
          Student Grades
        </Link>
      </div>
      <div style={{ textAlign: "center" }}>
        <Link href="Grading" style={{ color: "blue", textDecoration: "underline" }}>
          Grading Page
        </Link>
      </div>
      <div style={{ textAlign: "center" }}>
        <Link href="Project" style={{ color: "blue", textDecoration: "underline" }}>
          Project Page
        </Link>
      </div>
      <br />

      <footer style={{ fontSize: "8px", fontWeight: "bold", textAlign: "center" }}>
        Copyright 2024
      </footer>
    </>
  );
}

export default function Page() {
  return <FirstPage />;
}