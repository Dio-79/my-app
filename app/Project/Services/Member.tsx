import { useState } from "react";

const Member = {
  MemberList: () => console.log("Member List selected"),
  CurrentVisitor: () => console.log("Current Visitor selected"),
  Billboard: () => console.log("Billboard selected"),
  Trophies: () => console.log("Trophies selected"),
};

export function MemberDropdown() {
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    setSelectedMember(value);
    setOpen(false);

    Member[value as keyof typeof Member]?.(); // cleaner
  };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)}>Member ⬇</button>

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
            width: "150px",
          }}
        >
          <div onClick={() => handleSelect("MemberList")}>Member List</div>
          <div onClick={() => handleSelect("CurrentVisitor")}>
            Current Visitor
          </div>
          <div onClick={() => handleSelect("Billboard")}>Billboard</div>
          <div onClick={() => handleSelect("Trophies")}>Trophies</div>
        </div>
      )}

      {/* 🔥 UI OUTPUT */}
      <div style={{ marginTop: "10px" }}>
        {selectedMember === "MemberList" && <p>Member List Content</p>}
        {selectedMember === "CurrentVisitor" && <p>Current Visitor Content</p>}
        {selectedMember === "Billboard" && <p>Billboard Content</p>}
        {selectedMember === "Trophies" && <p>Trophies Content</p>}
      </div>
    </div>
  );
}