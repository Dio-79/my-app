"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "../Auth/firebase";

type Post = {
  id: string;
  title: string;
  content: string;
  likes: number;
  createdAt: number;
};

export default function DiscussionBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, "posts"));

    const data: Post[] = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<Post, "id">),
    }));

    const sorted = [...data].sort((a, b) => b.likes - a.likes);

    setPosts(sorted);
  };

  useEffect(() => {
    const load = async () => {
      await fetchPosts();
    };
    load();
  }, []);

  const createPost = async () => {
    if (!title || !content) return;

    await addDoc(collection(db, "posts"), {
      title,
      content,
      likes: 0,
      createdAt: Date.now(),
    });

    setTitle("");
    setContent("");
    fetchPosts();
  };

  const likePost = async (id: string) => {
    const postRef = doc(db, "posts", id);

    await updateDoc(postRef, {
      likes: increment(1),
    });

    fetchPosts();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔥 Discussion Board</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br />

      <button onClick={createPost}>Post</button>

      <hr />

      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>👍 {post.likes}</p>

          <button onClick={() => likePost(post.id)}>
            Like 👍
          </button>
        </div>
      ))}
    </div>
  );
}