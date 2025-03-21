import { useRef } from "react";
import html2pdf from "html2pdf.js/dist/html2pdf.bundle.min.js";

// Sample student data (you can load this from a backend too)
const students = [
  { idNumber: "123456", name: "Juan Dela Cruz" },
  { idNumber: "654321", name: "Maria Santos" },
  { idNumber: "111222", name: "Pedro Reyes" },
  { idNumber: "333444", name: "Ana Lopez" },
  { idNumber: "555666", name: "Jose Rizal" },
];

const App = () => {
  const diplomaRefs = useRef({});

  // This function converts all diplomas to PDF in batch
  const generateAllDiplomas = () => {
    students.forEach((student) => {
      const element = diplomaRefs.current[student.idNumber]; // Get the student's diploma UI

      if (element) {
        const filename = `${student.idNumber}_${student.name.replaceAll(" ", "_")}_diploma.pdf`;

        html2pdf()
          .set({
            margin: 1,
            filename: filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
          })
          .from(element)
          .save();
      }
    });
  };

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>Diploma Generator</h1>
      <button onClick={generateAllDiplomas} style={{ marginBottom: "20px" }}>
        Generate All Diplomas (PDF)
      </button>

      {students.map((student) => (
        <div
          key={student.idNumber}
          ref={(el) => (diplomaRefs.current[student.idNumber] = el)}
          style={{
            border: "2px solid black",
            padding: "20px",
            marginBottom: "20px",
            width: "600px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2>Diploma</h2>
          <p>This certifies that:</p>
          <h3>{student.name}</h3>
          <p>with ID Number: {student.idNumber}</p>
          <p>has successfully completed their program.</p>
        </div>
      ))}
    </div>
  );
};

export default App;
