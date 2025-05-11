import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { 
  Box, Button, Text, Input, Select, Flex, Heading,
  Grid, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useDisclosure, HStack, useToast,
  ButtonGroup, IconButton, ChakraProvider, Link
} from "@chakra-ui/react";
import DiplomaTemplate from '../components/DiplomaTemplate';
import { FaRegTimesCircle, FaChevronLeft, FaChevronRight, FaCheckCircle, FaTimes } from "react-icons/fa";
import {  uploadToBlockchain, verifyDiploma} from '../utilss/contactServices';
import { useAdminStore } from '../store/useAdminStore.js';


function FilterAdminForBChain() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const department = queryParams.get('department');
  const year = queryParams.get('year');

  const { studentDetails, archiveUploadedDiploma, departmentYears, fetchStudentDetails} = useAdminStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (department && year) {
      console.log(`Loading details for ${department}, ${year}`);
      fetchStudentDetails(department, year);
    }
  }, [department, year, fetchStudentDetails]);

  const [verifyToken, setVerifyToken] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // pagination states
  const [entriesCount, setEntriesCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

       // Success toast
      toast({
        title: "Success",
        description: "All diplomas have been successfully processed and uploaded",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  } finally {
    setIsProcessing(false);
  }
};

  // Pagination function
  const totalPages = Math.ceil(studentDetails.length / entriesCount);
  const startIndex = (currentPage - 1) * entriesCount;
  const paginatedStudents = studentDetails.slice(startIndex, startIndex + entriesCount);

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    let pages = [];
    
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // If more than 5 pages, use a sliding window
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show 2 pages before and 2 pages after current page
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  return (
    <Box display="flex" p="20px" h="100vh">
      <Box flex={1} p={0} position="relative">
        {/* Header */}
        <Box 
          bgGradient="linear(to-l, #be1010, #8C0001)" 
          color="white" 
          p="20px" 
          borderRadius="10px"
          mb="20px"
        >
          <Heading as="h1" fontSize="24px">  View Diplomas </Heading>
        </Box>
          {/* Main Content */}
          <Box 
            flex="1" 
            display="flex" 
            flexDirection="column" 
            overflow="auto"
            px={{ base: "10px", md: "20px" }}
          >
            {/* View Container */}
            <Box 
              width={{ base: "95%", md: "90%" }}
              maxW="950px"
              mx="auto"
              bg="white"
              borderRadius="10px"
              p={{ base: "15px", md: "20px" }}
              boxShadow="0 5px 10px rgba(0, 0, 0, 0.05)"
              mb="20px"
              maxH="80vh"
              overflow="hidden"
              display="flex"
              flexDirection="column"
            >
              {/* Header Info */}
              <Flex 
                justify="space-between" 
                align={{ base: "flex-start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                p={3}
                borderBottom="1px solid #eee"
                mb="20px"
                gap={{ base: "10px", md: "0" }}
              >
                <Box>
                  <Heading size="md" fontWeight={"700"} fontSize="28px">
                      {department} {year}
                  </Heading>
                  <Flex>
                    <Text fontWeight="bold" mr="1" fontSize={{ base: "xs", md: "sm" }}>Status:</Text>
                    <Text fontWeight="bold" fontSize={{ base: "xs", md: "sm" }} color="#2bd025">
                      {studentDetails?.length > 0 ? 'SIGNED' : 'PENDING'}
                    </Text>
                  </Flex>
                </Box>
    
                <Flex gap="3" alignItems="center">
                <Button
                  onClick={processAllStudents}
                  isDisabled={isProcessing}
                  size="sm"
                  colorScheme="red"
                  bg="#8C0001"
                  color="white"
                  _hover={{ bg: "#be1010" }}
                >
                  {isProcessing ? 'Processing...' : 'Generate All Diplomas'}
                </Button>
                <Button
                  onClick={processAllStudents}
                  isDisabled={isProcessing}
                  size="sm"
                  colorScheme="red"
                  bg="#8C0001"
                  color="white"
                  _hover={{ bg: "#be1010" }}
                >
                  {isProcessing ? 'Processing...' : 'Initialize & Generate'}
                </Button>


                <Link to="/admin/dashboard">
                  <IconButton
                    aria-label="Close"
                    icon={<FaTimes />}
                    size="sm"
                    borderRadius="full"
                    border="1px solid #d0253c"
                    color="#d0253c"
                    bg="transparent"
                    _hover={{ bg: "#f8e0e3", color: "#b01e32" }}
                  />
                </Link>
                </Flex>
              </Flex>
            {/* Upper Pagination */}
            {studentDetails.length > 0 && (
              <Flex justify="center" align="center" p={3} borderBottom="1px" borderColor="gray.200" bg="gray.50">
                <ButtonGroup isAttached variant="outline" size="sm">
                  <IconButton 
                    icon={<FaChevronLeft />} 
                    aria-label="Previous page" 
                    isDisabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                  
                  {generatePaginationNumbers().map(pageNum => (
                    <Button
                      key={pageNum}
                      colorScheme={currentPage === pageNum ? "red" : "gray"}
                      variant={currentPage === pageNum ? "solid" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  
                  <IconButton 
                    icon={<FaChevronRight />} 
                    aria-label="Next page" 
                    isDisabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </ButtonGroup>
                
                <Text ml={4} fontSize="sm" color="gray.600">
                  Page {currentPage} of {Math.max(1, totalPages)} 
                  {" "}({studentDetails.length} total results)
                </Text>
              </Flex>
          )}
          {/*Diploma Container */}
          <Box 
              flex="1" 
              overflowY="auto" 
              p={2} 
              css={{
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#d0d0d0',
                  borderRadius: '10px',
                  '&:hover': {
                    background: '#c0c0c0',
                  },
                },
              }}
            >
          {studentDetails && studentDetails.length > 0 ? (
            studentDetails.map((student, index) => (
              <Box key={index} mb="20px" overflow="hidden">
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
              </Box>
            ))
          ) : (
            <Text p={4} textAlign="center" color="gray.500">No students found.</Text>
          )}
          </Box>
          </Box>
        </Box>
    </Box>
    {/* Hinide ko lang yung verify diploma */}
{/* 
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
*/}
  </Box>
  );
}

async function html2canvas(element, options) {
  const { default: html2canvas } = await import('html2canvas');
  return html2canvas(element, options);
}

export default FilterAdminForBChain;