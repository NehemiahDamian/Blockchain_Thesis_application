/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import { useRegistrarStore } from "../store/useRegistrarStore";
import { Box, Flex, Heading, Text, FormControl, FormLabel, Input, Button, 
  useColorModeValue, Container, SimpleGrid, FormHelperText, useToast, Image } from "@chakra-ui/react";

const RegistrarEsig= () => {
  const { authUser, resetPasswordatLoggedIn} = useAuthStore();
  const {addEsignature} = useRegistrarStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const toast = useToast(); // for Notifications


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await addEsignature({  esignature: base64Image });
      // Added toast for notification
      toast({
        title: "Signature uploaded",
        description: "Your e-signature has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    };
    console.log(selectedImg);
  };

  // Gets the registrar info
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || '',
    email: authUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handles edit profile form submission
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  // Submit with validation
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Validate password match
  if (formData.newPassword !== formData.confirmPassword) {
    toast({
      title: "Passwords don't match",
      description: "New password and confirm password must match",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return; // Important: Return early on error
  }

  try {
    // 2. Attempt password change
    await resetPasswordatLoggedIn(formData.currentPassword, formData.newPassword);
    
    // 3. Only show success if password change succeeded
    toast({
      title: "Changes saved",
      description: "Your password has been updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    // 4. Reset form fields
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

  } catch (error) {
    console.error("Error updating password:", error);
  }
};

  const bgColor = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('linear(to-l, #be1010, #8C0001)', 'linear(to-l, #a10c0c, #640505)');
  const headingColor = useColorModeValue('#640e0e', '#f7d0d0');

  const handleCancel = () => {
    // Reset form
    setFormData({
      fullName: authUser?.fullName || '',
      email: authUser?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setSelectedImg(null);
  };

  return (
    <Box display="flex" flexDirection="column" gap="20px" p="20px" bg="#f7faff" minH="100vh" className="pt-20">
    {/* Header */}
      <Box 
        bgGradient="linear(to-l, #be1010, #8C0001)" 
        color="white" 
        p="20px" 
        borderRadius="10px"
      >
      <Heading as="h1" fontSize="24px">Registrar Profile Settings</Heading>
      </Box>

    {/* Main Content */}
      <Container maxW="container.xl" p={0}>
        <Box
          bg={bgColor}
          borderRadius="lg"
          boxShadow="md"
          p={{ base: 4, md: 8 }}
        >
          {/* Profile Header */}
          <Box mb={6}>
            <Heading 
              size="xl" 
              color={headingColor}
              mb={2}
            >
              {authUser?.fullName || 'Registrar Profile'}
            </Heading>
            <Text fontSize="xl" fontWeight="medium">Edit Profile Information</Text>
          </Box>

         {/* Form */}
         <form onSubmit={handleSubmit}>
            {/* First Row */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={2}>
              <FormControl id="fullName">
                <FormLabel fontWeight="semibold">
                  <Flex align="center" gap="2">
                    <User size={16} />
                    Full Name
                  </Flex>
                </FormLabel>
                <Input 
                  type="text" 
                  name="fullName" 
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  isReadOnly
                />
              </FormControl>
              
              <FormControl id="email">
                <FormLabel fontWeight="semibold">
                  <Flex align="center" gap="2">
                    <Mail size={16} />
                    Email Address
                  </Flex>
                </FormLabel>
                <Input 
                  type="email" 
                  name="email" 
                  placeholder="Enter your email"
                  value={formData.email}
                  isReadOnly
                />
              </FormControl>
            </SimpleGrid>
            
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={6}>
          {/* Current Password Field */}
          <FormControl id="currentPassword">
            <FormLabel fontWeight="semibold">Current Password</FormLabel>
            <Input 
              type="password" 
              name="currentPassword" 
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* New Password Field */}  
          <FormControl id="newPassword">
            <FormLabel fontWeight="semibold">New Password</FormLabel>
            <Input 
              type="password" 
              name="newPassword" 
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Confirm Password Field with Forgot Link */}
          <FormControl id="confirmPassword">
            <FormLabel fontWeight="semibold">Confirm New Password</FormLabel>
            <Input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              mb={1} // Reduced bottom margin
            />
          </FormControl>
        </SimpleGrid>

            <SimpleGrid marginTop={-8} marginLeft={-5} columns={{ base: 1, md: 3 }} spacing={5} mb={6}>

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
            <Flex 
              direction={{ base: 'column', md: 'row' }} 
              gap={6} 
              mb={8} 
              align="start"
              justify="space-between"
            >
              <FormControl id="signature" flex="1">
                <FormLabel fontWeight="semibold">E-Signature</FormLabel>
                <Text fontSize="sm" mb={2}>
                  Your e-signature will be used for document approvals and official communications.
                </Text>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <FormHelperText>Upload a clear image of your signature (PNG format recommended)</FormHelperText>
              </FormControl>
              
              {/* Signature Preview */}
              <Box 
                border="1px" 
                borderColor="gray.200" 
                borderRadius="md" 
                p={4} 
                width={{ base: "100%", md: "300px" }}
                height="150px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bg="gray.50"
              >
                {selectedImg || authUser?.esignature ? (
                  <Image 
                    src={selectedImg || authUser?.esignature || "/avatar.png"}
                    alt="Signature Preview"
                    maxHeight="130px"
                    objectFit="contain"
                  />
                ) : (
                  <Text color="gray.500" fontSize="sm">Signature Preview</Text>
                )}
              </Box>
            </Flex>
            
            {/* Action Buttons */}
            <Flex justify="flex-end" gap={4}>
              <Button variant="outline" onClick={handleCancel}>
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
        </Container>
    </Box>
  );
};
export default RegistrarEsig;