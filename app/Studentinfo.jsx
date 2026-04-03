import Link from "next/link";

// A small sub-component for your name
function MyHeading() {
  return <h1>Jesse Umweni</h1>;
}

// This is your MAIN component for the page
export default function Page() {
  return (
    <main>
      <MyHeading />
      <h2>Shopping List</h2>
      
      <nav>
        {/* Next.js Link uses 'href' for internal/external paths */}
        <Link href="https://github.com/your-username">My GITHUB</Link>
      </nav>
    </main>
  );
}