import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDeanStore } from "../store/useDeanStore";
import { useAuthStore } from "../store/useAuthStore";
import { p } from "framer-motion/client";
function DeanHomePage() {
  const [department, setDepartment] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const { getSession, UrlSession, setUrlSession, studentDetails, getEsignature ,digitalSignature, eSignature, deanName } = useDeanStore();
  const [esignatures, setEsignature] = useState("");
  // Restore session from URL if exists
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
      setSearchParams({ session: storedSession, department: storedDept }); // 👈 this line makes the URL update!
    }
  }
  console.log( studentDetails)
}, []);

  
  
  

const handleSubmit = async (e) => {
  e.preventDefault();

  const sessionId = await getSession(department);
  if (sessionId) {
    setSearchParams({ session: sessionId, department });
  }

  await getEsignature();  // ✅ Wait for the signature to be fetched

  // ✅ Ensure eSignature is stored correctly as an array
  const storedSignature = useDeanStore.getState().eSignature;
  setEsignature([storedSignature]); // Store in an array

  console.log("signature:", storedSignature);

  console.log(studentDetails);
  digitalSignature(studentDetails, [storedSignature]); // ✅ Send as an array
  console.log("success", studentDetails);
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
        ) :<p>Upload signature please</p>}
           
        <strong>{student.fullName}</strong> ({student.idNumber}) - {student.email}
    </li>
  ))}
</ul>


    </div>
  );
}

export default DeanHomePage;
