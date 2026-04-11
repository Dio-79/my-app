"use client";

import Image from "next/image";

export default  function CommentPage() {
  return (
    <div style={{ padding: "40px", background: "#1a1a1a", minHeight: "100vh", color: "white" }}>
      <h1>💬 Comments</h1>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <Image
          src="/default-avatar.png"
          alt="Default user avatar"
          width={35}
          height={35}
          style={{ borderRadius: "50%" }}
        />
        <p>No comments yet.</p>
      </div>
    </div>
  );
}