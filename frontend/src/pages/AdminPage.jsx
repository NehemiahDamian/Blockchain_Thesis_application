/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Header from "../components/Header";
import { useAdminStore} from "../store/useAdminStore";

function AdminPage() {
  const { diplomas, checkDiplomas, sendSession} = useAdminStore();
  const [studentDiploma, setStudentDiploma] = useState({
    department: "",
    year: "",
  });
  
  const [session, setSession] = useState({
    department:"",
    year: "",
    sessionName: "",
  });
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    await checkDiplomas(studentDiploma.department, studentDiploma.year);
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={studentDiploma.department}
          placeholder="Department"
          onChange={(e) =>
            setStudentDiploma({ ...studentDiploma, department: e.target.value })
          }
        />
        <input
          type="text"
          value={studentDiploma.year}
          placeholder="Year"
          onChange={(e) =>
            setStudentDiploma({ ...studentDiploma, year: e.target.value })
          }
        />

        
        <button type="submit">Search</button>
      </form>

    <form onSubmit={handleCreateSession}>
      <input
        type="text"
        value={session.sessionName}
        placeholder="Title (e.g., March 2025 Graduates)"
        onChange={(e) =>
          setSession({ ...session, sessionName: e.target.value })
        }
      />
       <input
        type="text"
        value={session.department}
        placeholder="Department"
        onChange={(e) =>
          setSession({ ...session, department: e.target.value })
        }
      />
       <input
        type="text"
        value={session.year}
        placeholder="year"
        onChange={(e) =>
          setSession({ ...session, year: e.target.value })
        }
      />
      <button type="submit">Send to Deans</button>
  </form>

      {diplomas.length > 0 ? (
        <div>
          <h2>Diploma Students:</h2>
          <ul>
            {diplomas.map((student) => (
              <li key={student._id}>
                {student.fullName} - {student.program} - {student.uniqueToken} -{student.email}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <h1>No Diplomas</h1>
      )}
    </div>
  );
}

export default AdminPage;
