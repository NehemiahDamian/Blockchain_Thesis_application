import { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Button, Image, VStack, HStack, useDisclosure, 
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, 
    FormLabel, Input, Radio, RadioGroup, useToast, Icon, Grid, GridItem, Heading } from '@chakra-ui/react';
import { FaHome, FaCog, FaSignOutAlt, FaPlus, FaFileAlt, FaCloudUploadAlt, FaCheckCircle } from 'react-icons/fa';
import { useAuthStore } from "../store/useAuthStore";
import { useStudentStore } from '../store/useStudenStore';

function StudentPage() {
    const { postStudentDetails } = useStudentStore();
    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // File upload state
    const paymentFileRef = useRef(null);
    const affidavitFileRef = useRef(null);
    const [paymentFile, setPaymentFile] = useState(null);
    const [affidavitFile, setAffidavitFile] = useState(null);
    const [paymentFileName, setPaymentFileName] = useState('No file chosen');
    const [affidavitFileName, setAffidavitFileName] = useState('No file chosen');

    // Form state
    const [purpose, setPurpose] = useState('');
    const [otherPurpose, setOtherPurpose] = useState(false);
    const [otherPurposeText, setOtherPurposeText] = useState('');

    const handlePurposeChange = (value) => {
        setPurpose(value);
        setOtherPurpose(value === 'other');
    };

    // Convert file to Base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
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
            // Convert files to Base64
            const paymentBase64 = paymentFile ? await fileToBase64(paymentFile) : null;
            const affidavitBase64 = affidavitFile ? await fileToBase64(affidavitFile) : null;

            const details = {
                reason: purpose === 'other' ? otherPurposeText : purpose,
                paymentReceiptBase64: paymentBase64,
                affidavitOfLossBase64: affidavitBase64
            };

            console.log('Submitting:', details);
            await postStudentDetails(details);
            
            onClose();
            toast({ 
                title: 'Request submitted!', 
                description: 'Please check your email regularly for updates.', 
                status: 'success', 
                duration: 5000, 
                isClosable: true, 
                position: 'top', 
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
                            onClick={onOpen}
                        >
                            Make a Request
                        </Button>
                    </Flex>
                </Box>
            </Box>

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
                                    <VStack align="stretch" spacing={5}>
                                        <FormControl isRequired>
                                            <FormLabel>Upload Proof of Payment</FormLabel>
                                            <HStack>
                                                <input
                                                    type="file"
                                                    ref={paymentFileRef}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange(e, setPaymentFile, setPaymentFileName)}
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
                                                Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
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
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
                                                Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                                            </Text>
                                        </FormControl>
                                    </VStack>
                                </GridItem>
                            </Grid>

                            <Flex justify="flex-end" gap={3} mt={5}>
                                <Button 
                                    onClick={onClose} 
                                    background="#eee" 
                                    color="#333"
                                    _hover={{ bg: "#ddd" }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    background="#8b0e0e"
                                    color="white"
                                    _hover={{ bg: "#6f0b0b" }}
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