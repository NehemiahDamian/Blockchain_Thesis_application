import { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Container,
  useToast,
  VStack
} from "@chakra-ui/react";
import { useAuthStore } from "../store/useAuthStore.js";

const AdminSignUpDean = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { signup } = useAuthStore();
  
  // Changed to match your data structure while preserving field names
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    role: "dean",
  });

  // College options - using your original options but with department field name
  const collegeOptions = [
    { value: 'COT', label: 'COT - College of Technology' },
    { value: 'CAS', label: 'CAS - College of Arts and Sciences' },
    { value: 'CIR', label: 'CIR - College of International Relations' },
    { value: 'CITHM', label: 'CITHM - College of International Tourism and Hospitality Management' },
    { value: 'CBA', label: 'CBA - College of Business Administration' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Use your existing signup function
    signup(data)
      .then(() => {
        // Show success message
        toast({
          title: 'Dean registered successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        
        // Reset form
        setData({
          fullName: "",
          email: "",
          password: "",
          department: "",
          role: "dean",
        });
      })
      .catch(error => {
        // Show error message
        toast({
          title: 'Registration failed',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      gap="20px" 
      p={{ base: "10px", md: "20px" }} 
      bg="#f7faff" 
      minH="100vh"
    >
      
      {/* Header */}
      <Box 
        bgGradient="linear(to-l, #be1010, #8C0001)" 
        color="white" 
        p={{ base: "15px", md: "20px" }} 
        borderRadius="10px"
        boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
        mt={2}
      >
        <Heading as="h1" fontSize={{ base: "20px", md: "24px" }}>Register a Dean</Heading>
      </Box>
      
      {/* Form Container */}
      <Container 
        maxW="800px" 
        bg="white" 
        borderRadius="10px" 
        p={{ base: "20px", md: "30px 30px" }} 
        boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
        border="1px solid #e0e0e0"
      >
        <VStack spacing={5} align="stretch">
          <Heading as="h3" size="md" color="#333" mb={{ base: 2, md: 5 }}>
            Fill Up Details
          </Heading>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel htmlFor="fullName" color="#555" fontSize="16px">Dean's Full Name</FormLabel>
                <Input
                  id="fullName" 
                  name="fullName" 
                  placeholder="Enter full name"
                  value={data.fullName}
                  onChange={handleChange}
                  size="md"
                  borderColor="#ddd"
                  borderRadius="5px"
                  _focus={{ borderColor: "#E43C3F", boxShadow: "0 0 0 1px #E43C3F" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel htmlFor="email" color="#555" fontSize="16px">Email Address</FormLabel>
                <Input
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="Enter email address"
                  value={data.email}
                  onChange={handleChange}
                  size="md"
                  borderColor="#ddd"
                  borderRadius="5px"
                  _focus={{ borderColor: "#E43C3F", boxShadow: "0 0 0 1px #E43C3F" }}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel htmlFor="password" color="#555" fontSize="16px">Password</FormLabel>
                <Input
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="Enter password"
                  value={data.password}
                  onChange={handleChange}
                  size="md"
                  borderColor="#ddd"
                  borderRadius="5px"
                  _focus={{ borderColor: "#E43C3F", boxShadow: "0 0 0 1px #E43C3F" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel htmlFor="department" color="#555" fontSize="16px">College</FormLabel>
                <Select
                  id="department" 
                  name="department" 
                  placeholder="Select College"
                  value={data.department}
                  onChange={handleChange}
                  size="md"
                  borderColor="#ddd"
                  borderRadius="5px"
                  _focus={{ borderColor: "#E43C3F", boxShadow: "0 0 0 1px #E43C3F" }}
                >
                  {collegeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <Box display="flex" justifyContent="center" mt={6}>
                <Button
                  type="submit"
                  bg="#fdfcfc"
                  color="#E43C3F"
                  border="2px solid #E43C3F"
                  borderRadius="5px"
                  fontWeight="bold"
                  px={{ base: "100px", md: "150px" }}
                  py="15px"
                  _hover={{
                    bg: "#E43C3F",
                    color: "white",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
                  }}
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                >
                  Register
                </Button>
              </Box>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminSignUpDean;