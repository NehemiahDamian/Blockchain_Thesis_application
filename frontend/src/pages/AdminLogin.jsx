/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Box,
  FormControl,
  Input,
  Button,
  Heading,
  Text,
  Flex,
  Link,
  InputGroup,
  InputLeftElement,
  VStack,
  Container,
} from "@chakra-ui/react";

function AdminLogin(){
  const [data, setData] = useState({
    email:"",
    password:"",
    role:"admin"        
})

const {login} = useAuthStore()

  const handleSubmit = (e) =>{
    e.preventDefault()
    login(data)

  }
  return (
    <Box
      as="section"
      backgroundImage="url('/src/assets/loginpage-bg.png')"
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
        height="600px"
        bg="#EDEDED"
        zIndex={1000}
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding="40px"
        borderRadius="28px"
        boxShadow="-2px 4px 20px #0c829f43"
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
            color="#b42222"
            textAlign="center"
            lineHeight="85%"
          >
            Welcome<br />Student!
          </Heading>
          
          <VStack
            as="form"
            onSubmit={handleSubmit}
            width="100%"
            gap="25px"
          >
            <FormControl position="relative" width="100%">
              <InputGroup position="relative">
                <Input
                  type="email"
                  background="#EDEDED"
                  border="2px solid #2B2B2B"
                  borderRadius="12px"
                  color="#2B2B2B"
                  fontWeight="500"
                  fontSize="1em"
                  padding="30px 10px 15px"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                  _focus={{
                    "& + Text": {
                      transform: "translateY(-7.5px)",
                      fontSize: "0.8em",
                      color: "#640909",
                    }
                  }}
                />
                <Text
                  position="absolute"
                  left="0"
                  padding="15px 10px"
                  color="#aaa"
                  transition="0.5s"
                  pointerEvents="none"
                  fontSize={data.email ? "0.7em" : "1em"}
                  transform={data.email ? "translateY(-7.5px)" : "none"}
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
                  border="2px solid #2B2B2B"
                  borderRadius="12px"
                  color="#2B2B2B"
                  fontWeight="500"
                  fontSize="1em"
                  padding="25px 10px 15px"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  required
                  _focus={{
                    "& + Text": {
                      transform: "translateY(-7.5px)",
                      fontSize: "0.8em",
                      color: "#640909",
                    }
                  }}
                />
                <Text
                  position="absolute"
                  left="0"
                  padding="15px 10px"
                  color="#aaa"
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

              bg="#8b0e0e"
              boxShadow="0px 4px 5px #00000027"
              fontSize="1.2rem"
              padding="15px 0 15px"
              borderRadius="17px"
              color="#fff"
              fontWeight="500"
              _hover={{ bg: "#d43838", transition: "0.3s" }}
              _active={{ bg: "#640909", transition: "0.3s" }}
            >
              Login
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

export default AdminLogin