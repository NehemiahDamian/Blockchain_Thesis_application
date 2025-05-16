import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from "../store/useAuthStore";
import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  VStack,
  useToast,
  Icon,
  Heading,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  FormHelperText,
  useColorModeValue,
  useColorMode
} from '@chakra-ui/react';
import { 
  FaHome, 
  FaCog, 
  FaSignOutAlt
} from 'react-icons/fa';

function StudentSettings() {
  const { authUser, logout, resetPasswordatLoggedIn } = useAuthStore();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  
  // Color mode values
  const headingColor = useColorModeValue('#640e0e', '#f7d0d0');
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const formLabelColor = useColorModeValue('gray.700', 'white');
  const inputColor = useColorModeValue('black', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  
  // Form state
  const [formData, setFormData] = useState({
    fullname: authUser?.fullName || '',
    studentId: authUser?.idNumber || '',
    username: '',
    dob: '',
    college: '',
    email: authUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSignatureChange = (e) => {
    if (e.target.files[0]) {
      setSignature(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Form validation logic
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await resetPasswordatLoggedIn(formData.currentPassword, formData.newPassword);
    
    // Submit form data
    toast({
      title: "Changes saved",
      description: "Your profile has been updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    console.log("Form submitted:", formData, signature);
  };
  
  const handleCancel = () => {
    // Reset form
    setFormData({
      fullname: '',
      studentId: '',
      username: '',
      dob: '',
      college: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setSignature(null);
  };

  const handleLogout = () => {
    let redirectPath = '/dean/login'; 
    
    if (authUser) {
      if (authUser.role === 'registrar') {
        redirectPath = '/registrar/login';
      } else if (authUser.role === 'student') {
        redirectPath = '/student/login';
      } else if (authUser.role === 'dean') {
        redirectPath = '/dean/login';
      }
    }
    logout();
    
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate(redirectPath);
  };

  // Reusable styles
  const formControlProps = {
    mb: 4
  };
  
  const formLabelProps = {
    fontWeight: "semibold",
    color: formLabelColor,
    mb: 1
  };
  
  const inputProps = {
    color: inputColor,
    borderColor: borderColor,
    _placeholder: { color: subTextColor }
  };
  
  const navLinkStyles = {
    color: "#2B2B2B",
    _hover: { color: "#ad0d0d" },
    transition: "all 0.3s ease-in-out",
    borderRadius: "10px",
    align: "center"
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
            {/* HOME */}
            <VStack color="#2B2B2B" _hover={{ color: "#ad0d0d" }} transition="all 0.3s ease-in-out" borderRadius="10px" align="center">
              <Icon as={FaHome} fontSize="1.5rem" mb="5px" />
              <Text opacity={sidebarExpanded ? 1 : 0} fontSize="1rem"transition="opacity 0.3s ease-in-out">
                HOME
              </Text>
            </VStack>
          </NavLink>
          {/* EDIT PROFILE */}
          <NavLink to="/student/settings">
            <VStack
              color="#2B2B2B"
              _hover={{ color: "#ad0d0d" }}
              transition="all 0.3s ease-in-out"
              borderRadius="10px"
              align="center"
            >
              <Icon as={FaCog} fontSize="1.5rem" mb="5px" />
              <Text
                opacity={sidebarExpanded ? 1 : 0}
                fontSize="1rem"
                transition="opacity 0.3s ease-in-out"
              >
                SETTINGS
              </Text>
            </VStack>
         </NavLink>
         {/* LOGOUT */}
            <Box 
              as="button"
              onClick={handleLogout}
              cursor="pointer"
            >
            <VStack
              color="#2B2B2B"
              _hover={{ color: "#ad0d0d" }}
              transition="all 0.3s ease-in-out"
              borderRadius="10px"
              align="center"
              mt="200px"
            >
              <Icon as={FaSignOutAlt} fontSize="1.5rem" mb="5px" />
              <Text
                opacity={sidebarExpanded ? 1 : 0}
                fontSize="1rem"
                transition="opacity 0.3s ease-in-out"
              >
                LOGOUT
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* CONTENT AREA */}
      <Box
        width={{ base: "100%", md: `calc(100% - ${sidebarExpanded ? "175px" : "70px"})` }}
        marginLeft={{ base: "70px", md: sidebarExpanded ? "175px" : "70px" }}
        paddingTop="3%"
        paddingX="30px"
        transition="margin-left 0.3s ease-in-out, width 0.3s ease-in-out"
      >
        <Heading as="h1" fontSize={{ base: "2rem", md: "3rem" }} color="white">
          Diploma Requests
        </Heading>
        
        <Box
          bg={bgColor}
          borderRadius="lg"
          boxShadow="md"
          p={{ base: 4, md: 8 }}
          mt="20px"
        >
          {/* Profile Header */}
          <Flex 
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'center', md: 'flex-start' }}
            mb={2}
          >
            <Box mb={{ base: 4, md: 0 }}>
              <Heading 
                size="xl" 
                color={headingColor}
                mb={2}
              >
                {authUser.fullName}
              </Heading>
              <Text fontSize="xl" fontWeight="medium" color={textColor}>
                Edit Profile Information
              </Text>
            </Box>
          </Flex>
    
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* First Row */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
              <FormControl id="fullname" {...formControlProps}>
                <FormLabel {...formLabelProps}>Full Name</FormLabel>
                <Input 
                  {...inputProps}
                  type="text" 
                  name="fullname" 
                  placeholder="Enter your full name"
                  value={formData.fullname}
                  readOnly
                  onChange={handleInputChange}
                />
              </FormControl>
              
              <FormControl id="student-id" {...formControlProps}>
                <FormLabel {...formLabelProps}>Student ID Number</FormLabel>
                <Input 
                  {...inputProps}
                  type="text" 
                  name="studentId" 
                  placeholder="Enter your student ID"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  readOnly
                />
              </FormControl>

              <FormControl id="email" {...formControlProps}>
                <FormLabel {...formLabelProps}>Email Address</FormLabel>
                <Input 
                  {...inputProps}
                  type="email" 
                  name="email" 
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly
                />
              </FormControl>
              
        
            </SimpleGrid>
            
          
            
            {/* Third Row - Password Section */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
              <FormControl id="current-password" {...formControlProps}>
                <FormLabel {...formLabelProps}>Current Password</FormLabel>
                <Input 
                  {...inputProps}
                  type="password" 
                  name="currentPassword" 
                  placeholder="Enter current password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
              </FormControl>
              
              <FormControl id="new-password" {...formControlProps}>
                <FormLabel {...formLabelProps}>New Password</FormLabel>
                <Input 
                  {...inputProps}
                  type="password" 
                  name="newPassword" 
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </FormControl>
              
              <FormControl id="confirm-password" {...formControlProps}>
                <FormLabel {...formLabelProps}>Confirm New Password</FormLabel>
                <Input 
                  {...inputProps}
                  type="password" 
                  name="confirmPassword" 
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </FormControl>
            </SimpleGrid>
           
            <SimpleGrid marginTop={-8} marginLeft={-8} columns={{ base: 1, md: 3 }} spacing={4} mb={4}>

               <Text 
            marginLeft={10} // Added left margin
              as="a" 
              href="/forgotpassword" 
              display="inline-block" // Changed to inline-block
              color="blue.500" 
              fontSize="sm"
              textDecoration="underline"
              _hover={{ 
                color: "blue.600",
                textDecoration: "none"
              }}
              transition="color 0.2s"
              mt={1} // Added top margin
              textAlign="left" // Explicit left alignment
              width="full" // Takes full container width
            >
              Forgot Password?
            </Text>
              </SimpleGrid>

              
            
            {/* Action Buttons */}
            <Flex justify="flex-end" gap={4}>
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                color={textColor}
                borderColor={borderColor}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                bg="#a50b0b" 
                color="white" 
                _hover={{ bg: "#750a0a" }}
              >
                Save Changes
              </Button>
            </Flex>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default StudentSettings;