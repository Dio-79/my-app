



const Studentaverage1 = {
  name: "Jesse Umweni",
  average: 85.5,
  category: "semester 1"

};

const Studentaverage2 = {
  name: "Jesse Umweni",
  average: 90.2,
  category: "semester 2"
};

const Studentaverage3 = {
    name: "Jesse Umweni",
    average: 88.7,
    category: "semester 3"
};

const Studentaverage4 = {
    name: "Jesse Umweni",
    average: 92.3,
    category: "semester 4"
};

export default function Grade() { 
    return ( 
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" ,border: "1px solid black", borderRadius: "8px", maxWidth: "400px", margin: "0 auto" }}>
            <h1 style={{ textAlign: "center", fontSize: "24px", background: "#8a0c0c" }}>Student Averages</h1>
            <ul>
                <li style={{ marginBottom: "10px" }}>
                    <strong>{Studentaverage1.category}:</strong> {Studentaverage1.average} {Studentaverage1.name}
                </li>
                <li style={{ marginBottom: "10px" }}>
                    <strong>{Studentaverage2.category}:</strong> {Studentaverage2.average} {Studentaverage2.name}
                </li>
                <li style={{ marginBottom: "10px" }}>
                    <strong>{Studentaverage3.category}:</strong> {Studentaverage3.average} {Studentaverage3.name}
                </li>
                <li style={{ marginBottom: "10px" }}>
                    <strong>{Studentaverage4.category}:</strong> {Studentaverage4.average} {Studentaverage4.name}
                </li>
            </ul>
        </div>

);

}