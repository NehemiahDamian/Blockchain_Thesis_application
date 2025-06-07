import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Button, Image, VStack, HStack, useDisclosure, 
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, 
    FormLabel, Input, Radio, RadioGroup, useToast, Icon, Grid, GridItem, Heading, Badge, Spinner, Checkbox,
    CheckboxGroup} from '@chakra-ui/react';
import { FaHome, FaCog, FaSignOutAlt, FaPlus, FaFileAlt, FaCloudUploadAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useAuthStore } from "../store/useAuthStore";
import { useStudentStore } from '../store/useStudenStore';

function StudentPage() {
    const { postStudentDetails, getMyRequest, studentRequest } = useStudentStore();
    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // File upload state
    const paymentFileRef = useRef(null);
    const affidavitFileRef = useRef(null);
    const [paymentFile, setPaymentFile] = useState(null);
    const [affidavitFile, setAffidavitFile] = useState(null);
    const [paymentFileName, setPaymentFileName] = useState('No file chosen');
    const [affidavitFileName, setAffidavitFileName] = useState('No file chosen');

    const [purpose, setPurpose] = useState('');
    const [otherPurpose, setOtherPurpose] = useState(false);
    const [otherPurposeText, setOtherPurposeText] = useState('');

    // Max requests modal
    const {
        isOpen: isMaxRequestsModalOpen,
        onOpen: onMaxRequestsModalOpen,
        onClose: onMaxRequestsModalClose
    } = useDisclosure();

    const handlePurposeChange = (value) => {
        setPurpose(value);
        setOtherPurpose(value === 'other');
    };

    useEffect(() => {
        if (authUser) {
            getMyRequest();
        }
    }, [authUser, getMyRequest]);

    const { 
        isOpen: isDetailsModalOpen, 
        onOpen: onDetailsModalOpen, 
        onClose: onDetailsModalClose 
      } = useDisclosure();
      const [selectedRequest, setSelectedRequest] = useState(null);

    // Validation of request 
    const checkMaxRequestsReached = () => {
        if (!studentRequest) return false;
        
        // Count total number of requests
        return studentRequest.length >= 2;
    };

    // Handle new req button
    const handleRequestButtonClick = () => {
        if (checkMaxRequestsReached()) {
            onMaxRequestsModalOpen();
        } else {
            onOpen();
        }
    };

    // Handle file selection
    const handleFileChange = async (e, setFile, setFileName) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setFileName(file.name);
            setFile(file);
        } else {
            setFileName('No file chosen');
            setFile(null);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsSubmitting(true);

            // Convert files to Base64
            const formData = new FormData();
            formData.append('reason', purpose === 'other' ? otherPurposeText : purpose);
            formData.append('paymentReceipt', paymentFile);
            formData.append('affidavitOfLoss', affidavitFile);
            

            await postStudentDetails(formData );
            await getMyRequest(); // Refresh the requests
            
            setIsSubmitting(false);
            onClose();
            toast({ 
                title: 'Request submitted!', 
                description: 'Your request is being processed and may take up to 7 working days. Please check your email regularly for updates.', 
                status: 'success', 
                duration: 8000, 
                isClosable: true, 
                position: 'bottom-center', 
                icon: <Icon as={FaCheckCircle} /> 
            });
            
            // Reset form
            setPurpose('');
            setOtherPurposeText('');
            setPaymentFile(null);
            setAffidavitFile(null);
            setPaymentFileName('No file chosen');
            setAffidavitFileName('No file chosen');
            
        } catch (error) {
            console.error('Submission error:', error);
            setIsSubmitting(false);
            toast({
                title: 'Error submitting request',
                description: error.message || 'Please try again',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
        }
    };

    const handleLogout = () => {
        let redirectPath = '/student/login';
        logout();
        toast({
            title: "Logged out successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        navigate(redirectPath);
    };

    return (
        <Box width="100%" height="100vh" overflow="hidden" display="flex"
            backgroundImage={'url("../src/assets/bg3.png")'} backgroundSize="cover" backgroundPosition="center"
        >
            {/* SIDEBAR */}
            <Box
                height="100vh"
                width={sidebarExpanded ? "175px" : "70px"}
                bg="white"
                padding="20px 0"
                boxShadow="inset -8px 4px 10px rgba(0, 0, 0, 0.16)"
                borderTopRightRadius="30px"
                borderBottomRightRadius="30px"
                position="fixed"
                transition="width 0.3s ease-in-out"
                onMouseEnter={() => setSidebarExpanded(true)}
                onMouseLeave={() => setSidebarExpanded(false)}
                zIndex="10"
            >
                <Flex align="center" justify="center" mb="70px">
                    <Image src="../src/assets/logo.png" mt="20px" width="45px" alt="Logo" />
                </Flex>

                <VStack spacing="50px">
                    <NavLink to="/student/homepage">
                        <VStack color="#2B2B2B" _hover={{ color: "#ad0d0d" }} transition="all 0.3s ease-in-out" borderRadius="10px" align="center">
                            <Icon as={FaHome} fontSize="1.5rem" mb="5px" />
                            <Text opacity={sidebarExpanded ? 1 : 0} fontSize="1rem" transition="opacity 0.3s ease-in-out">
                                HOME
                            </Text>
                        </VStack>
                    </NavLink>
                    <NavLink to="/student/settings">
                        <VStack color="#2B2B2B" _hover={{ color: "#ad0d0d" }} transition="all 0.3s ease-in-out" borderRadius="10px" align="center">
                            <Icon as={FaCog} fontSize="1.5rem" mb="5px" />
                            <Text opacity={sidebarExpanded ? 1 : 0} fontSize="1rem" transition="opacity 0.3s ease-in-out">
                                SETTINGS
                            </Text>
                        </VStack>
                    </NavLink>
                    <Box as="button" onClick={handleLogout} cursor="pointer">
                        <VStack color="#2B2B2B" _hover={{ color: "#ad0d0d" }} transition="all 0.3s ease-in-out" borderRadius="10px" align="center" mt="200px">
                            <Icon as={FaSignOutAlt} fontSize="1.5rem" mb="5px" />
                            <Text opacity={sidebarExpanded ? 1 : 0} fontSize="1rem" transition="opacity 0.3s ease-in-out">
                                LOGOUT
                            </Text>
                        </VStack>
                    </Box>
                </VStack>
            </Box>

            {/* MAIN CONTENT */}
            <Box
                width={{ base: "100%", md: `calc(100% - ${sidebarExpanded ? "175px" : "70px"})` }}
                marginLeft={{ base: "70px", md: sidebarExpanded ? "175px" : "70px" }}
                paddingTop="2%" color="white" paddingX="30px" transition="margin-left 0.3s ease-in-out, width 0.3s ease-in-out"
            >
                <Box>
                    <Text fontSize="1.2rem" fontWeight="100">
                        Welcome <Text as="span" fontWeight="bold">{authUser?.fullName}!</Text>
                    </Text>
                    <Text>{authUser?.idNumber}</Text>
                </Box>
                <Box mt="1.5%">
                    <Flex width="95%" alignItems="center" justifyContent="space-between">
                        <Heading as="h1" fontSize={{ base: "2rem", md: "4rem" }}>
                            Diploma Requests
                        </Heading>
                        <Button
                            width={{ base: "180px", md: "220px" }}
                            background="white"
                            boxShadow="0px 4px 5px rgba(0, 0, 0, 0.15)"
                            fontSize={{ base: "1rem", md: "1.2rem" }}
                            padding="25px 0"
                            borderRadius="17px"
                            color="#8b0e0e"
                            _hover={{
                                fontWeight: "600",
                                background: "#b71e1e",
                                color: "white",
                                border: "solid 1px rgba(255, 255, 255, 0.38)"
                            }}
                            transition="0.3s"
                            leftIcon={<FaPlus />}
                            onClick={handleRequestButtonClick}
                        >
                            Make a Request
                        </Button>
                    </Flex>

                    {/* REQUEST HISTORY SECTION */}
                    <Box mt="60px" bg="gray.100" borderRadius="20px" p={5}  backdropFilter="blur(10px)" boxShadow="0 8px 20px rgba(0, 0, 0, 0.17)" border="1px solid rgba(255, 255, 255, 0.48)">
                        <Heading color="#8b0e0e"size="lg" mb={5} textAlign="center"
                        _after={{content: '""',display: 'block',width: '80px',height: '3px',background: '#ad0d0d', marginTop: '10px',marginLeft: 'auto',marginRight: 'auto'
                              }}>My Request History</Heading>
                        
                        {studentRequest && studentRequest.length > 0 ? (
                            <VStack spacing={4}>
                                {studentRequest.map((request) => (
                                    <Box 
                                        key={request._id}
                                        width="100%"
                                        bg="white"
                                        p={{ base: 3, md: 4 }}
                                        borderRadius="lg"
                                        border="1px solid rgba(0, 0, 0, 0.1)"
                                        borderLeft="8px solid"
                                        boxShadow="0 5px 10px rgba(0, 0, 0, 0.06)"
                                        borderLeftColor={
                                          request.status === 'accepted' ? 'green.400' : 
                                          request.status === 'rejected' ? 'red.400' : 'yellow.400'
                                        }
                                    >
                                        <Flex justify="space-between" align="center" >
                                            <Box >
                                                <Text fontWeight="bold" color="gray.900">Purpose: {request.reason}</Text>
                                                <Text fontSize="sm" color="gray.900" opacity={0.8}>
                                                    Submitted: {new Date(request.createdAt).toLocaleDateString()}
                                                </Text>
                                            </Box>
                                            <Badge 
                                                colorScheme={
                                                    request.status === 'accepted' ? 'green' : 
                                                    request.status === 'rejected' ? 'red' : 'yellow'
                                                }
                                                px={3}
                                                py={1}
                                                borderRadius="full"
                                            >
                                                {request.status}
                                            </Badge>
                                                <Button
                                                    colorScheme="red"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        onDetailsModalOpen();
                                                    }}
                                                    >
                                                    View Details
                                            </Button>
                                        </Flex>
                                    </Box>
                                ))}
                            </VStack>
                        ) : (
                            <Text textAlign="center" py={10} color="red.900">
                                You have not submitted any requests yet.
                            </Text>
                        )}
                    </Box>
                </Box>
            </Box>

          {/* MAX REQUESTS REACHED MODAL */}
          <Modal isOpen={isMaxRequestsModalOpen} onClose={onMaxRequestsModalClose} isCentered>
                <ModalOverlay />
                <ModalContent borderRadius="15px">
                    <ModalHeader color="#8b0e0e" textAlign="center">
                        Maximum Requests Reached
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6} textAlign="center">
                        <Icon as={FaExclamationCircle} color="#8b0e0e" boxSize={12} mb={4} />
                        <Text fontSize="lg" fontWeight="medium" mb={3}>
                            You have reached the maximum of 2 requests.
                        </Text>
                        <Text color="gray.600" mb={5}>
                            Please contact the registrar's office if you need further assistance.
                        </Text>
                        <Button 
                            onClick={onMaxRequestsModalClose}
                            bg="#8b0e0e"
                            color="white"
                            _hover={{ bg: "#6f0b0b" }}
                            w="50%"
                        >
                            OK
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>         

            {/* Request Details Modal */}
        <Modal isOpen={isDetailsModalOpen} onClose={onDetailsModalClose}>
         <ModalOverlay />
            <ModalContent>
                <ModalHeader>Request Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                    {selectedRequest && (
                    <VStack align="stretch" spacing={4}>
                    <Box>
                        <Text fontWeight="bold">Purpose:</Text>
                        <Text>{selectedRequest.reasonforAction}</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold">Status:</Text>
                        <Badge 
                        colorScheme={
                            selectedRequest.status === 'approved' ? 'green' : 
                            selectedRequest.status === 'rejected' ? 'red' : 'yellow'
                        }
                        px={2}
                        py={1}
                        borderRadius="full"
                        >
                        {selectedRequest.status}
                        </Badge>
                    </Box>
                    <Box>
                        <Text fontWeight="bold">Submitted:</Text>
                        <Text>{new Date(selectedRequest.createdAt).toLocaleString()}</Text>
                    </Box>
                {selectedRequest.adminReason && (
                    <Box>
                    <Text fontWeight="bold">Admin Response:</Text>
                    <Text>{selectedRequest.adminReason}</Text>
                    </Box>
                )}
          
                <HStack mt={4}>
                    <Button 
                    as="a" 
                    href={selectedRequest.paymentReceipt} 
                    target="_blank" 
                    leftIcon={<FaFileAlt />}
                    >
                    View Payment Receipt
                    </Button>
                    <Button 
                    as="a" 
                    href={selectedRequest.affidavitOfLoss} 
                    target="_blank" 
                    leftIcon={<FaFileAlt />}
                    >
                    View Affidavit
                    </Button>
                </HStack>
                </VStack>
            )}
            </ModalBody>
        </ModalContent>
        </Modal>
        {/* REQUEST MODAL */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
                <ModalContent borderRadius="25px" maxW="900px">
                    <ModalHeader display="flex" justifyContent="space-between" alignItems="center" borderBottomWidth="1px">
                        <HStack>
                            <Icon as={FaFileAlt} />
                            <Text color="#8b0e0e">Make a Request</Text>
                        </HStack>
                        <ModalCloseButton position="static" />
                    </ModalHeader>
                    <ModalBody padding="20px">
                        <form onSubmit={handleSubmit}>
                            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5} mb={5}>
                                {/* Purpose Section */}
                                <GridItem>
                                    <FormControl isRequired>
                                        <FormLabel>Purpose for request</FormLabel>
                                        <RadioGroup onChange={handlePurposeChange} value={purpose}>
                                            <VStack align="flex-start" spacing={3}>
                                                <Radio value="for use abroad">For use abroad</Radio>
                                                <Radio value="for reference">For reference</Radio>
                                                <Radio value="for employment">For employment</Radio>
                                                <Radio value="other">Other (please specify)</Radio>
                                                
                                                {otherPurpose && (
                                                    <Input
                                                        ml={6}
                                                        placeholder="Please specify purpose"
                                                        size="md"
                                                        width="90%"
                                                        value={otherPurposeText}
                                                        onChange={(e) => setOtherPurposeText(e.target.value)}
                                                        isRequired
                                                    />
                                                )}
                                            </VStack>
                                        </RadioGroup>
                                    </FormControl>
                                </GridItem>

                                {/* Uploads Section */}
                                <GridItem>
                                    <VStack align="stretch" spacing={3}>
                                        <FormControl isRequired>
                                            <FormLabel>Upload Proof of Payment</FormLabel>
                                            <HStack>
                                                <input
                                                    type="file"
                                                    ref={paymentFileRef}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, setPaymentFile, setPaymentFileName)}
                                                    accept=".jpg,.jpeg,.png"
                                                    required
                                                />
                                                <Button
                                                    leftIcon={<FaCloudUploadAlt />}
                                                    onClick={() => paymentFileRef.current.click()}
                                                    background="#f5f5f5"
                                                    border="2px dashed #8b0e0e"
                                                    color="#8b0e0e"
                                                    _hover={{ bg: "#d9d9d9" }}
                                                >
                                                    Choose Files
                                                </Button>
                                                <Text color="#666" fontSize="sm" isTruncated maxWidth="200px">
                                                    {paymentFileName}
                                                </Text>
                                            </HStack>
                                            <Text fontSize="xs" color="#888" mt={1}>
                                                Accepted formats: JPG, JPEG, PNG (Max 5MB)
                                            </Text>
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormLabel>Upload Affidavit of Loss</FormLabel>
                                            <HStack>
                                                <input
                                                    type="file"
                                                    ref={affidavitFileRef}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, setAffidavitFile, setAffidavitFileName)}
                                                    accept=".jpg,.jpeg,.png"
                                                    required
                                                />
                                                <Button
                                                    leftIcon={<FaCloudUploadAlt />}
                                                    onClick={() => affidavitFileRef.current.click()}
                                                    background="#f5f5f5"
                                                    border="2px dashed #8b0e0e"
                                                    color="#8b0e0e"
                                                    _hover={{ bg: "#d9d9d9" }}
                                                >
                                                    Choose Files
                                                </Button>
                                                <Text color="#666" fontSize="sm" isTruncated maxWidth="200px">
                                                    {affidavitFileName}
                                                </Text>
                                            </HStack>
                                            <Text fontSize="xs" color="#888" mt={1}>
                                                Accepted formats: JPG, JPEG, PNG (Max 5MB)
                                            </Text>
                                        </FormControl>
                                    </VStack>
                                </GridItem>
                            </Grid>

                              {/* Agreement */}
                                <GridItem>
                                    <FormControl isRequired>
                                        <FormLabel>By clicking the "I Agree" button below, I hereby acknowledge and certify that I have understood that I can only REQUEST ONCE and will go to the LPU Registrar regarding any concerns about my request.</FormLabel>
                                        <CheckboxGroup>
                                            <VStack align="flex-start" spacing={1}>
                                                <Checkbox>I Agree</Checkbox>
                                            </VStack>
                                        </CheckboxGroup>
                                    </FormControl>
                                </GridItem>

                            <Flex justify="flex-end" gap={3} mt={5}>
                                <Button 
                                    onClick={onClose} 
                                    background="#eee" 
                                    color="#333"
                                    _hover={{ bg: "#ddd" }}
                                    isDisabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    background="#8b0e0e"
                                    color="white"
                                    _hover={{ bg: "#6f0b0b" }}
                                    isLoading={isSubmitting}
                                    loadingText="Submitting, Please Wait..."
                                    spinner={<Spinner color="white" size="sm" />}

                                >
                                    Submit Request
                                </Button>
                            </Flex>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default StudentPage;