/* eslint-disable no-unused-vars */

import { useDeanStore } from "../store/useDeanStore";
import { useAuthStore } from "../store/useAuthStore";
import { 
  Box, Button, Text, Input, Select, Icon, Flex, Heading,
  Grid, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useDisclosure, HStack, useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function DeanHomePage() {

  // need den to for functionalities
  const authUser = useAuthStore(state => state.authUser); // Get authUser inside component

  // need to dito manggaling yung functionalities
  const { getSession, UrlSession, setUrlSession, studentDetails, getEsignature, digitalSignature, eSignature } = useDeanStore();
 
  // for filtering the page
  const navigate = useNavigate();

  // eto yung function nayon need den to mahalaga to no 
  // hinde pede tanggalen
  const getDeanDepartment = async (e) => {
    // need to for not doing the default things ng React medyo magulo hirap iexplain
    e.preventDefault();
  
    console.log("authUser:", authUser);
  
    if (!authUser?.department) {
      console.warn("No department found in authUser");
      return;
    }
  
    console.log("Fetching session for:", authUser.department);
    
    const sessionId = await getSession(authUser.department);
  
    console.log("Received session ID:", sessionId);
  
    if (sessionId) {
      sessionStorage.setItem("deanSession", sessionId);
      sessionStorage.setItem("department", authUser.department);
      navigate(`/dean/view-diplomas?session=${sessionId}&department=${authUser.department}`);
    } else {
      console.warn("No session ID received!");
    }
  };

  const cardStyle = {
    bg: "white", 
    p: 5, 
    borderRadius: "md", 
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)"
  };
  
  return (
    <Box display="flex" p="20px" h="100vh">
      <Box flex={1} p={0} position="relative">
      {/* Header */}
        <Box 
        bgGradient="linear(to-l, #be1010, #8C0001)" 
        color="white" 
        p="20px" 
        borderRadius="10px"
        >
          <Heading as="h1" fontSize="24px">Process Diplomas</Heading>
        </Box>
      {/* Content */}
      <Flex p={6} h="calc(100vh - 140px)" direction={{ base: "column", md: "row" }} gap={6}>
      {/* Left Side */}
        <Box w={{ base: "100%", md: "25%" }} h="fit-content">
          <Box {...cardStyle} mb={4}>
            {/* for anoto like filtered page like need to to fecth coressponding diploma ng mga dean like
            COT diplomas -> dean ng COT */}
              {/* // hinde pede tanggalen */}
            <Button 
            size="lg" w="full" p={5} colorScheme="red"
            onClick={getDeanDepartment} fontWeight="bold"
            > Process Diplomas 
            </Button>
          </Box>
        </Box>
      {/* Right Side */}
      <Box 
          flex={1} 
          bg="white" 
          borderRadius="md" 
          boxShadow="0 2px 10px rgba(0, 0, 0, 0.07)"
          overflow="auto"
          maxH={{ base: "none", md: "calc(100vh - 140px)" }}
        >
          {/* List Header */}
          <Flex 
            justify="space-between" 
            align={{ base: "flex-start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            p={4}
            borderBottom="1px"
            borderColor="gray.200"
          >
            <Heading size="md">COT 2025-2026</Heading>
            
            <Flex 
              mt={{ base: 4, md: 0 }}
              w={{ base: "full", md: "auto" }}
              gap={4}
              direction={{ base: "column", md: "row" }}
              align={{ base: "stretch", md: "center" }}
            >
              <Input 
                placeholder="Search Name:" 
                size="md" 
                w={{ base: "full", md: "200px" }}
                borderRadius="full"
                onChange={(e) => setSearchTerm(e.target.value)}
                _focus={{ borderColor: "red.500", boxShadow: "0 0 0 1px rgba(211, 49, 57, 0.1)" }}
              />
              
              <Flex align="center">
                <Text fontSize="sm" mr={2}>Show</Text>
                <Select 
                  size="sm" 
                  w="70px" 
                  borderRadius="md"
                >
                  {[10, 25, 50, 100].map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </Select>
                <Text fontSize="sm" ml={2}>entries</Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Diploma Grid */}
          <Grid templateColumns={{ base: "repeat(1, 1fr)" }} gap={6} p={6}>
          </Grid>
        </Box>
       </Flex>
       </Box>
    </Box>
  );
}

export default DeanHomePage;