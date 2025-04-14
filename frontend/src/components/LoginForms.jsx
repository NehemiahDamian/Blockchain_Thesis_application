import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  InputGroup,
  Input,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';

// Reusable Login Component with support for additional elements and error handling
const LoginForm = ({ 
  userType, 
  data, 
  setData, 
  handleSubmit, 
  backgroundImage = '/src/assets/loginpage-bg.png',
  additionalElements = null,
  useSimpleForm = false,
  errorMessage = null // New prop for error messages
}) => {
  // Define color schemes based on user type
  const colorSchemes = {
    dean: {
      primary: '#b42222',
      secondary: '#8b0e0e',
      hover: '#d43838',
      active: '#640909',
      focus: '#640909'
    }
  };

  // Get appropriate color scheme or default to dean colors
  const colors = colorSchemes[userType.toLowerCase()] || colorSchemes.dean;

  // Determine which email field name to use
  const emailField = 'email' in data ? 'email' : 'emaail';

  // Modified form submission handler to wrap the original
  const submitWithValidation = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  // Simple form rendering (more basic styling like your student example)
  if (useSimpleForm) {
    return (
      <Box
        as="section"
        backgroundImage={backgroundImage ? `url('${backgroundImage}')` : undefined}
        bgSize="cover"
        bgPosition="center"
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding="20px"
      >
        <Container
          width="100%"
          maxWidth="400px"
          bg="white"
          padding="30px"
          borderRadius="8px"
          boxShadow="0 4px 6px rgba(0,0,0,0.1)"
        >
          <VStack spacing={4} align="stretch">
            <Heading 
              as="h2" 
              fontSize="2xl" 
              textAlign="center" 
              color={colors.primary}
            >
              {userType} Login
            </Heading>
            
            {/* Error message display */}
            {errorMessage && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={submitWithValidation}>
              <VStack spacing={4}>
                <Input
                  type="email"
                  placeholder="Email"
                  value={data[emailField] || ""}
                  onChange={(e) => setData({ ...data, [emailField]: e.target.value })}
                  required
                  isInvalid={errorMessage}
                />
                
                <Input
                  type="password"
                  placeholder="Password"
                  value={data.password || ""}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  required
                  isInvalid={errorMessage}
                />
                
                <Button
                  type="submit"
                  width="100%"
                  bg={colors.secondary}
                  color="white"
                  _hover={{ bg: colors.hover }}
                >
                  Login
                </Button>
              </VStack>
            </form>
            
            {/* Render additional elements if provided */}
            {additionalElements}
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      as="section"
      backgroundImage={`url('${backgroundImage}')`}
      bgSize="cover"
      bgPosition="center"
      position="absolute"
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      overflow="hidden"
    >
      <Container
        position="relative"
        width="500px"
        height="auto"
        minHeight="490px"
        bg="#EDEDED"
        zIndex={1000}
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding="40px"
        borderRadius="28px"
        boxShadow="-2px 4px 20px rgba(12, 130, 159, 0.26)"
      >
        <VStack
          as="div"
          className="content"
          position="relative"
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap="35px"
        >
          <Heading
            as="h2"
            fontSize="4.5em"
            color={colors.primary}
            textAlign="center"
            lineHeight="85%"
          >
            Welcome<br />{userType}!
          </Heading>
          
          {/* Error message display */}
          {errorMessage && (
            <Alert status="error" borderRadius="lg" width="100%">
              <AlertIcon />
              <Box>
                <AlertTitle fontWeight="bold">Login Failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Box>
            </Alert>
          )}
          
          <VStack
            as="form"
            onSubmit={submitWithValidation}
            width="100%"
            gap="25px"
          >
            <FormControl position="relative" width="100%">
              <InputGroup position="relative">
                <Input
                  type="email"
                  background="#EDEDED"
                  border={errorMessage ? "2px solid #E53E3E" : "2px solid #2B2B2B"}
                  borderRadius="12px"
                  color="#2B2B2B"
                  fontWeight="500"
                  fontSize="1em"
                  padding="30px 10px 15px"
                  value={data[emailField] || ""}
                  onChange={(e) => setData({ ...data, [emailField]: e.target.value })}
                  required
                  _focus={{
                    "& + Text": {
                      transform: "translateY(-7.5px)",
                      fontSize: "0.8em",
                      color: colors.focus,
                    }
                  }}
                />
                <Text
                  position="absolute"
                  left="0"
                  padding="15px 10px"
                  color={errorMessage ? "#E53E3E" : "#aaa"}
                  transition="0.5s"
                  pointerEvents="none"
                  fontSize={data[emailField] ? "0.7em" : "1em"}
                  transform={data[emailField] ? "translateY(-7.5px)" : "none"}
                >
                  Email
                </Text>
              </InputGroup>
            </FormControl>
            
            <FormControl position="relative" width="100%">
              <InputGroup position="relative">
                <Input
                  type="password"
                  background="#EDEDED"
                  border={errorMessage ? "2px solid #E53E3E" : "2px solid #2B2B2B"}
                  borderRadius="12px"
                  color="#2B2B2B"
                  fontWeight="500"
                  fontSize="1em"
                  padding="25px 10px 15px"
                  value={data.password || ""}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  required
                  _focus={{
                    "& + Text": {
                      transform: "translateY(-7.5px)",
                      fontSize: "0.8em",
                      color: colors.focus,
                    }
                  }}
                />
                <Text
                  position="absolute"
                  left="0"
                  padding="15px 10px"
                  color={errorMessage ? "#E53E3E" : "#aaa"}
                  transition="0.5s"
                  pointerEvents="none"
                  fontSize={data.password ? "0.7em" : "1em"}
                  transform={data.password ? "translateY(-7.5px)" : "none"}
                >
                  Password
                </Text>
              </InputGroup>
            </FormControl>
            
            <Button
              type="submit"
              position="relative"
              cursor="pointer"
              width="75%"
              height="7vh"
              ml="auto" mr="auto"
              bg={colors.secondary}
              boxShadow="0px 4px 5px rgba(0, 0, 0, 0.15)"
              fontSize="1.2rem"
              padding="15px 0 15px"
              borderRadius="17px"
              color="#fff"
              fontWeight="500"
              _hover={{ bg: colors.hover, transition: "0.3s" }}
              _active={{ bg: colors.active, transition: "0.3s" }}
            >
              Login
            </Button>
          </VStack>
          
          {/* Render additional elements if provided */}
          {additionalElements && (
            <Box width="100%" textAlign="center" mt={4}>
              {additionalElements}
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginForm;