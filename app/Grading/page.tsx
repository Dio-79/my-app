import Grade from "./grading";
import Link from "next/link";
export default function Home() {
  return (
    <div>
      


     <Grade />
 <Link href="/" style={{ color: "red", fontWeight: "bold", textDecoration: "none" }}>
          ← Back to Homepage
        </Link>
</div>
 
  );
}