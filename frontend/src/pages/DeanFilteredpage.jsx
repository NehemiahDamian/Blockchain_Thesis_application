/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDeanStore } from "../store/useDeanStore";
// import { useAuthStore } from "../store/useAuthStore";

function ViewDiplomasPage() {
  // const [department, setDepartment] = useState("");
  // const authUser = useAuthStore(state => state.authUser); // Get authUser inside component

  const {  UrlSession, studentDetails, getEsignature, digitalSignature, eSignature } = useDeanStore();
  const [esignatures, setEsignature] = useState(null);
  const [handleEsigbtn, setHandleEsigbtn] = useState(false);
  
  
  // useEffect(() => {
  //   const storedSession = sessionStorage.getItem("deanSession");
  //   const storedDept = sessionStorage.getItem("department");

  //   if (storedSession && storedDept) {
  //     setUrlSession(storedSession);
  //     getSession(storedDept);
  //   }
  // }, []);


  const handleEsig = async () => {
    await getEsignature();
    const storedSignature = useDeanStore.getState().eSignature;
    setEsignature(storedSignature);
    setHandleEsigbtn(true);
  }

  const handleDigitalSignature = async () => {
    if(esignatures === null) {
      alert("Please upload your eSignature first.");
      return;
    } 
    await digitalSignature(studentDetails, esignatures);  
  }
  return (
    <div>
    <button onClick={handleEsig}>E-Sig</button>
    {handleEsigbtn && <button onClick={handleDigitalSignature}>Digital sign</button>}
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
            <strong>{student.fullName}</strong> ({student.idNumber}) - {student.email} - {student.department} - {student.expectedYearToGraduate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewDiplomasPage;