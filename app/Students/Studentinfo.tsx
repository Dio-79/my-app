import Link from "next/link";

export default function Grade() {
  return (

    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
          <section style={{ marginBottom: "20px" }}>

      <h1 style={{ textAlign: "center", fontSize: "24px" }}>Student Grades</h1>
      {/* You can add your list items here later */}
      <ul>
        <li>Math:A</li>
        <li>English:B</li>
        <li>History:A</li>
        <li>Science:B</li>
        <li>Art:A</li>

      </ul>
 
</section>

     {/* Navigation to go back home */}
      
     <nav style={{ marginTop: "20px" , display: "flex", flexDirection: "column", gap: "10px"}}>
        {/* Next.js Link uses 'href' for internal/external paths */}
        <Link href="https://github.com/your-username" style={{ color: "blue", textDecoration: "underline" }}>My GITHUB</Link>

        <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>
          ← Back to Home
        </Link>

      </nav>

         </main>
  );
}