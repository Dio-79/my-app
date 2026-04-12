"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../Auth/firebase";
import { useRouter } from "next/navigation";

type Post = {
  id: string;
  title: string;
  content: string;
  likes: number;
  createdAt: number;
  topic?: string;
};

const THEME = {
  background: "#1a1a1a",
  cardBg: "#222222",
  primaryRed: "#e11d48",
  border: "#333",
  textMain: "#ffffff",
  textDim: "#a0a0a0",
};

export default function NewPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, "id">),
        }));

        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p style={{ color: "#aaa" }}>Loading...</p>;

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🆕 NEW POSTS</h1>

      {posts.map((post) => (
        <div
          key={post.id}
          style={cardStyle}
          onClick={() =>
            router.push(
              `/Project/DiscussionBoard?topic=${post.topic || "General"}`
            )
          }
        >
          <h3 style={{ color: THEME.primaryRed }}>{post.title}</h3>
          <p>{post.content}</p>

          <small style={{ color: THEME.textDim }}>
            {new Date(post.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

/* styles */
const pageStyle: React.CSSProperties = {
  backgroundColor: THEME.background,
  minHeight: "100vh",
  padding: "40px",
};

const titleStyle: React.CSSProperties = {
  color: THEME.textMain,
  marginBottom: "20px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: THEME.cardBg,
  border: `1px solid ${THEME.border}`,
  padding: "20px",
  marginBottom: "10px",
  cursor: "pointer",
};