import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Box,
  Flex,
  Input,
  Button,
  Heading,
  Text,
  InputGroup,
  InputLeftElement,
  FormControl,
  Link,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  IconButton,
  ModalCloseButton,
  Divider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaUser, FaEnvelope, FaCalendar, FaIdCard, FaUniversity, FaGraduationCap, FaUserCircle, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaUserPlus } from "react-icons/fa";

const StudentSignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    idNumber: "",
    program: "",
    major: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { signup } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with:", formData);
    signup(formData);
    onOpen();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Box
      as="section"
      backgroundImage="url(/src/assets/bg2.png)"
      backgroundSize="cover"
      backgroundPosition="center"
      position="absolute"
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
    >
      <Box
        className="sign-up"
        position="relative"
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          className="content"
          marginLeft={{base: 0, md: "7%"}}
          paddingTop="2%"
          color="#EDEDED"
          position="relative"
          textAlign="left"
          zIndex={1}
          maxWidth="900px"
          width={{base: "90%", md: "100%"}}
          px={{base: "20px", md: 0}}
        >
          <Heading
            as="h1"
            fontSize={{base: "2.5rem", md: "3.5rem"}} 
            fontWeight="700"
            textShadow="2px 2px 4px rgba(0, 0, 0, 0.3)"
          >
            Sign-Up
          </Heading>

          <Flex
            className="header-row"
            alignItems="center"
            justifyContent="flex-start"
            gap="20px"
            width="100%"
            mb = "1.5%"
          >
            <Box className="back-button" >
              <Link 
                as={RouterLink} 
                to="/student/login"
                color="#EDEDED"
                textDecoration="none"
                display="flex"
                alignItems="center"
                gap="8px"
                transition="0.3s"
                _hover={{
                  color: "#ff6b6b",
                  transform: "translateX(-5px)"
                }}
              >
                <FaArrowLeft /> Back to Login
              </Link>
            </Box>
          </Flex>

          <Box 
            as="form" 
            onSubmit={handleSubmit}
            className="forms" 
            display="flex"
            flexDirection="column"
            gap="16px"
          >
            <FormControl position="relative" marginBottom="1px" width="105%">
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  height="60px"
                  children={<FaUser color="#8b0e0e" />}
                  paddingLeft="20px"
                />
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name (First Name, Middle Initial, Last Name)"
                  value={formData.fullName}
                  onChange={handleChange}
                  height="60px"
                  padding="20px 20px 20px 50px"
                  backgroundColor="rgba(255, 255, 255, 0.9)"
                  boxSizing="border-box"
                  border="none"
                  borderRadius="15px"
                  color="#202020"
                  fontSize="17px"
                  outline="none"
                  boxShadow="0px 4px 15px rgba(0, 0, 0, 0.1)"
                  transition="all 0.3s ease"
                  _placeholder={{ color: "#000000" }}
                  _focus={{
                    boxShadow: "0px 0px 0px 3px rgba(139, 14, 14, 0.3)",
                    transform: "translateY(-2px)"
                  }}
                  _hover={{
                    backgroundColor: "#fff"
                  }}
                />
              </InputGroup>
            </FormControl>

            <Flex 
              className="user-req" 
              width="105%" 
              gap="20px"
              flexDirection={{base: "column", md: "row"}}
            >
              <FormControl position="relative" marginBottom="1px" width="100%">
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    height="60px"
                    children={<FaEnvelope color="#8b0e0e" />}
                    paddingLeft="20px"
                  />
                  <Input
                    type="text"
                    name="email"
                    placeholder="Enter your e-mail"
                    value={formData.email}
                    onChange={handleChange}
                    height="60px"
                    padding="20px 20px 20px 50px"
                    backgroundColor="rgba(255, 255, 255, 0.9)"
                    boxSizing="border-box"
                    border="none"
                    borderRadius="15px"
                    color="#202020"
                    fontSize="17px"
                    outline="none"
                    boxShadow="0px 4px 15px rgba(0, 0, 0, 0.1)"
                    transition="all 0.3s ease"
                    _placeholder={{ color: "#000000" }}
                    _focus={{
                      boxShadow: "0px 0px 0px 3px rgba(139, 14, 14, 0.3)",
                      transform: "translateY(-2px)"
                    }}
                    _hover={{
                      backgroundColor: "#fff"
                    }}
                  />
                </InputGroup>
              </FormControl>

              <FormControl position="relative" marginBottom="1px" width="100%">
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    height="60px"
                    children={<FaCalendar color="#8b0e0e" />}
                    paddingLeft="20px"
                  />
                  <Input
                    type="date"
                    name="dateOfBirth"
                    placeholder="Enter date of birth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    height="60px"
                    padding="20px 20px 20px 50px"
                    backgroundColor="rgba(255, 255, 255, 0.9)"
                    boxSizing="border-box"
                    border="none"
                    borderRadius="15px"
                    color="#202020"
                    fontSize="17px"
                    outline="none"
                    boxShadow="0px 4px 15px rgba(0, 0, 0, 0.1)"
                    transition="all 0.3s ease"
                    _placeholder={{ color: "#000000" }}
                    _focus={{
                      boxShadow: "0px 0px 0px 3px rgba(139, 14, 14, 0.3)",
                      transform: "translateY(-2px)"
                    }}
                    _hover={{
                      backgroundColor: "#fff"
                    }}
                  />
                </InputGroup>
              </FormControl>
            </Flex>

            <FormControl position="relative" marginBottom="1px" width="105%">
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  height="60px"
                  children={<FaIdCard color="#8b0e0e" />}
                  paddingLeft="20px"
                />
                <Input
                  type="text"
                  name="idNumber"
                  placeholder="Enter your Student ID number (Ex. 2021-0-0000)"
                  value={formData.idNumber}
                  onChange={handleChange}
                  height="60px"
                  padding="20px 20px 20px 50px"
                  backgroundColor="rgba(255, 255, 255, 0.9)"
                  boxSizing="border-box"
                  border="none"
                  borderRadius="15px"
                  color="#202020"
                  fontSize="17px"
                  outline="none"
                  boxShadow="0px 4px 15px rgba(0, 0, 0, 0.1)"
                  transition="all 0.3s ease"
                  _placeholder={{ color: "#000000" }}
                  _focus={{
                    boxShadow: "0px 0px 0px 3px rgba(139, 14, 14, 0.3)",
                    transform: "translateY(-2px)"
                  }}
                  _hover={{
                    backgroundColor: "#fff"
                  }}
                />
              </InputGroup>
            </FormControl>

            <Flex 
              className="user-req" 
              width="105%" 
              gap="20px"
              flexDirection={{base: "column", md: "row"}}
            >
              <FormControl position="relative" marginBottom="1px" width="100%">
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    height="60px"
                    children={<FaUniversity color="#8b0e0e" />}
                    paddingLeft="20px"
                  />
                  <Input
                    type="text"
                    name="program"
                    placeholder="Enter your program/course"
                    value={formData.program}
                    onChange={handleChange}
                    height="60px"
                    padding="20px 20px 20px 50px"
                    backgroundColor="rgba(255, 255, 255, 0.9)"
                    boxSizing="border-box"
                    border="none"
                    borderRadius="15px"
                    color="#202020"
                    fontSize="17px"
                    outline="none"
                    boxShadow="0px 4px 15px rgba(0, 0, 0, 0.1)"
                    transition="all 0.3s ease"
                    _placeholder={{ color: "#000000" }}
                    _focus={{
                      boxShadow: "0px 0px 0px 3px rgba(139, 14, 14, 0.3)",
                      transform: "translateY(-2px)"
                    }}
                    _hover={{
                      backgroundColor: "#fff"
                    }}
                  />
                </InputGroup>
              </FormControl>

              <FormControl position="relative" marginBottom="1px" width="100%">
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    height="60px"
                    children={<FaGraduationCap color="#8b0e0e" />}
                    paddingLeft="20px"
                  />
                  <Input
                    type="text"
                    name="major"
                    placeholder="Enter your major"
                    value={formData.major}
                    onChange={handleChange}
                    height="60px"
                    padding="20px 20px 20px 50px"
                    backgroundColor="rgba(255, 255, 255, 0.9)"
                    boxSizing="border-box"
                    border="none"
                    borderRadius="15px"
                    color="#202020"
                    fontSize="17px"
                    outline="none"
                    boxShadow="0px 4px 15px rgba(0, 0, 0, 0.1)"
                    transition="all 0.3s ease"
                    _placeholder={{ color: "#000000" }}
                    _focus={{
                      boxShadow: "0px 0px 0px 3px rgba(139, 14, 14, 0.3)",
                      transform: "translateY(-2px)"
                    }}
                    _hover={{
                      backgroundColor: "#fff"
                    }}
                  />
                </InputGroup>
              </FormControl>
            </Flex>

            <FormControl position="relative" marginBottom="1px" width="105%">
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  height="60px"
                  children={<FaUserCircle color="#8b0e0e" />}
                  paddingLeft="20px"
                />
                <Input
                  type="text"
                  name="username"
                  placeholder="Create your username"
                  value={formData.username}
                  onChange={handleChange}
                  height="60px"
                  padding="20px 20px 20px 50px"
                  backgroundColor="rgba(255, 255, 255, 0.9)"
                  boxSizing="border-box"
                  border="none"
                  borderRadius="15px"
                  color="#202020"
                  fontSize="17px"
                  outline="none"
                  boxShadow="0px 4px 15px rgba(0, 0, 0, 0.1)"
                  transition="all 0.3s ease"
                  _placeholder={{ color: "#000000" }}
                  _focus={{
                    boxShadow: "0px 0px 0px 3px rgba(139, 14, 14, 0.3)",
                    transform: "translateY(-2px)"
                  }}
                  _hover={{
                    backgroundColor: "#fff"
                  }}
                />
              </InputGroup>
            </FormControl>

            <Flex 
              className="user-req" 
              width="105%" 
              gap="20px"
              flexDirection={{base: "column", md: "row"}}
            >
              <FormControl position="relative" marginBottom="1px" width="100%">
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    height="60px"
                    children={<FaLock color="#8b0e0e" />}
                    paddingLeft="20px"
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    height="60px"
                    padding="20px 20px 20px 50px"
                    backgroundColor="rgba(255, 255, 255, 0.9)"
                    boxSizing="border-box"
                    border="none"
                    borderRadius="15px"
                    color="#202020"
                    fontSize="17px"
                    outline="none"
                    boxShadow="0px 4px 15px rgba(0, 0, 0, 0.1)"
                    transition="all 0.3s ease"
                    _placeholder={{ color: "#000000" }}
                    _focus={{
                      boxShadow: "0px 0px 0px 3px rgba(139, 14, 14, 0.3)",
                      transform: "translateY(-2px)"
                    }}
                    _hover={{
                      backgroundColor: "#fff"
                    }}
                  />
                  <Box 
                    position="absolute" 
                    right="15px"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    zIndex={2}
                  >
                    <IconButton
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="unstyled"
                      color="#8b0e0e"
                      cursor="pointer"
                      fontSize="18px"
                      _hover={{ color: "#ff6b6b" }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    />
                  </Box>
                </InputGroup>
              </FormControl>

              <FormControl position="relative" marginBottom="1px" width="100%">
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    height="60px"
                    children={<FaLock color="#8b0e0e" />}
                    paddingLeft="20px"
                  />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    height="60px"
                    padding="20px 20px 20px 50px"
                    backgroundColor="rgba(255, 255, 255, 0.9)"
                    boxSizing="border-box"
                    border="none"
                    borderRadius="15px"
                    color="#202020"
                    fontSize="17px"
                    outline="none"
                    boxShadow="0px 4px 15px rgba(0, 0, 0, 0.1)"
                    transition="all 0.3s ease"
                    _placeholder={{ color: "#000000" }}
                    _focus={{
                      boxShadow: "0px 0px 0px 3px rgba(139, 14, 14, 0.3)",
                      transform: "translateY(-2px)"
                    }}
                    _hover={{
                      backgroundColor: "#fff"
                    }}
                  />
                  <Box 
                    position="absolute" 
                    right="15px"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    zIndex={2}
                  >
                    <IconButton
                      icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      variant="unstyled"
                      color="#8b0e0e"
                      cursor="pointer"
                      fontSize="18px"
                      _hover={{ color: "#ff6b6b" }}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    />
                  </Box>
                </InputGroup>
              </FormControl>
            </Flex>

            <Box 
              className="submitBox"
              display="flex"
              justifyContent="center"
              maxWidth="700px"
              width="100%"
              ml="auto" mr="auto"
            >
              <Button
                type="submit"
                width="60%"
                height="60px" 
                backgroundColor="#8b0e0e"
                boxShadow="0px 4px 15px rgba(0, 0, 0, 0.2)"
                border="none"
                fontSize="1.2rem"
                outline="none"
                borderRadius="15px"
                color="#fff"
                fontWeight="600"
                cursor="pointer"
                transition="all 0.3s ease"
                letterSpacing="1px"
                _hover={{
                  backgroundColor: "#d43838",
                  transform: "translateY(-3px)",
                  boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.25)"
                }}
                _active={{
                  transform: "translateY(0)"
                }}
              >
                SUBMIT
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay backgroundColor="rgba(0, 0, 0, 0.7)" />
          <ModalContent 
            borderRadius="15px" 
            width="90%" 
            maxWidth="400px"
            boxShadow="0 10px 25px rgba(0, 0, 0, 0.5)"
            overflow="hidden"
          >
            <ModalHeader 
              backgroundColor="#8b0e0e"
              color="#fff"
              padding="15px 20px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Flex alignItems="center" gap="10px">
                <FaUserPlus fontSize="1.5rem" />
                <Text fontSize="1.5rem" fontWeight="bold" margin="0">Sign-up Complete!</Text>
              </Flex>
              <ModalCloseButton color="#fff" fontSize="1.8rem" position="static" />
            </ModalHeader>
            <ModalBody padding="20px">
              <Box textAlign="center" color="#202020">
                <Text fontSize="1.2rem" lineHeight="1.5">
                  <b>Sign-Up Successfully!</b> <br />You can now sign in
                </Text>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default StudentSignup;