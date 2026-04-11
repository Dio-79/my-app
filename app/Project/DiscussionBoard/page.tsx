"use client";

import { useRouter } from "next/navigation";

export default function DiscussionPage() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Discussion Board</h1>

      <p style={styles.subtitle}>
        Welcome to the discussion board. Choose an option below.
      </p>

      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => router.push("/Project/DiscussionBoard/info")}
        >
          View Info
        </button>

        <button
          style={styles.button}
          onClick={() => router.push("/Project/DiscussionBoard/Comment")}
        >
          View Comments
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#1a1a1a",
    minHeight: "100vh",
    color: "white",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#aaa",
  },
  buttonContainer: {
    display: "flex",
    gap: "15px",
  },
  button: {
    backgroundColor: "#e11d48",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};