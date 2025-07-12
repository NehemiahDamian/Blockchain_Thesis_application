/* eslint-disable no-unused-vars */
import { useState, useEffect  } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { 
  Box, 
  Input, 
  Select, 
  Button, 
  Heading, 
  Text, 
  Flex, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  Link,
  useDisclosure,
  FormControl,
  FormLabel,
  Container,
  VStack,
  useColorModeValue,
  HStack,
  Icon,
  useToast,
  CheckboxGroup, ModalFooter, Divider
} from "@chakra-ui/react";
// Using react-icons/fa instead of FontAwesome
import { FaSignOutAlt, FaCheckCircle, FaFileContract } from "react-icons/fa";
import {verifyDiploma} from '../utilss/contactServices';
import {useVerifierStore} from "../store/useVerifierStore.js"

function VerifierPage() {
  const [verifyToken, setVerifyToken] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  
  // State for form inputs
  const [formData, setFormData] = useState({
    alumniName: "",
    alumniCourse: "",
    dateOfBirth: "",
  });

  // Modal control
  const { isOpen, onOpen, onClose } = useDisclosure();

  //states for EULA
  const {
        isOpen: isEulaModalOpen,
        onOpen: onEulaModalOpen,
        onClose: onEulaModalClose
    } = useDisclosure();
  const [eulaAccepted, setEulaAccepted] = useState(false);
  const toast = useToast();
  
  // Mock user data from auth store (placeholder)
  // REPLACE: Replace with actual user data from your auth store
  const username = "Username"; 
  
  // Function to handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const{ getToken, tokens } = useVerifierStore()
  
  // eula modal opens
  useEffect(() => {
    onEulaModalOpen();
  }, [onEulaModalOpen]);

    // Handle EULA acceptance
    const handleEulaAccept = () => {
        setEulaAccepted(true);
        onEulaModalClose();
        toast({
            title: "Terms Accepted",
            description: "Thank you for accepting our End User License Agreement.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "bottom-left"
        });
    };

    const handleEulaDecline = () => {
        toast({
            title: "Terms Declined",
            description: "You must accept the EULA to use this service.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left"
        });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (!eulaAccepted) {
      toast({
        title: "Terms Not Accepted",
        description: "Please accept the EULA to proceed with verification.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
      onEulaModalOpen();
      return;
    }

    try {
      console.log("Started verification process");
      setIsVerifying(true);
      setVerificationResult(null); 
      
      useVerifierStore.setState({ tokens: "" });
  
      await getToken(formData.alumniName, formData.alumniCourse, formData.dateOfBirth);
      
      const { tokens } = useVerifierStore.getState();
      if (!tokens) throw new Error("No student found in the blockchain.");
      
      console.log("Calling verifyDiploma with token:", tokens);
      const result = await verifyDiploma(tokens);
      console.log("Verification result:", result);
      console.log(tokens);
      
      console.log("Verification result:", result);
      setVerificationResult(result);
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationResult({ isValid: false, error: error.message });
    } finally {
      setIsVerifying(false);
      onOpen();
    }
  };
  
  

  // Mock function for logout
  // const handleLogout = () => {
  //   console.log("Logging out...");
  //   // REPLACE: Implement actual logout functionality using your auth store
  // };

  // Colors
  const formBgColor = useColorModeValue("#ebeef2", "#2D3748");
  const primaryColor = "#8b0e0e";
  const primaryHoverColor = "#b71e1e";
  const textColor = "#430909";


  return (
    <Box
    backgroundImage={'url("../src/assets/bg5.png")'} 
    bgSize="cover"
      bgPosition="center"
      minH="100vh"
      overflow="hidden"
    >
      <Container maxW="container.xl" pt={8}>
        {/* Header with Welcome and Logout */}
        <Flex 
          justifyContent="space-between" 
          alignItems="center"
          color="white"
          mb={8}
          width="100%"
          fontSize="1.3rem"
        >
          <Text fontWeight="medium">
            Welcome <Text as="span" fontWeight="bold">{username}!</Text>
          </Text>
          {/* <Link 
            onClick={handleLogout}
            _hover={{ color: textColor, fontWeight: "semibold" }}
            display="flex"
            alignItems="center"
          >
            <FaSignOutAlt style={{ marginRight: "8px" }} />
            <Text>Logout</Text>
          </Link> */}
        </Flex>

        <Box
        bg="gray.100"
        p={6}
        borderRadius="xl"
        boxShadow="lg"
        maxW="650px"
        mx="auto"
        ml="-8%"
        mt= "11%"
        >
      <Box as="h2" fontSize="2xl" fontWeight="bold" color="maroon" mb={6}>
        Enter Alumni Details
      </Box>

      <form onSubmit={handleSubmit}>
        <VStack spacing={5}>
          <FormControl isRequired>
            <FormLabel>Alumni Name</FormLabel>
            <Input
              name="alumniName"
              value={formData.alumniName}
              onChange={handleChange}
              placeholder="Enter full name"
              border="2px solid"
              borderColor="maroon"
              borderRadius="md"
              height="48px"
              _focus={{
                borderColor: "maroon",
                boxShadow: "0 0 0 1px maroon",
              }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Alumni Course</FormLabel>
            <Input
              placeholder="Select Course"
              name="alumniCourse"
              value={formData.alumniCourse}
              onChange={handleChange}
              border="2px solid"
              borderColor="maroon"
              borderRadius="md"
              height="48px"
              _focus={{
                borderColor: "maroon",
                boxShadow: "0 0 0 1px maroon",
              }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Date of Birth</FormLabel>
            <Input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              border="2px solid"
              borderColor="maroon"
              borderRadius="md"
              height="48px"
              _focus={{
                borderColor: "maroon",
                boxShadow: "0 0 0 1px maroon",
              }}
            />
          </FormControl>

     <button type="submit">Submit</button>
        </VStack>
      </form>
    </Box>

        {/* Verification Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
          <ModalContent borderRadius="25px" maxW="600px">
            {/* Green Verification Header */}

            {tokens ?  <Flex
              bg="rgb(3, 119, 3)"
              borderTopRadius="20px"
              p={4}
              justifyContent="center"
              alignItems="center"
              flexDirection="row"
              gap="10px"
            >
              <FaCheckCircle 
                size={24}
                color="white"
              />

              <Heading color="white" size="lg">Verified</Heading>

            </Flex> :  <Flex
              bg="rgb(201, 7, 7)"
              borderTopRadius="20px"
              p={4}
              justifyContent="center"
              alignItems="center"
              flexDirection="row"
              gap="10px"
            >
              <FaCheckCircle 
                size={24}
                color="white"
              />

              <Heading color="white" size="lg">Not Verified</Heading>

            </Flex>
            
            }
       
            
            <ModalHeader 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              borderBottom="1px solid #ddd"
            >
              <Text color={primaryColor} fontSize="1.5rem" fontWeight="bold">
                Search results for: {formData.alumniName}
              </Text>
              <ModalCloseButton position="static" />
            </ModalHeader>
            
            <ModalBody p={6} fontSize="18px" color="#333">
              <Box px={6}>
                <Flex 
                  width="100%" 
                  justifyContent="space-between" 
                  mb={3}
                >
                          {verificationResult && (
              <div style={{ marginTop: "-20px" }}>
                <p>
                  <strong>Status:</strong>{" "}
                  {verificationResult.isValid ? "Valid" : "Invalid"}
                </p>
                {verificationResult.timestamp && (
                <div>
              <p>
                <strong>Issued on:</strong>{" "}
                {new Date(verificationResult.timestamp * 1000).toLocaleString()}
              </p>
              <p> <strong>Token:</strong> {tokens}</p>
            </div>


      )}
      {verificationResult.error && (
        <p style={{ color: "red" }}>Error: {verificationResult.error}</p>
      )}
    </div>
  )}
                </Flex>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
         {/* EULA MODAL */}
      <Modal 
         isOpen={isEulaModalOpen} 
         onClose={() => {}} 
         isCentered
         closeOnOverlayClick={false}
         closeOnEsc={false}
         size="lg"
       >
         <ModalOverlay />
         <ModalContent borderRadius="15px" mx={4}>
           <ModalHeader color="#8b0e0e" textAlign="center" pb={2}>
             <HStack justify="center" spacing={2}>
               <Icon as={FaFileContract} boxSize={6} />
               <Text fontSize="xl" fontWeight="bold">End User License Agreement</Text>
             </HStack>
           </ModalHeader>
           <Divider />
           <ModalBody py={4} maxH="400px" overflowY="auto">
             <VStack align="stretch" spacing={4}>
               <Text fontSize="sm" color="gray.600" fontWeight="medium">
                 Please read and accept the following terms to continue using the registrar diploma management system:
               </Text>
               
               <Box bg="gray.50" p={4} borderRadius="md" border="1px solid" borderColor="gray.200">
                 <VStack align="stretch" spacing={3} fontSize="sm">
                   <Text fontWeight="semibold" color="#8b0e0e">1. System Access Agreement</Text>
                   <Text>
                     By accessing this registrar system, you agree to handle all diploma-related processes with 
                     the utmost care and professionalism. You are responsible for maintaining the confidentiality 
                     and security of all student information.
                   </Text>
                   
                   <Text fontWeight="semibold" color="#8b0e0e">2. Diploma Processing Responsibilities</Text>
                   <Text>
                     You are authorized to sign and process diploma requests in accordance with institutional 
                     policies. All signatures must be legitimate and properly verified before approval.
                   </Text>
                   
                   <Text fontWeight="semibold" color="#8b0e0e">3. Data Security and Privacy</Text>
                   <Text>
                     All student data and diploma information accessed through this system is confidential. 
                     You must not share, distribute, or misuse any personal information obtained through 
                     this platform.
                   </Text>
                   
                   <Text fontWeight="semibold" color="#8b0e0e">4. Record Keeping</Text>
                   <Text>
                     All diploma processing actions are logged and tracked. You are responsible for maintaining 
                     accurate records and ensuring all processed requests are properly documented.
                   </Text>
                   
                   <Text fontWeight="semibold" color="#8b0e0e">5. System Integrity</Text>
                   <Text>
                     You agree not to attempt to circumvent system security measures or access unauthorized 
                     areas. Any suspicious activity will be reported to system administrators.
                   </Text>
                   
                   <Text fontWeight="semibold" color="#8b0e0e">6. Compliance with Policies</Text>
                   <Text>
                     You must comply with all institutional policies, procedures, and regulations regarding 
                     diploma processing and student record management.
                   </Text>
                 </VStack>
               </Box>
               
               <Text fontSize="xs" color="gray.500" textAlign="center" fontStyle="italic">
                 By clicking "I Accept", you acknowledge that you have read, understood, and agree to be bound by these terms.
               </Text>
             </VStack>
           </ModalBody>
           <ModalFooter pt={2}>
             <HStack spacing={3} w="full" justify="center">
               <Button
                 variant="outline"
                 colorScheme="red"
                 onClick={handleEulaDecline}
                 size="md"
                 px={6}
               >
                 Decline
               </Button>
               <Button
                 bg="#8b0e0e"
                 color="white"
                 _hover={{ bg: "#6f0b0b" }}
                 onClick={handleEulaAccept}
                 size="md"
                 px={8}
               >
                 I Accept
               </Button>
             </HStack>
           </ModalFooter>
         </ModalContent>
       </Modal>
    </Box>
  );
}

export default VerifierPage;