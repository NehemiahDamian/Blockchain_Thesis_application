/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDeanStore } from "../store/useDeanStore";
import { 
  Box, Button, Text, Input, Select, Icon, Flex, Heading,
  Grid, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useDisclosure, HStack, useToast,
  ButtonGroup, IconButton
} from "@chakra-ui/react";
import { FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DiplomaTemplate from "../components/DiplomaTemplate";

function ViewDiplomasPage() {
  // const [department, setDepartment] = useState("");
  // const authUser = useAuthStore(state => state.authUser); // Get authUser inside component

  // button states
  const [signatureUploaded, setSignatureUploaded] = useState(false);
  const [showDigitalSignBtn, setShowDigitalSignBtn] = useState(false);
  // signatures states
  const {  UrlSession, studentDetails, getEsignature, digitalSignature, eSignature, sessionName } = useDeanStore();
  const [esignatures, setEsignature] = useState(null);
  const [handleEsigbtn, setHandleEsigbtn] = useState(false);
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesCount, setEntriesCount] = useState(10);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  // Modal
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const { isOpen: isCompletionOpen, onOpen: onCompletionOpen, onClose: onCompletionClose } = useDisclosure();
  const toast = useToast(); // For notifications
  
  // useEffect(() => {
  //   const storedSession = sessionStorage.getItem("deanSession");
  //   const storedDept = sessionStorage.getItem("department");

  //   if (storedSession && storedDept) {
  //     setUrlSession(storedSession);
  //     getSession(storedDept);
  //   }
  // }, []);

  //naglagay lang ng if else for activation of buttons
  const handleEsig = async () => {
    await getEsignature();
    const storedSignature = useDeanStore.getState().eSignature;
    if (storedSignature) {
      setEsignature(storedSignature);
      setSignatureUploaded(true); // para makita na may signature na
      setShowDigitalSignBtn(true); // para mapalitan yung text sa ubtton
    }
    setHandleEsigbtn(true);
  }

  const handleDigitalSignature = async () => {
    if(esignatures === null) {
      alert("Please upload your eSignature first.");
      return;
    } 
    onConfirmOpen();
  }

const confirmSign = async () => {
  onConfirmClose();
  
  try {
    // Attempt to sign diplomas
    const result = await digitalSignature(studentDetails, esignatures);
    
    // Check if the response contains an error (from backend or store)
    if (result?.error) {
      throw new Error(result.message || "Failed to sign diplomas");
    }
    
    // If successful, show completion modal
    onCompletionOpen();
    
    // Show success toast
    toast({
      title: "Success",
      description: "Diplomas signed successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
  } catch (error) {
    console.error("Signing error:", error);
    
    // Determine the error message
    let errorMessage = "An error occurred while signing diplomas";
    
    if (error.message.includes("already have signatures")) {
      errorMessage = error.message;
    } else if (error.message.includes("private key is missing")) {
      errorMessage = "Authorization error: Please ensure you're properly logged in";
    } else if (error.message.includes("No students found")) {
      errorMessage = "No students selected for signing";
    }
    
    // Show error toast
    toast({
      title: "Signing Failed",
      description: errorMessage,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
}


  // Filter students based on search
  const filteredStudents = studentDetails
    .filter(student => student.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / entriesCount);
  const startIndex = (currentPage - 1) * entriesCount;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + entriesCount);

  // Reset to first page when search term or entries count changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesCount]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

    
  const cardStyle = {
    bg: "white", 
    p: 5, 
    borderRadius: "md", 
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)"
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
        >
          <Heading as="h1" fontSize="24px">Process Diplomas</Heading>
        </Box>
      {/* Content */}
      <Flex p={6} h="calc(100vh - 140px)" direction={{ base: "column", md: "row" }} gap={6}>
        {/* Left Panel */}
        <Box w={{ base: "100%", md: "25%" }} h="fit-content">
          <Box {...cardStyle} mb={4}>
            {!handleEsigbtn ? (
              <Button 
                colorScheme="green"
                size="sm"
                w="full"
                p={5}
                onClick={handleEsig}
                fontWeight="bold"
              >
                E-Sign Diplomas
              </Button>
            ) : (
              <Button 
                colorScheme="green"
                size="sm"
                w="full"
                p={5}
                onClick={handleDigitalSignature}
                fontWeight="bold"
              >
                Digitally Sign Diplomas
              </Button>
            )}
          </Box>
          {/* Signature Section */}
          {handleEsigbtn && (
            <Box {...cardStyle}>
              <Heading size="sm" mb={3}>Signature:</Heading>
              
              {signatureUploaded ? (
                <Flex align="center" color="green.500">
                  <Icon as={FaCheckCircle} mr={2} />
                  <Text fontWeight="bold">Signature uploaded</Text>
                </Flex>
              ) : (
                <Text color="gray.600">Upload your signature</Text>
              )}
              
              <Text fontSize="sm" color="gray.500">
                Accepted Formats: PNG
              </Text>
            </Box>
          )}
        </Box>
          {/* Right Panel with Diploma Grid */}
          <Box 
            flex={1} 
            bg="white" 
            borderRadius="md" 
            boxShadow="0 2px 10px rgba(0, 0, 0, 0.07)"
            overflow="auto"
            maxH={{ base: "none", md: "calc(100vh - 140px)" }}
          >
            {/* List Header */}
            <Flex 
              justify="space-between" 
              align={{ base: "flex-start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              p={4}
              borderBottom="1px"
              borderColor="gray.200"
            >
              <Heading size="md">{sessionName}</Heading>
              
              <Flex 
                mt={{ base: 4, md: 0 }}
                w={{ base: "full", md: "auto" }}
                gap={4}
                direction={{ base: "column", md: "row" }}
                align={{ base: "stretch", md: "center" }}
              >
                <Input 
                  placeholder="Search Name:" 
                  size="md" 
                  w={{ base: "full", md: "200px" }}
                  borderRadius="full"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  _focus={{ borderColor: "red.500", boxShadow: "0 0 0 1px rgba(211, 49, 57, 0.1)" }}
                />
                
                <Flex align="center">
                  <Text fontSize="sm" mr={2}>Show</Text>
                  <Select 
                    size="sm" 
                    w="70px" 
                    value={entriesCount}
                    onChange={(e) => setEntriesCount(Number(e.target.value))}
                    borderRadius="md"
                  >
                    {[10, 25, 50, 100].map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </Select>
                  <Text fontSize="sm" ml={2}>entries</Text>
                </Flex>
              </Flex>
            </Flex>

        {/* Upper Pagination */}
        {filteredStudents.length > 0 && (
              <Flex justify="center" align="center" p={3} borderBottom="1px" borderColor="gray.200" bg="gray.50">
                <ButtonGroup isAttached variant="outline" size="sm">
                  <IconButton 
                    icon={<FaChevronLeft />} 
                    aria-label="Previous page" 
                    isDisabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                  
                  {generatePaginationNumbers().map(pageNum => (
                    <Button
                      key={pageNum}
                      colorScheme={currentPage === pageNum ? "red" : "gray"}
                      variant={currentPage === pageNum ? "solid" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  
                  <IconButton 
                    icon={<FaChevronRight />} 
                    aria-label="Next page" 
                    isDisabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </ButtonGroup>
                
                <Text ml={4} fontSize="sm" color="gray.600">
                  Page {currentPage} of {Math.max(1, totalPages)} 
                  {" "}({filteredStudents.length} total results)
                </Text>
              </Flex>
            )}

            {/* Diploma Grid */}
            <Grid templateColumns={{ base: "repeat(1, 1fr)" }} gap={6} p={6}>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <Box 
                    key={student._id}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    overflow="hidden"
                    transition="transform 0.2s"
                    _hover={{ transform: "scale(1.02)" }}
                  >
                    <DiplomaTemplate 
                      studentName={student.fullName}
                      studentId={student.idNumber}
                      department={student.program}
                      graduationYear={student.expectedYearToGraduate}
                      signature={signatureUploaded ? esignatures : null}
                      signerRole="dean"
                        gwa={student.GWA} // Just add this

                    />
                  </Box>
                ))
              ) : (
                <Text p={4} color="gray.500">No diplomas found or no students match the search criteria.</Text>
              )}
            </Grid>

         {/* Lower Pagination */}
            {filteredStudents.length > entriesCount && (
              <Flex justify="center" align="center" p={4} borderTop="1px" borderColor="gray.200">
                <ButtonGroup isAttached variant="outline" size="sm">
                  <IconButton 
                    icon={<FaChevronLeft />} 
                    aria-label="Previous page" 
                    isDisabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                  
                  {generatePaginationNumbers().map(pageNum => (
                    <Button
                      key={pageNum}
                      colorScheme={currentPage === pageNum ? "red" : "gray"}
                      variant={currentPage === pageNum ? "solid" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  
                  <IconButton 
                    icon={<FaChevronRight />} 
                    aria-label="Next page" 
                    isDisabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </ButtonGroup>
              </Flex>
            )}
          </Box>
        </Flex>
      </Box>
    {/* Modals */}
     {/* Confirmation Modal */}
     <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px)" />
        <ModalContent p={5}>
          <ModalHeader textAlign="center">
            <Text fontSize="xl" fontWeight="bold">
              Are you sure you want to sign all diplomas for {sessionName}?
            </Text>
          </ModalHeader>
          <ModalBody>
            <HStack spacing={4} justify="center" mt={4} mb={4}>
              <Button 
                colorScheme="red" 
                onClick={confirmSign} 
                size="lg" 
                w="120px"
                borderRadius="full"
                boxShadow="0 2px 5px rgba(0,0,0,0.1)"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
                }}
              >
                Yes
              </Button>
              <Button 
                variant="outline" 
                onClick={onConfirmClose} // dito nakalagay yung function na pagsave ng digital signature
                size="lg" 
                w="120px"
                borderRadius="full"
                bg="gray.100"
                color="gray.600"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
                }}
              >
                No
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Completion Modal */}
      <Modal isOpen={isCompletionOpen} onClose={onCompletionClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px)" />
        <ModalContent p={5}>
          <ModalCloseButton 
            w="30px"
            h="30px"
            borderRadius="full"
            bg="gray.100"
            _hover={{ bg: "red.500", color: "white" }}
          />
          <ModalBody textAlign="center" py={8}>
            <Heading size="lg" mb={4}>Signing Complete</Heading>
            <Text fontSize="md" color="gray.600">
              {filteredStudents.length} out of {studentDetails.length} diplomas have been signed successfully
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ViewDiplomasPage;