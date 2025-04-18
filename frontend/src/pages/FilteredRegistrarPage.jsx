import { useState } from "react";
import { useRegistrarStore } from "../store/useRegistrarStore";
import { 
  Box, Button, Text, Input, Select, Icon, Flex, Heading,
  Grid, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useDisclosure, HStack, useToast
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import DiplomaTemplate from "../components/DiplomaTemplate";

function ViewDiplomasPage() {
  // Button states
  const [signatureUploaded, setSignatureUploaded] = useState(false);
  const [showDigitalSignBtn, setShowDigitalSignBtn] = useState(false);

  // Signatures states
  const [esignatures, setEsignature] = useState(null);
  const {
    studentDetails,
    getEsignature,
    eSignature,
    digitalSignature
  } = useRegistrarStore();
  const [handleEsigbtn, setHandleEsigbtn] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesCount, setEntriesCount] = useState(10);
  
  // Modal
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const { isOpen: isCompletionOpen, onOpen: onCompletionOpen, onClose: onCompletionClose } = useDisclosure();
  const toast = useToast(); // For notifications

  const handleEsig = async () => {
    await getEsignature();
    const storedSignature = useRegistrarStore.getState().eSignature;
    if (storedSignature) {
      setEsignature(storedSignature);
      setSignatureUploaded(true); // para makita na may signature na
      setShowDigitalSignBtn(true); // para mapalitan yung text sa button
    }
    setHandleEsigbtn(true);
  };

  const handleDigitalSignature = async () => {
    if(esignatures === null) {
      alert("Please upload your eSignature first.");
      return;
    } 
    onConfirmOpen();
  };

  const confirmSign = async () => {
    onConfirmClose();
    
    // Nilipat ko lang dito yung original na code mo para gumana sa confirmation modal
    await digitalSignature(studentDetails, esignatures);
    
    onCompletionOpen();
  };

  // Filter students based on search
  const filteredStudents = studentDetails
  .filter(student => student.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  .slice(0, entriesCount);

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
          {/* Left Panel (Buttons) */}
          <Box w={{ base: "100%", md: "25%" }} h="fit-content">
            <Box {...cardStyle} mb={4}>
              {!handleEsigbtn ? (
              <Button 
              colorScheme="green"
              size="sm"
              w="full"
              p={5}
              fontWeight="bold"
              onClick={handleEsig}> {/*andito yung function*/}
                Upload E signature
              </Button>
              ) : (
              <Button 
              colorScheme="green"
              size="sm"
              w="full"
              p={5}
              fontWeight="bold"
              onClick={handleDigitalSignature}> {/*andito yung function*/}
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
          {/* Right Panel (Diplomas) */}
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
              <Heading size="md">Diplomas {new Date().getFullYear()}-{new Date().getFullYear() + 1}</Heading>
              
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
            {/* Diploma Grid */}
            <Grid templateColumns={{ base: "repeat(1, 1fr)" }} gap={6} p={6}>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <Box 
                    key={student._id}
                    border="2px"
                    borderColor="gray.200"
                    borderRadius="md"
                    overflow="hidden"
                    transition="transform 0.2s"
                    _hover={{ transform: "scale(1.02)" }}
                  >
                    <DiplomaTemplate 

                      studentName={student.fullName}
                      studentId={student.idNumber}
                      department={student.department}
                      deanSignature={student.deanESignature}
                      graduationYear={student.expectedYearToGraduate}
                      signature={signatureUploaded ? esignatures : null}
                      signerRole="registrar"
                    />
                  </Box>
                ))
              ) : (
                <Text p={4} color="gray.500">No diplomas found or no students match the search criteria.</Text>
              )}
            </Grid>
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
              Are you sure you want to sign all diplomas for {new Date().getFullYear()}-{new Date().getFullYear() + 1}?
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
                onClick={onConfirmClose}
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
              {filteredStudents.length} diplomas out of {studentDetails.length} diplomas have been signed successfully
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ViewDiplomasPage;
