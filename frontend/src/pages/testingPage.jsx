import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDeanStore } from "../store/useDeanStore";

function TestingPage() {
  const [department, setDepartment] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const { getSession, UrlSession, setUrlSession, studentDetails } = useDeanStore();

  // Restore session from URL if exists
  useEffect(() => {
    const sessionId = searchParams.get("session");
    const departmentFromSearch = searchParams.get("department");
  
    if (sessionId && !UrlSession) {
      setUrlSession(sessionId);
  
      // Re-fetch student details if we have the department
      if (departmentFromSearch) {
        getSession(departmentFromSearch);
      }
    }
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionId = await getSession(department);
    if (sessionId) {
      setSearchParams({ session: sessionId, department }); 
    }
    console.log(studentDetails)
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
      <strong>{student.fullName}</strong> ({student.idNumber}) - {student.email}
    </li>
  ))}
</ul>


    </div>
  );
}

export default TestingPage;
