"use client";

import { useState, useEffect } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
}

export default function DiscussionsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  const createPost = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });

    const newPost = await res.json();
    setPosts([...posts, newPost]);
    setTitle("");
    setContent("");
  };

  return (
    <div>
      <h1>Discussions</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={createPost}>Create Post</button>

      <hr />

      {posts.map((post) => (
        <div key={post.id}>
          <a href={`/discussions/${post.id}`}>
            <h2>{post.title}</h2>
          </a>
        </div>
      ))}
    </div>
  );
}