import { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { ChakraProvider } from '@chakra-ui/react';
import DiplomaTemplate from '../components/DiplomaTemplate';

function Tae() {
  const [students] = useState([
    { 
      name: "Alice Johnson",
      id: "STU-001",
      department: "Computer Science",
      graduationYear: "2023",
      token: "ec456ce8-c99d-461b-994a-100cef506b56"
    },
    { 
      name: "Aliczvxcvcxve Johnson",
      id: "STU-001",
      department: "Computer Science",
      graduationYear: "2023",
      token: "ec456ce8-c99d-461b-994a-100cef506b56"
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

  const generatePDF = async (student) => {
    // 1. Create temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.height = '475px';
    document.body.appendChild(container);

    // 2. Render with Chakra Provider
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(container);
    root.render(
      <ChakraProvider>
        <div style={{ width: '800px', height: '475px' }}>
          <DiplomaTemplate
            studentName={student.name}
            studentId={student.id}
            department={student.department}
            graduationYear={student.graduationYear}
          />
        </div>
      </ChakraProvider>
    );

    // 3. Wait for rendering (longer timeout for Chakra)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 4. Convert to image first (fixes Chakra styling issues)
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
    });

    // 5. Generate PDF from canvas
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

    // 6. Clean up
    root.unmount();
    document.body.removeChild(container);
    return pdfBlob;
  };

  const uploadToIPFS = async (pdfBlob, student) => {
    const formData = new FormData();
    formData.append('file', pdfBlob, `${student.name}.pdf`);

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
    setIsProcessing(true);
    try {
      for (const student of students) {
        try {
          const pdfBlob = await generatePDF(student);
          const ipfsHash = await uploadToIPFS(pdfBlob, student);
          console.log(`✅ ${student.name}:`, ipfsHash);
        } catch (error) {
          console.error(`❌ ${student.name}:`, error);
        }
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
    </div>
  );
}

// Helper function to use html2canvas directly
async function html2canvas(element, options) {
  const { default: html2canvas } = await import('html2canvas');
  return html2canvas(element, options);
}

export default Tae;