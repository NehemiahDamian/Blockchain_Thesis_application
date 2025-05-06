import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Heading, Text, Button, Flex, Menu, MenuButton, MenuList, MenuItem, 
  Container, useDisclosure, useBreakpointValue 
} from '@chakra-ui/react';
import { FaRegFileAlt, FaRegFileExcel, FaChevronDown } from 'react-icons/fa';

function AdminDashboard() {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Common styles for reuse
  const cardStyles = {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    pb: "20px",
    textAlign: { base: 'center', md: 'left' },
    alignItems: { base: 'center', md: 'flex-start' }
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
        <Heading as="h1" fontSize="24px">Welcome, Admin!</Heading>
      </Box>
      
      {/* Card Container */}
      {/* FIRST ROW */}
      <Flex
        flexDirection={{ base: "column", md: "row" }} 
        gap="10px" 
        justifyContent="space-between" 
        alignItems="center"
        w="100%"
      >
        <Container
          bg="white" 
          borderRadius="10px" 
          p={isMobile ? "20px" : "60px 20px"} 
          boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
          flex="1"
          position="relative"
          _after={{
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "7px",
            backgroundColor: "#CE3435",
            borderRadius: "0px 0px 10px 10px"
          }}
        >
        {/* Insert Content Here */}
        </Container>
        <Container
          bg="white" 
          borderRadius="10px" 
          p={isMobile ? "20px" : "60px 20px"} 
          boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
          flex="1"
          position="relative"
          _after={{
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "7px",
            backgroundColor: "#CE3435",
            borderRadius: "0px 0px 10px 10px"
          }}
        >
        {/* Insert Content Here */}
        </Container>
        <Container
          bg="white" 
          borderRadius="10px" 
          p={isMobile ? "20px" : "60px 20px"} 
          boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
          flex="1"
          position="relative"
          _after={{
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "7px",
            backgroundColor: "#CE3435",
            borderRadius: "0px 0px 10px 10px"
          }}
        >
        {/* Insert Content Here */}
        </Container>
      </Flex>
      {/* SECOND ROW */}
      <Flex
        flexDirection={{ base: "column", md: "row" }} 
        gap="15px" 
        width="100%"
        height="50vh"
      >
        <Container
        flex="1"
        width="100%"
        maxW="200vh"
        backgroundColor= "#ffffff"
        border= "1px solid #e0e0e0;"
        borderRadius= "10px"
        boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
        >
          {/* Insert Content Here */}
        </Container>
        <Container
        flex="1.5"
        width="100%"
        backgroundColor= "#ffffff"
        border= "1px solid #e0e0e0;"
        borderRadius= "10px"
        boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
        >
          {/* Insert Content Here */}
        </Container>


      </Flex>
    </Box>
  );
}

export default AdminDashboard;