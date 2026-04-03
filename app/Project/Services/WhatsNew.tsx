import {  useState } from "react";

const WhatNew = {
  newspost: () => console.log("Displaying new posts..."),
  trending: () => console.log("Displaying trending topics..."),
  search: () => console.log("Searching for content..."),
  events: () => console.log("Displaying upcoming events..."),
};



/* ================= DROPDOWNS ================= */
export function WhatNewDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");

  const handleSelect = (value: string) => {
    setSelected(value);   // 🔥 store selection
    setOpen(false);

    WhatNew[value as keyof typeof WhatNew]?.(); // cleaner call
  };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)}>What New ⬇</button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            background: "blue",
            border: "1px solid black",
            borderRadius: "6px",
            padding: "5px",
            width: "170px",
          }}
        >
          <div onClick={() => handleSelect("Newspost")}>New Posts</div>
          <div onClick={() => handleSelect("Trending")}>Trending</div>
          <div onClick={() => handleSelect("Search")}>Search</div>
          <div onClick={() => handleSelect("Events")}>Events</div>
        </div>
      )}

      {/* 🔥 SHOW RESULT */}
      <div style={{ marginTop: "10px" }}>
        {selected === "Newspost" && <p>Showing new posts...</p>}
        {selected === "Trending" && <p>Showing trending topics...</p>}
        {selected === "Search" && <p>Search content here...</p>}
        {selected === "Events" && <p>Upcoming events...</p>}
      </div>
    </div>
  );
}