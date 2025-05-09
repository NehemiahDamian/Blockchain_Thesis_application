import { useState } from 'react';
import {   verifyDiploma} from '../utilss/contactServices';
'../store/useAdminStore.js';


function VerifierSide() {


//For testing only
  const [verifyToken, setVerifyToken] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

// Add this function (import verifyDiploma from your contactServices)
const handleVerifyDiploma = async () => {
  try {
    console.log("Started verification process");
    setIsVerifying(true);

    console.log("Calling verifyDiploma with token:", verifyToken);
    const result = await verifyDiploma(verifyToken);

    console.log("Verification result:", result);
    setVerificationResult(result);
  } catch (error) {
    console.error("Verification failed:", error);
    setVerificationResult({ isValid: false, error: error.message });
  } finally {
    setIsVerifying(false);
  }
};

  

  
  return (
    <div>
 
     

      <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #eee" }}>
  <h2>Verify Diploma</h2>

  <input
    type="text"
    value={verifyToken}
    onChange={(e) => setVerifyToken(e.target.value)}
    placeholder="Enter student token"
    style={{ padding: "8px", marginRight: "10px" }}
  />
  <button onClick={handleVerifyDiploma} disabled={isVerifying}>
    {isVerifying ? "Verifying..." : "Verify"}
  </button>
  {verificationResult && (
    <div style={{ marginTop: "10px" }}>
      <p>
        <strong>Status:</strong>{" "}
        {verificationResult.isValid ? "✅ Valid" : "❌ Invalid"}
      </p>
      {verificationResult.timestamp && (
        <p>
          <strong>Issued on:</strong>{" "}
          {new Date(verificationResult.timestamp * 1000).toLocaleString()}
        </p>
      )}
      {verificationResult.error && (
        <p style={{ color: "red" }}>Error: {verificationResult.error}</p>
      )}
    </div>
  )}
</div>
    </div>
  );
}




export default VerifierSide
  