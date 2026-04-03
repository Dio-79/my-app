import Studentinfo from "./Studentinfo";



// A small sub-component for your name
function MyHeading() {
  return <h1 style={{ textAlign: "center", fontSize: "24px", backgroundColor: "#8a0707" }}>Student Information</h1>;
  <br/>



}

// This is your MAIN component for the page
export default function Page() {
  return (
    <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <MyHeading />
         <br/>
            <br/>
        <h1>Jesse Umweni</h1>

         <p>This is the student information page.</p>
         <p>Here you can find details about the student.</p>

      
      <div style={{ border: "1px solid white", padding: "15px", margin: "20px 0", borderRadius: "8px" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Student Details</h2>
        <Studentinfo />

         


      </div>
    
     
    </main>
  );
}