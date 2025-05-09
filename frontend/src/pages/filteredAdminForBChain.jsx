import { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { ChakraProvider } from '@chakra-ui/react';
import DiplomaTemplate from '../components/DiplomaTemplate';
import {  uploadToBlockchain, verifyDiploma} from '../utilss/contactServices';
import { useAdminStore } from '../store/useAdminStore.js';


function FilterAdminForBChain() {

  const { studentDetails, archiveUploadedDiploma} = useAdminStore();
  const [isProcessing, setIsProcessing] = useState(false);


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

  

  const generatePDF = async (student) => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.height = '475px';
    container.style.transform = 'scale(0.😎';
    container.style.transformOrigin = 'top left';
    document.body.appendChild(container);

    const { createRoot } = await import('react-dom/client');
    const root = createRoot(container);
    root.render(
      <ChakraProvider>
        <div style={{ width: '800px', height: '475px' }}>
          <DiplomaTemplate 
             studentName={student.fullName}
             studentId={student.id}
             department={student.program}
             deanSignature={student.deanESignature}
             graduationYear={student.graduationYear}
             registrarSignature={student.registrarESignature}
             studentToken={student.uniqueToken}
          />
        </div>
      </ChakraProvider>
    );

    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
    });

    const pdfBlob = await html2pdf()
      .set({
        margin: 0,
        filename: `${student.token}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 1,
        },
        jsPDF: {
          unit: 'px',
          format: [800, 475],
          orientation: 'portrait'
        }
      })
      .from(canvas)
      .outputPdf('blob');

    root.unmount();
    document.body.removeChild(container);
    return pdfBlob;
  };

  const uploadToIPFS = async (pdfBlob, student) => {
    const formData = new FormData();
    formData.append('file', pdfBlob, `${student.fullName}.pdf`);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY,
          'pinata_secret_api_key': import.meta.env.VITE_PINATA_SECRET_KEY,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data.IpfsHash;
  };

  const processAllStudents = async () => {
    try {
      setIsProcessing(true);
    
      const chunkSize = 5;

      for (let i = 0; i < studentDetails.length; i += chunkSize) {
        const batch = studentDetails.slice(i, i + chunkSize);
        let tokens = [];
        let hashes = [];

      for (const student of batch) {
        try {
          const pdfBlob = await generatePDF(student);
          const ipfsHash = await uploadToIPFS(pdfBlob, student);
          console.log(`✅ Uploaded for ${student.fullName}: ${ipfsHash}`);

          const fileUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
          console.log(fileUrl);
          console.log(student.fullName, student.program, student.expectedYearToGraduate, student.uniqueToken, student.department);
          await archiveUploadedDiploma(fileUrl, student.fullName,  student.program, student.expectedYearToGraduate, student.uniqueToken, student.department);

          tokens.push(student.uniqueToken);
          hashes.push(ipfsHash);


        } catch (error) {
          console.error(`❌ Failed for ${student.fullName}:`, error);
        }
      }

       // Once batch is ready, upload it to the blockchain
      await uploadToBlockchain(tokens, hashes);
      console.log("Batch successfully uploaded to blockchain.");

      

      // Reset for next batch
      tokens = [];
      hashes = [];
    }
  } finally {
    setIsProcessing(false);
  }
};
  return (
    <div>
      <h1>Diploma Generator</h1>
      {studentDetails && studentDetails.length > 0 ? (
        studentDetails.map((student, index) => (
          <div key={index} style={{ marginBottom: '40px', border: '1px solid #ccc', padding: '20px' }}>
            <ChakraProvider>
              <DiplomaTemplate
                studentName={student.fullName}
                studentId={student.id}
                department={student.program}
                deanSignature={student.deanESignature}
                graduationYear={student.graduationYear}
                registrarSignature={student.registrarESignature}
                studentToken={student.uniqueToken}
              />
            </ChakraProvider>
          </div>
        ))
      ) : (
        <p>No students found.</p>
      )}
      <button
        onClick={processAllStudents}
        disabled={isProcessing}
        style={{ marginRight: '10px' }}
      >
        {isProcessing ? 'Processing...' : 'Generate All Diplomas'}
      </button>
      <button
        onClick={async () => {
          await processAllStudents();
        }}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Initialize & Generate'}
      </button>

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

async function html2canvas(element, options) {
  const { default: html2canvas } = await import('html2canvas');
  return html2canvas(element, options);
}

export default FilterAdminForBChain;