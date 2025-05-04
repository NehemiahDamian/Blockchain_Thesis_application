import{ useState } from 'react';
import axios from 'axios';
import { Button, Text, VStack, Link, useToast, Box } from '@chakra-ui/react';
import { renderToString } from 'react-dom/server';
import DiplomaTemplate from '../components/DiplomaTemplate';

const Tae = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsResult, setIpfsResult] = useState(null);
  const toast = useToast();

  // Test with ONE student
  const testStudent = {
    fullName: "Maria Santos",
    idNumber: "2023-001",
    department: "Computer Science",
    deanESignature: "/dean_sig.png", // Replace with actual path
    expectedYearToGraduate: "2023",
    registrarDigitalSignature: "/registrar_sig.png" // Replace
  };

  const uploadDiplomaToIPFS = async () => {
    setIsUploading(true);
    setIpfsResult(null);

    try {
      // 1. Render Diploma to HTML
      const diplomaHTML = renderToString(
        <DiplomaTemplate 
          studentName={testStudent.fullName}
          studentId={testStudent.idNumber}
          department={testStudent.department}
          deanSignature={testStudent.deanESignature}
          graduationYear={testStudent.expectedYearToGraduate}
          registrarSignature={testStudent.registrarDigitalSignature}
        />
      );

      // 2. Create a Blob (HTML or PDF)
      const blob = new Blob([diplomaHTML], { type: 'text/html' });
      
      // 3. Prepare FormData for Pinata
      const formData = new FormData();
      formData.append('file', blob, `${testStudent.idNumber}_diploma.html`);

      // 4. Upload to Pinata
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
          },
        }
      );

      // 5. Save the result
      setIpfsResult({
        cid: response.data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      });

      toast({
        title: "Success!",
        description: "Diploma uploaded to IPFS.",
        status: "success",
      });

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.message,
        status: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <VStack spacing={4} p={4}>
      <Button 
        onClick={uploadDiplomaToIPFS}
        isLoading={isUploading}
        colorScheme="blue"
      >
        Test IPFS Upload (1 Student)
      </Button>

      {ipfsResult && (
        <Box mt={4}>
          <Text><strong>IPFS CID:</strong> {ipfsResult.cid}</Text>
        
        </Box>
      )}
    </VStack>
  );
};

export default Tae;