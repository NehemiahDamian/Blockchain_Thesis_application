/* eslint-disable no-unused-vars */

import { useDeanStore } from "../store/useDeanStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

function DeanHomePage() {

  // need den to for functionalities
  const authUser = useAuthStore(state => state.authUser); // Get authUser inside component

  // need to dito manggaling yung functionalities
  const { getSession, UrlSession, setUrlSession, studentDetails, getEsignature, digitalSignature, eSignature } = useDeanStore();
 
  // for filtering the page
  const navigate = useNavigate();

  // eto yung function nayon need den to mahalaga to no 
  // hinde pede tanggalen
  const getDeanDepartment = async (e) => {
    // need to for not doing the default things ng React medyo magulo hirap iexplain
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
      navigate(`/dean/view-diplomas?session=${sessionId}&department=${authUser.department}`);
    } else {
      console.warn("No session ID received!");
    }
  };
  
  return (
    <div>
      {/* for anoto like filtered page like need to to fecth coressponding diploma ng mga dean like
      COT diplomas -> dean ng COT */}
        {/* // hinde pede tanggalen */}
       <button onClick={getDeanDepartment}>Submit</button>
    </div>
  );
}

export default DeanHomePage;