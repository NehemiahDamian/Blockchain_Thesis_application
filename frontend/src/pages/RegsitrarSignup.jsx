import { useState } from "react";
import { Input, Button, VStack, Box, Heading, Flex, Select, InputGroup, InputRightElement,
  Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalFooter,Text,useDisclosure,IconButton } from "@chakra-ui/react";
import AdminNavbar from "../components/AdminNavbar";
import Header from "../components/Header";
import { FaEye, FaEyeSlash,} from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore.js";

const AdminSignUpRegistrar = () => {
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
    role:"registrar",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { signup } = useAuthStore();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dean Data:", data);
    // Add your submit logic here
    signup(data);

    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    setData({
      fullName: "",
      email: "",
      password: "",
      department: "",
      role: "dean",
    });
  };

  return (
    <Box display="flex" flexDirection="column" gap="20px" p="20px" h="100vh" overflow="hidden">
      {/* Header */}
      <Box 
        bgGradient="linear(to-l, #be1010, #8C0001)" 
        color="white" 
        p="20px" 
        borderRadius="10px"
      >
        <Heading as="h1" fontSize="24px">Register a Dean</Heading>
      </Box>
      <Flex minH="calc(100vh - 100px)" align="center" justify="center" p={4}>
        <Box
        mb={"auto"} ml={"auto"} mr={"auto"}
          bg="gray.50"
          p={8}
          rounded="xl"
          shadow="lg"
          w="full"
          maxW="xl"
          
        >
          <Heading  size="md" mb={6} textAlign="center">
            Registrar Sign-Up
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
              <Input
                type="text"
                value={data.fullName}
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
                placeholder="Full Name"
                size="lg"
                focusBorderColor="red.500"
              />
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="Email address"
                size="lg"
                focusBorderColor="red.500"
              />
              <InputGroup size="lg">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  placeholder="Password"
                  size="lg"
                  focusBorderColor="red.500"
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    onClick={handleTogglePassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    variant="ghost"
                  />
                </InputRightElement>
              </InputGroup>
      
              <Button bg="red.600" color="white" type="submit" colorScheme="teal" size="lg" width="full">
                Register
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="lg" maxW="500px">
          <ModalHeader bg="green.500" color="white" borderTopRadius="lg">Registration Successful</ModalHeader>
          <ModalBody py={4}>
            <Text>You have successfully registered a new Registrar account.</Text>
            <Text mt={2}>
              Full Name: <strong>{data.fullName}</strong>
            </Text>
            <Text>
              Email: <strong>{data.email}</strong>
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminSignUpRegistrar;
