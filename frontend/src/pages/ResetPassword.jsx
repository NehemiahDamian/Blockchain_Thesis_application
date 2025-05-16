import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  FormControl, 
  Heading, 
  Input, 
  InputGroup, 
  InputRightElement, 
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const token = searchParams.get('token');
  const { resetPassword } = useAuthStore();

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, password);
      onOpen();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Password reset failed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
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
          Reset Password
        </Heading>
        
        <Button
          leftIcon={<FaArrowLeft />}
          variant="link"
          color="white"
          mb="6"
          onClick={() => navigate('/login')}
          _hover={{ 
            textDecoration: "none", 
            color: "#ff6b6b",
            transform: "translateX(-5px)" 
          }}
          transition="0.3s"
        >
          Back to Login
        </Button>
        
        <Box 
          bg="whiteAlpha.700" 
          p={12} 
          borderRadius="xl" 
          boxShadow="lg"
          maxW="700px"
          ml="auto" 
          mr="auto"
          mb={2}
        >
          <Text fontSize="lg" mb={6} color="#333">
            Enter your new password below.
          </Text>
          
          {error && (
            <Text color="red.500" mb={4} textAlign="center">
              {error}
            </Text>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormControl isRequired mb={6}>
              <InputGroup>
                <InputRightElement pointerEvents="none">
                  <Box as={FaLock} color="#8b0e0e" />
                </InputRightElement>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  bg="white"
                  color="#202020"
                  size="lg"
                  borderRadius="xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  _hover={{ bg: "white" }}
                  _focus={{ 
                    boxShadow: "0px 0px 0px 3px rgba(139,14,14,0.3)",
                    transform: "translateY(-2px)"
                  }}
                  transition="all 0.3s ease"
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired mb={8}>
              <InputGroup>
                <InputRightElement pointerEvents="none">
                  <Box as={FaLock} color="#8b0e0e" />
                </InputRightElement>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  bg="white"
                  color="#202020"
                  size="lg"
                  borderRadius="xl"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              loadingText="Resetting Password"
              leftIcon={<FaLock />}
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
              Set New Password
            </Button>
          </form>
        </Box>
        
        {/* Success Modal */}
        <Modal isOpen={isOpen} onClose={() => {
          onClose();
          navigate('/login');
        }}>
          <ModalOverlay />
          <ModalContent borderRadius="xl" mt="auto" mb="auto">
            <ModalHeader bg="#8b0e0e" color="white" borderTopRadius="xl" display="flex" alignItems="center">
              <Box as={FaCheckCircle} mr="2" />
              Password Reset Successful
            </ModalHeader>
            <ModalCloseButton color="white" _hover={{ color: "#ff6b6b" }} />
            <ModalBody py={6} textAlign="center"> 
              <Text fontSize="xl" mb={4}>
                Your password has been successfully updated!
              </Text>
              <Text mt={4} fontSize="sm" color="gray.600">
                You will now be redirected to the login page.
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Flex>
  );
};

export default ResetPasswordPage;