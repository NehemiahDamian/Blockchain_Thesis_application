import { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { ChakraProvider } from '@chakra-ui/react';
import DiplomaTemplate from '../components/DiplomaTemplate';
import { initialize, uploadToBlockchain } from '../utilss/contactServices';


function FilterAdminForBChain() {



  const [students] = useState([
    { 
      fullName: "Alice Johnson",
      id: "STU-001",
      department: "Computer Science",
      graduationYear: "2023",
      token: "ec456ce8-c99d-461b-994a-100cef506b56",
      deanESignature: "dasdasdas",
      registrarDigitalSignature: "dasdasdasdas"
    },
    { 
      fullName: "Aliczvxcvcxve Johnson",
      id: "STU-002",
      department: "Computer Science",
      graduationYear: "2023",
      token: "ec456ce8-c99d-461b-994a-100cef506b57",
      deanESignature: "dasdasdzzxcas",
      registrarDigitalSignature: "dasdasdasdas"
    },

  ]);

  const [isProcessing, setIsProcessing] = useState(false);

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
            department={student.department}
            deanSignature={student.deanESignature}
            graduationYear={student.graduationYear}
            registrarSignature={student.registrarDigitalSignature}
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

      for (let i = 0; i < students.length; i += chunkSize) {
        const batch = students.slice(i, i + chunkSize);
        let tokens = [];
        let hashes = [];

      for (const student of batch) {
        try {
          const pdfBlob = await generatePDF(student);
          const ipfsHash = await uploadToIPFS(pdfBlob, student);
          console.log(`✅ Uploaded for ${student.fullName}: ${ipfsHash}`);

          tokens.push(student.token);
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
      <button 
        onClick={processAllStudents} 
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Generate All Diplomas'}
      </button>
      <button 
  onClick={async () => {
    await initialize();  // Now triggered by user interaction
    await processAllStudents(); // Optional
  }}
  disabled={isProcessing}
>
  {isProcessing ? 'Processing...' : 'Generate All Diplomas'}
</button>

    </div>
  );
}

async function html2canvas(element, options) {
  const { default: html2canvas } = await import('html2canvas');
  return html2canvas(element, options);
}

export default FilterAdminForBChain;