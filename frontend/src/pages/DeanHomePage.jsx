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
  
    console.log("authUser:", authUser);
  
    if (!authUser?.department) {
      console.warn("No department found in authUser");
      return;
    }
  
    console.log("Fetching session for:", authUser.department);
    
    const sessionId = await getSession(authUser.department);
  
    console.log("Received session ID:", sessionId);
  
    if (sessionId) {
      sessionStorage.setItem("deanSession", sessionId);
      sessionStorage.setItem("department", authUser.department);
      navigate(`/view-diplomas?session=${sessionId}&department=${authUser.department}`);
    } else {
      console.warn("No session ID received!");
    }
  };
  
  return (
    <div>
      <button onClick={getDeanDepartment}>Submit</button>
    </div>
  );
}

export default DeanHomePage;