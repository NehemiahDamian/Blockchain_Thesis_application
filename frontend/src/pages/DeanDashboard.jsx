import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Text, Button, Flex, Menu, MenuButton, MenuList, MenuItem, Link,
  Container, useBreakpointValue, Modal, ModalOverlay, ModalContent, useDisclosure,
  ModalHeader, ModalBody, ModalFooter, Divider, VStack, HStack, Icon, useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaRegFileLines, FaFileContract } from 'react-icons/fa6';

function DeanDashboard() {
    const navigate = useNavigate();
    const isMobile = useBreakpointValue({ base: true, md: false });
    const iconSize = useBreakpointValue({ base: '0em', xl: '130px', lg: '100px', md: '0px', sm: '0px' });
    const iconFontSize = useBreakpointValue({ base: '30px', xl: '65px', lg: '55px', md: '45px' });

    // EULA states
    const {
        isOpen: isEulaModalOpen,
        onOpen: onEulaModalOpen,
        onClose: onEulaModalClose
      } = useDisclosure();
    const [eulaAccepted, setEulaAccepted] = useState(false);
    const toast = useToast();
    
    const iconContainerStyles = {
      position: { md: "absolute" },
      mt: { base: 4, md: 0 },
      width: iconSize,
      height: iconSize,
      bg: "#f8f8f8",
      borderRadius: "50%",
      alignItems: "center",
      justifyContent: "center",
      mr: { base: "0", md: "40px" },
      ml: { base: '0px', xl: '10px', lg: '0px', md: '0px' }
    };

  // EULA checking
  useEffect(() => {
    const eulaAcceptedStatus = localStorage.getItem('deanEulaAccepted');
    if (!eulaAcceptedStatus) {
      onEulaModalOpen();
    }
  }, [onEulaModalOpen]);

  // Handle EULA acceptance
  const handleEulaAccept = () => {
    setEulaAccepted(true);
    localStorage.setItem('deanEulaAccepted', 'true');
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

    const handleNavigateToDiplomas = () => {
        navigate('/dean/homepage');
      };

  return (
    <Box display="flex" flexDirection="column" gap="20px" p="20px" bg="#f7faff" minH="100vh" >
      {/* Welcome Banner */}
      <Box 
        bgGradient="linear(to-l, #be1010, #8C0001)" 
        color="white" 
        p="20px" 
        borderRadius="10px"
      >
        <Heading as="h1" fontSize="24px">Welcome, Dean!</Heading>
      </Box>

      {/* Card Container */}
      <Container 
        maxW="85%" 
        mx="auto"
        bg="white" 
        borderRadius="10px" 
        p={isMobile ? "20px" : "30px 70px"} 
        boxShadow="0 2px 10px rgba(0, 0, 0, 0.05)"
      >
        <Flex 
          direction={isMobile ? "column" : "row"} 
          justifyContent="space-between" 
          gap="20px"
          position="relative"
        >
          <Flex {...iconContainerStyles} display="flex">
            <Box as={FaRegFileLines} fontSize={iconFontSize} color="#d33139" />
          </Flex>
          <Box 
            display="flex" 
            flexDirection="column" 
            gap="15px"
            textAlign= "start"
            ml="auto" mr="auto"
          >
          <Heading as="h2" fontSize={isMobile ? "24px" : "45px"} color="#333">
              Process Incoming Diplomas
            </Heading>
            <Text fontSize="16px" color="#363636" mt="-3%">
            There are some diplomas that require your attention 
            </Text>
            <Button
              onClick={handleNavigateToDiplomas}
              maxW={isMobile ? "90%" : "50%"}
              fontWeight="bold"
              bg="white"
              color="#d33139"
              border="1px solid #d33139"
              borderRadius="5px"
              p="10px 20px"
              textDecoration="none"
              transition="all 0.3s ease"
              textAlign="center"
              _hover={{
                bg: "#d33139",
                color: "white"
              }}
            > 
            Process Diplomas
            </Button>
          </Box>


        </Flex>
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
export default DeanDashboard