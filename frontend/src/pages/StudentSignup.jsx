/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Box, Button,  Container, Flex, FormControl, Heading, Input, InputGroup, InputLeftElement, InputRightElement, Link, 
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Text,useDisclosure } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaUser, FaUniversity, FaGraduationCap, FaUserCircle, FaLock, FaArrowLeft, FaEye,
  FaEyeSlash,FaCalendarAlt,FaEnvelope,FaIdCard,FaStar } from "react-icons/fa";
// import { useAuthStore } from "../store/useAuthStore";
// import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
// import { Link } from "react-router-dom";

// import AuthImagePattern from "../components/AuthImagePattern";
// import toast from "react-hot-toast";
import { useAdminStore } from "../store/useAdminStore.js";


const StudentSignup = () => {
  const {colleges, getAllColleges } = useAdminStore();

    useEffect(() => {
      getAllColleges();
    }, []);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    idNumber:"",
    department:"",
    program:"",
    expectedYearToGraduate: "",
    dateOfBirth:"",
    role: "student"
  });

  // Password state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {signup} = useAuthStore()

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData({
      ...formData,
      [name]: value, 
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      console.log("Form submitted with:", formData); 
      await signup(formData);
      onOpen();
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleModalClose = () => {
    onClose();
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
      <Container 
        maxW="container.lg"
        pl={{ base: "4", md: "10" }}
        pr="4"
        py="8"
        ml={{ base: "0", md: "25%" }}
        position="relative"
        zIndex="1"
      >
      <Heading as="h1" color="white" fontSize={{ base: "4xl", md: "5xl" }} mb="4" textShadow="2px 2px 4px rgba(0, 0, 0, 0.3)"
      > Sign-Up
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
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="4">
            {/* Full Name & Email Row*/}
          <Flex gap="4" direction={{ base: "column", md: "row" }}>
          <FormControl isRequired>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Box as={FaUser} color="#8b0e0e" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Enter your full name (First Name, Middle Initial, Last Name)"
                  bg="whiteAlpha.900"
                  color="#202020"
                  size="lg"
                  borderRadius="xl"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  _hover={{ bg: "white" }}
                  _focus={{ 
                    boxShadow: "0px 0px 0px 3px rgba(139,14,14,0.3)",
                    transform: "translateY(-2px)"
                  }}
                  transition="all 0.3s ease"
                />
              </InputGroup>
            </FormControl>

              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Box as={FaEnvelope} color="#8b0e0e" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="Enter your e-mail"
                    bg="whiteAlpha.900"
                    color="#202020"
                    size="lg"
                    borderRadius="xl"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    _hover={{ bg: "white" }}
                    _focus={{ 
                      boxShadow: "0px 0px 0px 3px rgba(139,14,14,0.3)",
                      transform: "translateY(-2px)"
                    }}
                    transition="all 0.3s ease"
                  />
                </InputGroup>
              </FormControl>
            </Flex>

            {/* ID number */}
            <FormControl isRequired>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Box as={FaIdCard} color="#8b0e0e" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Enter your Student ID number (Ex. 2021-0-0000)"
                  bg="whiteAlpha.900"
                  color="#202020"
                  size="lg"
                  borderRadius="xl"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  _hover={{ bg: "white" }}
                  _focus={{ 
                    boxShadow: "0px 0px 0px 3px rgba(139,14,14,0.3)",
                    transform: "translateY(-2px)"
                  }}
                  transition="all 0.3s ease"
                />
              </InputGroup>
            </FormControl>

                  <Flex gap="4" direction={{ base: "column", md: "row" }}>
                    <FormControl isRequired>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                      <Box as={FaUniversity} color="#8b0e0e" />
                      </InputLeftElement>
                      <Input
                      type="text"
                      placeholder="Enter your program/course"
                      bg="whiteAlpha.900"
                      color="#202020"
                      size="lg"
                      borderRadius="xl"
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      _hover={{ bg: "white" }}
                      _focus={{ 
                        boxShadow: "0px 0px 0px 3px rgba(139,14,14,0.3)",
                        transform: "translateY(-2px)"
                      }}
                      transition="all 0.3s ease"
                      />
                    </InputGroup>
                    </FormControl>
                    
                    <FormControl isRequired>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                      {/* <Box marginLeft={1} as={FaGraduationCap} color="#8b0e0e" /> */}
                      </InputLeftElement>
                      <Select 
                      placeholder=""
                      bg="whiteAlpha.900"
                      color="#202020"
                      size="lg"
                      borderRadius="xl"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      _hover={{ bg: "white" }}
                      _focus={{ 
                        boxShadow: "0px 0px 0px 3px rgba(139,14,14,0.3)",
                        transform: "translateY(-2px)"
                      }}
                      transition="all 0.3s ease"
                      >
                       <option value="" disabled hidden>Select your Department</option>
                        {colleges.map((college) => (
                        <option key={college._id} value={college.collegeName}>
                          {college.collegeName}
                        </option>
                        ))}
                      </Select>
                    </InputGroup>
                    </FormControl>
                  </Flex>

                  {/* Password row */}
            <Flex gap="4" direction={{ base: "column", md: "row" }}>
              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Box as={FaLock} color="#8b0e0e" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    bg="whiteAlpha.900"
                    color="#202020"
                    size="lg"
                    borderRadius="xl"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    _hover={{ bg: "white" }}
                    _focus={{ 
                      boxShadow: "0px 0px 0px 3px rgba(139,14,14,0.3)",
                      transform: "translateY(-2px)"
                    }}
                    transition="all 0.3s ease"
                  />
                  <InputRightElement>
                    <Button
                      h="1.75rem"
                      size="sm"
                      variant="ghost"
                      color="#8b0e0e"
                      _hover={{ color: "#ff6b6b" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Box as={FaEyeSlash} /> : <Box as={FaEye} />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
            </Flex>

            {/* Expected year to graduate */}
            <FormControl isRequired>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Box as={FaStar} color="#8b0e0e" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Expected Year to Graduate (2025)"
                  bg="whiteAlpha.900"
                  color="#202020"
                  size="lg"
                  borderRadius="xl"
                  value={formData.expectedYearToGraduate}
                  onChange={(e) => setFormData({ ...formData, expectedYearToGraduate: e.target.value })}
                  _hover={{ bg: "white" }}
                  _focus={{ 
                    boxShadow: "0px 0px 0px 3px rgba(139,14,14,0.3)",
                    transform: "translateY(-2px)"
                  }}
                  transition="all 0.3s ease"
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Box as={FaCalendarAlt} color="#8b0e0e" />
                </InputLeftElement>
                <Input
                  type="date"               // Type is "date" for calendar input
                  name="dateOfBirth"        // Matches the key in your formData state
                  value={formData.dateOfBirth} // Binds to state
                  onChange={handleChange}      // Updates state on change
                  bg="whiteAlpha.900"
                  color="#202020"
                  size="lg"
                  borderRadius="xl"
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
          w="40%"
          mt="4"
          maxW="container.md"
          mx="auto"
          fontWeight="600"
          letterSpacing="1px"
          textTransform="uppercase"
          isLoading={isSubmitting}
          loadingText="Signing Up"
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
            Sign Up
          </Button>
        </Flex>
      </form>
         {/* Success Modal */}
         <Modal isOpen={isOpen} onClose={onClose}  >
          <ModalOverlay />
          <ModalContent borderRadius="xl" mt="auto" mb="auto">
            <ModalHeader bg="#8b0e0e" color="white" borderTopRadius="xl" display="flex" alignItems="center">
              <Box as={FaUser} mr="2" />
              Sign-up Complete!
            </ModalHeader>
            <ModalCloseButton color="white" _hover={{ color: "#ff6b6b" }} />
            <ModalBody py={6} textAlign="center"> 
              <Text fontSize="xl">
                <b>Sign-Up Successfully!</b> <br />
                You can now sign in
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Flex>
  );

};
export default StudentSignup;