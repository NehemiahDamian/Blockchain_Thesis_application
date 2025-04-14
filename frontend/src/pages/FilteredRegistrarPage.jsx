import { useState } from "react";
import { useRegistrarStore } from "../store/useRegistrarStore";

function ViewDiplomasPage() {
  const [esignatures, setEsignature] = useState(null);

  const {
    studentDetails,
    getEsignature,
    eSignature,
    digitalSignature
  } = useRegistrarStore();

  const handleEsig = async () => {
    await getEsignature();
    setEsignature(useRegistrarStore.getState().eSignature);
  };

  const handleDigitalSignature = async () => {
    if (!esignatures) {
      alert("Please upload your eSignature first.");
      return;
    }

    if (typeof digitalSignature !== "function") {
      console.error("digitalSignature is not a function");
      return;
    }

    await digitalSignature(studentDetails, esignatures);
  };

  return (
    <div>
      <h2>Students</h2>
      <button onClick={handleEsig}>Upload Esigggg signature</button>
      <button onClick={handleDigitalSignature}>D-Sign</button>
      <ul>
        {studentDetails.map((student) => (
          <li key={student._id}>
            {esignatures ? (
              <img
                src={eSignature}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
            ) : (
              <p>Upload signature please</p>
            )}
            <strong>{student.fullName}</strong> - {student.department} - {student.expectedYearToGraduate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewDiplomasPage;
