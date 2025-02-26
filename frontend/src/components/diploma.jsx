
function Diploma({ studentName, courseName, date, institutionName, deanName, deanSignature, digitalSignature }) {
  return (
    <div className="diploma">
      <h2>{institutionName}</h2>
      <p><strong>Student Name:</strong> {studentName}</p>
      <p><strong>Course:</strong> {courseName}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Dean:</strong> {deanName ? deanName : "Not signed yet"}</p>
      <p><strong>Signature:</strong> {deanSignature ? deanSignature : "Not signed yet"}</p>
      
      {/* Show Digital Signature Status */}
      <p style={{ color: digitalSignature ? "green" : "red", fontWeight: "bold" }}>
        {digitalSignature ? "✔ Digitally Signed" : "✖ Not Digitally Signed"}
      </p>
    </div>
  );
}

export default Diploma;
