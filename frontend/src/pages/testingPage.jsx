import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDeanStore } from "../store/useDeanStore";

function DeanHomePage() {
  const [department, setDepartment] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const { getSession, UrlSession, setUrlSession, studentDetails, getEsignature ,digitalSignature, eSignature } = useDeanStore();
  const [esignatures, setEsignature] = useState(null); // Storing just one signature

  useEffect(() => {
    const sessionIdFromUrl = searchParams.get("session");
    const departmentFromUrl = searchParams.get("department");

    if (sessionIdFromUrl && departmentFromUrl) {
      setUrlSession(sessionIdFromUrl);
      getSession(departmentFromUrl);
    } else {
      const storedSession = localStorage.getItem("sessionId");
      const storedDept = localStorage.getItem("department");

      if (storedSession && storedDept) {
        setUrlSession(storedSession);
        getSession(storedDept);
        setSearchParams({ session: storedSession, department: storedDept });
      }
    }
    console.log(studentDetails);
  }, []);

  //TODO will hati hati this functionalities
  const handleSubmit = async (e) => {
    e.preventDefault();

    const sessionId = await getSession(department);
    if (sessionId) {
      setSearchParams({ session: sessionId, department });
    }

    await getEsignature();  // Wait for the signature to be fetched

    const storedSignature = useDeanStore.getState().eSignature;
    setEsignature(storedSignature);  // Set the single signature (no need to store in an array)

    console.log("Signature fetched:", storedSignature);

    console.log(studentDetails);
    digitalSignature(studentDetails, storedSignature);  // Send the single signature
    console.log("Success", studentDetails);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <p className="mt-4">📦 Session ID: {UrlSession || "None yet"}</p>
      <ul>
        {studentDetails.map((student) => (
          <li key={student._id}>
            {esignatures ? (
              <img
                src={eSignature}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
            ) : (
              <p>Upload signature please</p>
            )}
            <strong>{student.fullName}</strong> ({student.idNumber}) - {student.email} - {student.department} - {student.expectedYearToGraduate
            }
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeanHomePage;
