/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { 
  Box, 
  Button,  
  Container, 
  Flex, 
  FormControl, 
  Heading, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  Link, 
  Modal, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalHeader, 
  ModalOverlay, 
  Text,
  useDisclosure 
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";

const StudentForgotPass = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // This would typically be an API call to request password reset
      console.log("Password reset requested for:", email);
      
      // Simulate API delay
      setTimeout(() => {
        onOpen();
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Password reset request failed:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Flex 
      minH="100vh" 
      w="full" 
      position="relative"
      backgroundImage={'url("../src/assets/bg2.png")'} 
      bgSize="cover"
      bgPosition="center"
      overflow="hidden"
    >
      {/* Background */}
      <Box 
        position="absolute"
        left="0" 
        h="100%" 
        w={{ base: "0", md: "25%" }}
        backgroundImage={'url("../src/assets/block.png")'} 
        bgSize="cover"
        boxShadow="2px 0px 10px rgba(0, 0, 0, 0.168)"
        display={{ base: "none", md: "block" }}
      />
      
      {/* Main content */}
      <Container 
        maxW="container.lg"
        pl={{ base: "4", md: "10" }}
        pr="4"
        py="8"
        ml={{ base: "0", md: "25%" }}
        position="relative"
        zIndex="1"
      >
        <Heading 
          as="h1" 
          color="white" 
          fontSize={{ base: "4xl", md: "5xl" }} 
          mb="4" 
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.3)"
        > 
          Forgot Password
        </Heading>
        
        <Link 
          as={RouterLink}
          to="/student/login" 
          color="white"
          display="flex"
          alignItems="center"
          width="fit-content"
          mb="6"
          _hover={{ 
            textDecoration: "none", 
            color: "#ff6b6b",
            transform: "translateX(-5px)" 
          }}
          transition="0.3s"
        >
          <Box as={FaArrowLeft} mr="2" /> Back to Login
        </Link>
        
        <Box 
          bg="whiteAlpha.700" 
          p={12} 
          borderRadius="xl" 
          boxShadow="lg"
          maxW="700px"
          ml="auto" mr="auto"
          mb={2}
        >
          <Text fontSize="lg" mb={6} color="#333">
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
          
          <form onSubmit={handleSubmit}>
            <FormControl isRequired mb={6}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Box as={FaEnvelope} color="#8b0e0e" />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="Enter your e-mail"
                  bg="white"
                  color="#202020"
                  size="lg"
                  borderRadius="xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  _hover={{ bg: "white" }}
                  _focus={{ 
                    boxShadow: "0px 0px 0px 3px rgba(139,14,14,0.3)",
                    transform: "translateY(-2px)"
                  }}
                  transition="all 0.3s ease"
                />
              </InputGroup>
            </FormControl>

            <Button 
              type="submit" 
              bg="#780c0c"
              color="white"
              size="lg"
              borderRadius="xl"
              w="100%"
              fontWeight="600"
              letterSpacing="1px"
              textTransform="uppercase"
              isLoading={isSubmitting}
              loadingText="Submitting"
              _hover={{
                bg: "#d43838",
                transform: "translateY(-3px)",
                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.25)"
              }}
              _active={{
                transform: "translateY(0)"
              }}
              transition="all 0.3s ease"
            >
              Reset Password
            </Button>
          </form>
        </Box>
        
        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent borderRadius="xl" mt="auto" mb="auto">
            <ModalHeader bg="#8b0e0e" color="white" borderTopRadius="xl" display="flex" alignItems="center">
              <Box as={FaEnvelope} mr="2" />
              Password Reset
            </ModalHeader>
            <ModalCloseButton color="white" _hover={{ color: "#ff6b6b" }} />
            <ModalBody py={6} textAlign="center"> 
              <Text fontSize="xl" mb={4}>
                <b>Password Reset Email Sent!</b>
              </Text>
              <Text>
                We've sent instructions to reset your password to your email address. 
                Please check your inbox and follow the instructions in the email.
              </Text>
              <Text mt={4} fontSize="sm" color="gray.600">
                If you don't receive an email within a few minutes, please check your spam folder.
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Flex>
  );
};

export default StudentForgotPass;