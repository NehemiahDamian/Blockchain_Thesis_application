/* eslint-disable no-unused-vars */

import { useDeanStore } from "../store/useDeanStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

function DeanHomePage() {

  const authUser = useAuthStore(state => state.authUser); // Get authUser inside component

  const { getSession, UrlSession, setUrlSession, studentDetails, getEsignature, digitalSignature, eSignature } = useDeanStore();
 

  const navigate = useNavigate();

  const getDeanDepartment = async (e) => {
    e.preventDefault();
    if (!authUser?.department) return;
  
    const sessionId = await getSession(authUser.department);
    if (sessionId) {
      // setSearchParams({ session: sessionId, department: authUser.department });
      sessionStorage.setItem("deanSession", sessionId);
      sessionStorage.setItem("department", authUser.department);
      navigate(`/view-diplomas?session=${sessionId}&department=${authUser.department}`);

    }
  };

  return (
    <div>
      <button onClick={getDeanDepartment}>Submit</button>
    </div>
  );
}

export default DeanHomePage;