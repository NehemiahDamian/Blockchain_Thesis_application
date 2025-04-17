import { useState } from "react";
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
  useColorModeValue
} from "@chakra-ui/react";
// Using react-icons/fa instead of FontAwesome
import { FaSignOutAlt, FaCheckCircle } from "react-icons/fa";

function VerifierPage() {
  // State for form inputs
  const [formData, setFormData] = useState({
    alumniName: "",
    alumniCourse: "",
    dateOfBirth: "",
    dateOfGraduation: ""
  });

  // Modal control
  const { isOpen, onOpen, onClose } = useDisclosure();
  
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

  // Placeholder function for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    // REPLACE: Add your API call here to verify the alumni
    // For now, we'll just open the modal with mock data
    onOpen();
  };

  // Mock function for logout
  const handleLogout = () => {
    console.log("Logging out...");
    // REPLACE: Implement actual logout functionality using your auth store
  };

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
          <Link 
            onClick={handleLogout}
            _hover={{ color: textColor, fontWeight: "semibold" }}
            display="flex"
            alignItems="center"
          >
            <FaSignOutAlt style={{ marginRight: "8px" }} />
            <Text>Logout</Text>
          </Link>
        </Flex>

        <Box
        bg="gray.100"
        p={6}
        borderRadius="xl"
        boxShadow="lg"
        maxW="650px"
        mx="auto"
        ml="-8%"
        mt= "4%"
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
            <Select
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
            >
              <option value="BS Information Technology">
                BS Information Technology
              </option>
              <option value="BS Computer Science">BS Computer Science</option>
              <option value="AB Multimedia Arts">AB Multimedia Arts</option>
              <option value="BS Accountancy">BS Accountancy</option>
              <option value="BS International Hospitality Management">
                BS International Hospitality Management
              </option>
              <option value="AB Foreign Service">AB Foreign Service</option>
            </Select>
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

          <FormControl isRequired>
            <FormLabel>Date of Graduation</FormLabel>
            <Input
              type="date"
              name="dateOfGraduation"
              value={formData.dateOfGraduation}
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

          <Button
            type="submit"
            colorScheme="red"
            bg="maroon"
            color="white"
            leftIcon={<FaCheckCircle />}
            width="100%"
            height="48px"
            borderRadius="md"
            _hover={{ bg: "#7b001c" }}
          >
            Verify
          </Button>
        </VStack>
      </form>
    </Box>

        {/* Verification Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
          <ModalContent borderRadius="25px" maxW="600px">
            {/* Green Verification Header */}
            <Flex
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
            </Flex>
            
            <ModalHeader 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              borderBottom="1px solid #ddd"
            >
              <Text color={primaryColor} fontSize="1.5rem" fontWeight="bold">
                Search results for: Juan Dela Cruz
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
                  <Text><strong>Name</strong>: Juan Dela Cruz</Text>
                  <Text><strong>Course</strong>: BS Accountancy</Text>
                </Flex>
                <Text><strong>Token</strong>: ______________</Text>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}

export default VerifierPage;