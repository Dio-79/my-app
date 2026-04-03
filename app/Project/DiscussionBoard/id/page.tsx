"use client";

import { useEffect, useState } from "react";

interface PostPageProps {
  params: {
    id: string;
  };
}

interface Comment {
  id: string;
  text: string;
}

export default function PostPage({ params }: PostPageProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`/api/comments?postId=${params.id}`)
      .then((res) => res.json())
      .then(setComments);
  }, [params.id]);

  const addComment = async () => {
    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        postId: params.id,
        text,
      }),
    });

    const newComment = await res.json();
    setComments([...comments, newComment]);
    setText("");
  };

  return (
    <div>
      <h1>Post</h1>

      <h2>Comments</h2>
      {comments.map((c) => (
        <p key={c.id}>{c.text}</p>
      ))}

      <input
        placeholder="Write comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={addComment}>Add Comment</button>
    </div>
  );
}