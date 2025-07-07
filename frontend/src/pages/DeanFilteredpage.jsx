/* eslint-disable no-unused-vars */
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
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";


function ViewDiplomasPage() {
 
  const navigate = useNavigate();
  const [signatureUploaded, setSignatureUploaded] = useState(false);
  const [showDigitalSignBtn, setShowDigitalSignBtn] = useState(false);
  const {  UrlSession, studentDetails, getEsignature, digitalSignature, eSignature, sessionName } = useDeanStore();
  const [esignatures, setEsignature] = useState(null);
  const [handleEsigbtn, setHandleEsigbtn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesCount, setEntriesCount] = useState(10);
  
  const [currentPage, setCurrentPage] = useState(1);

  // Modal
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const { isOpen: isCompletionOpen, onOpen: onCompletionOpen, onClose: onCompletionClose } = useDisclosure();
  const toast = useToast(); // For notifications
  const {authUser} = useAuthStore();
  

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

  const getProgramsWithCounts = () => {
  const programMap = new Map();
  
  studentDetails.forEach(student => {
    if (programMap.has(student.program)) {
      programMap.set(student.program, programMap.get(student.program) + 1);
    } else {
      programMap.set(student.program, 1);
    }
  });

  return Array.from(programMap.entries()).map(([program, count]) => ({
    program,
    count
  }));
};

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

    //pagination numbers
    const generatePaginationNumbers = () => {
      let pages = [];
      
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
        } else if (currentPage >= totalPages - 2) {
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
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

        <Box w={{ base: "100%", md: "25%" }} h="fit-content">
          <Box {...cardStyle} mb={4}>
            {/* for anoto like filtered page like need to to fecth coressponding diploma ng mga dean like
            COT diplomas -> dean ng COT */}
              {/* hinde pede tanggalen */}
            <Button 
            size="lg" w="full" p={5} colorScheme="red"
            // onClick={getDeanDepartment} fontWeight="bold"
            > Load Diplomas 
            </Button>
          </Box>
        </Box>
      <Flex p={6} h="calc(100vh - 140px)" direction={{ base: "column", md: "row" }} gap={6}>
        {/* Left Panel */}
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
             
                
             
              </Flex>
            </Flex>

        {/* Upper Pagination */}
        {/* {filteredStudents.length > 0 && (
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
            )} */}

               {/* Diploma Grid */}
          <Box width="100%" mt={6} pl={{ base: 0, md: "4" }}>
                {(() => {
                  const programsWithCounts = getProgramsWithCounts();
                  
                  return programsWithCounts.length > 0 ? (
                    <Grid
                      templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)"
                      }}
                      gap={6}
                      px={4}
                      marginLeft={{ md: "-8px" }} 
                    >
                      {programsWithCounts.map(({program, count}) => (
                        <Box 
                          key={program}
                          as="button"
                          w="100%"
                          h="140px"
                          bg="white"
                          borderRadius="15px"
                          boxShadow="0px 0px 20px #00000027"
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                          position="relative"
                          overflow="hidden"
                          transition="all 0.3s ease"
                          _hover={{
                            boxShadow: "0px 0px 15px #00000048",
                            "&::before": {
                              opacity: 1
                            },
                            "& > div": {
                              color: "white",
                              fontWeight: "bold"
                            }
                          }}
                          sx={{
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              inset: 0,
                              background: "linear-gradient(90deg, #4f6bdd 0%, #3a56b1 100%)",
                              opacity: 0,
                              transition: "opacity 0.3s ease-in-out",
                              borderRadius: "15px",
                              pointerEvents: "none"
                            }
                          }}
                          onClick={() => {
                            if (authUser?.role === "dean") {
                              navigate(`/dean/${encodeURIComponent(program)}`, {
                                state: { program }
                              });
                            } else {
                              navigate("/dean/login", { 
                                state: { from: `/dean/${encodeURIComponent(program)}` } 
                              });
                            }
                          }}
                        >
                          <Text    
                            position="relative"
                            zIndex={1}
                            fontSize="1.5rem"
                            color="#222222"
                            transition="all 0.3s ease-in-out"
                            textAlign="center"
                            px={4}
                          >
                            {program}
                          </Text>
                          <Text
                            position="relative"
                            zIndex={1}
                            fontSize="1rem"
                            color="#555555"
                            mt={2}
                          >
                            {count} {count === 1 ? 'student' : 'students'}
                          </Text>
                        </Box>
                      ))}
                    </Grid>
                  ) : (
                    <Box 
                      p={8} 
                      bg="white" 
                      borderRadius="md" 
                      boxShadow="sm" 
                      textAlign="center"
                      width="calc(100% - 32px)"
                      mx="auto"
                    >
                      <Text color="gray.500" fontSize="lg">
                        No programs found in student data.
                      </Text>
                    </Box>
                  );
                })()}
              </Box>

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