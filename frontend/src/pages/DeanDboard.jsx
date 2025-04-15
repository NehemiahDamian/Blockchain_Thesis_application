import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useDeanStore } from "../store/useDeanStore";
import {
  Box, Heading, Text, Button, Flex, Menu, MenuButton, MenuList, MenuItem,
  Container, useBreakpointValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaRegFileLines } from 'react-icons/fa6';

export default function AdminProcess() {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const iconSize = useBreakpointValue({ base: '0em', xl: '130px', lg: '100px', md: '0px', sm: '0px' });
    const iconFontSize = useBreakpointValue({ base: '30px', xl: '65px', lg: '55px', md: '45px' });

    const iconContainerStyles = {
      position: { md: "absolute" },
      mt: { base: 4, md: 0 },
      width: iconSize,
      height: iconSize,
      bg: "#f8f8f8",
      borderRadius: "50%",
      alignItems: "center",
      justifyContent: "center",
      mr: { base: "0", md: "40px" },
      ml: { base: '0px', xl: '10px', lg: '0px', md: '0px' }
    };


  return (
    <Box display="flex" flexDirection="column" gap="20px" p="20px" bg="#f7faff" minH="100vh" >
      {/* Welcome Banner */}
      <Box 
        bgGradient="linear(to-l, #be1010, #8C0001)" 
        color="white" 
        p="20px" 
        borderRadius="10px"
      >
        <Heading as="h1" fontSize="24px">Welcome, Dean!</Heading>
      </Box>

      {/* Card Container */}
      <Container 
        maxW="85%" 
        mx="auto"
        bg="white" 
        borderRadius="10px" 
        p={isMobile ? "20px" : "30px 70px"} 
        boxShadow="0 2px 10px rgba(0, 0, 0, 0.05)"
      >
        <Flex 
          direction={isMobile ? "column" : "row"} 
          justifyContent="space-between" 
          gap="20px"
          position="relative"
        >
          <Flex {...iconContainerStyles} display="flex">
            <Box as={FaRegFileLines} fontSize={iconFontSize} color="#d33139" />
          </Flex>
          <Box 
            display="flex" 
            flexDirection="column" 
            gap="15px"
            textAlign= "start"
            ml="auto" mr="auto"
          >
          <Heading as="h2" fontSize={isMobile ? "24px" : "45px"} color="#333">
              Process Incoming Diplomas
            </Heading>
            <Text fontSize="16px" color="#363636" mt="-3%">
            There are some diplomas that require your attention 
            </Text>
            <Button
              as={RouterLink}
              to="/dean/homepage"
              maxW={isMobile ? "90%" : "50%"}
              fontWeight="bold"
              bg="white"
              color="#d33139"
              border="1px solid #d33139"
              borderRadius="5px"
              p="10px 20px"
              textDecoration="none"
              transition="all 0.3s ease"
              textAlign="center"
              _hover={{
                bg: "#d33139",
                color: "white"
              }}
            > 
            Process Diplomas
            </Button>
          </Box>


        </Flex>
      </Container>

    </Box>
  );
}