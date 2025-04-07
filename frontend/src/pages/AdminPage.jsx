/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Header from "../components/Header";
import { useAdminStore } from "../store/useAdminStore";

function AdminPage() {
  const { diplomas, checkDiplomas, sendSession } = useAdminStore();
  const [studentDiploma, setStudentDiploma] = useState({
    department: "",
    year: "",
  });
  
  const [session, setSession] = useState({
    department: "",
    year: "",
    sessionName: "",
  });
  
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await checkDiplomas(studentDiploma.department, studentDiploma.year);
    setIsSearchSubmitted(true);
    
    // Sync department & year with session state
    setSession({
      ...session,
      department: studentDiploma.department,
      year: studentDiploma.year,
    });
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    await sendSession(session); 
    console.log("Session sent successfully", session); 
  };

  // 🔍 Watch for updates to diplomas
  useEffect(() => {
    console.log("Diplomas updated:", diplomas);
  }, [diplomas]);

  return (
    <div>
      {/* <Header />
      <AdminNavbar /> */}
      
      {/* Search Form */}
      <form onSubmit={handleSubmit}>
        <h2>Search Diplomas</h2>
        <input
          type="text"
          value={studentDiploma.department}
          placeholder="Department"
          onChange={(e) =>
            setStudentDiploma({ ...studentDiploma, department: e.target.value })
          }
          required
        />
        <input
          type="text"
          value={studentDiploma.year}
          placeholder="Year"
          onChange={(e) =>
            setStudentDiploma({ ...studentDiploma, year: e.target.value })
          }
          required
        />
        <button type="submit">Search</button>
      </form>

      {/* Session Creation Form */}
      {isSearchSubmitted && (
        <form onSubmit={handleCreateSession}>
          <h2>Create Graduation Session</h2>
          <input
            type="text"
            value={session.sessionName}
            placeholder="Session Title (e.g., March 2025 Graduates)"
            onChange={(e) =>
              setSession({ ...session, sessionName: e.target.value })
            }
            required
          />
          <input
            type="text"
            value={session.department}
            placeholder="Department"
            readOnly
          />
          <input
            type="text"
            value={session.year}
            placeholder="Year"
            readOnly
          />
          <button type="submit">Send to Dean</button>
        </form>
      )}

      {/* Diplomas List */}
      {diplomas.length > 0 ? (
        <div>
          <h2>Diploma Students:</h2>
          <ul>
            {diplomas.map((student) => (
              <li key={student._id}>
                {student.fullName} - {student.program} - {student.uniqueToken} - {student.email}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        isSearchSubmitted && <h2>No Diplomas Found</h2>
      )}
    </div>
  );
}

export default AdminPage;