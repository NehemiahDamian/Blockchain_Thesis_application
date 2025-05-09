/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Box, Text, Flex, Image, Center } from "@chakra-ui/react";

function DiplomaTemplate({ 
  studentName = "[Student Name]", 
  studentId = "",
  department = "", 
  graduationYear = "",
  signature = null,
  signerRole = "dean", //default
  deanSignature = null,
  registrarSignature = null,
  studentToken = ""
}) {
  
// Function to expand department acronyms to full names
const expandDepartment = (dept) => {
// Map of common department acronyms to their full names
  const departmentMap = {
  "BSIT": "Bachelor of Science in Information Technology",
  "BS Information Technology": "Bachelor of Science in Information Technology",
  "BSCS": "Bachelor of Science in Computer Science",
  "BS Computer Science": "Bachelor of Science in Computer Science",
  "Esports": "Bachelor of Science in ESports",
  "BS ESports": "Bachelor of Science in ESports"
  };
    
// Return the expanded name if it exists in the map, otherwise return the original value
  return departmentMap[dept] || dept;
};

const displayDepartment = expandDepartment(department);

const getSignaturePosition = () => {
  if (signerRole === "dean") {
      return {
        bottom: "0",
        left: "20%",
        top: "70%",
        transform: "translateX(-50%)"
      };
    } else if (signerRole === "registrar") {
      return {
        bottom: "0",
        left: "50%", 
        top: "76%",
        transform: "translateX(-50%)"
      };
    } else {
      // Default position if role is not specified
      return {
        bottom: "0",
        left: "20%",
        top: "70%",
        transform: "translateX(-50%)"
      };
    }
  };
const signaturePosition = getSignaturePosition();


  return (
    <Box
      w="800px"
      h="475px"
      bgGradient="linear(to-br, #f5f5f5, #e0e0e0)"
      borderRadius="20px"
      boxShadow="0 0 15px rgba(0,0,0,0.2)"
      p="40px"
      position="relative"
      overflow="hidden"
      mx="auto"
      fontFamily="serif"
    >
      {/* Border */}
      <Box
        position="absolute"
        top="10px"
        left="10px"
        right="10px"
        bottom="10px"
        border="2px solid #c9a842"
        borderRadius="15px"
        pointerEvents="none"
      />

      {/* University Logo */}
      <Center>
        <Image h="40px" w="auto" src="../src/assets/logo.png" alt="University Logo" />
      </Center>

      {/* University Name */}
      <Text
        textAlign="center"
        fontSize="19px"
        color="#050505"
        mt="2px"
        letterSpacing="1px"
      >
        LYCEUM OF THE PHILIPPINES UNIVERSITY MANILA
      </Text>

      {/* Description */}
      <Text
        textAlign="center"
        fontSize="15px"
        lineHeight="1.2"
        my="15px"
        color="#000000"
        fontStyle="italic"
      >
        Be it whom that the Board of Trustees, by authority of Republic of the Philippines and an recommendation of the <br />
        Academic Council has confered upon
      </Text>

      {/* Recipient Name */}
      <Text
        textAlign="center"
        fontSize="60px"
        mt="-20px"
        fontWeight="bold"
        color="#000000"
        textDecoration="underline"
      >
        {studentName}
      </Text>

      {/* Description */}
      <Text
        textAlign="center"
        fontSize="15px"
        lineHeight="1.2"
        mt="5px"
        color="#000000"
        fontStyle="italic"
      >
        who has fulfilled all the requirements thereof, the degree of
      </Text>

      {/* Degree Title */}
      <Text
        textAlign="center"
        fontSize="30px"
        fontWeight="medium"
        my="5px"
        mb="20px"
        color="#000000"
      >
        {displayDepartment}
      </Text>

      {/* Date */}
      <Text
        textAlign="center"
        fontSize="15px"
        lineHeight="1.2"
        color="#000000"
        fontStyle="italic"
        marginbtop="20px"
      >
        Issued on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </Text>

      {/* Signatures Section */}
      <Flex justify="space-between" mt="5px" px="30px">
        <Box textAlign="center" my="25px">
          <Box w="175px" mx="auto" borderBottom="1px solid #000000" mb="5px" />
          {deanSignature ? (
            <Image 
              src={deanSignature} 
              alt="Dean Signature" 
              position="absolute"
              left="20%"
              top="70%"
              transform="translateX(-50%)"
              maxH="90px"
              maxW="100px"
              objectFit="contain"
            />
          ) : (
            signature && signerRole === "dean" && (
              <Image 
                src={signature} 
                alt="Signature" 
                position="absolute"
                left="20%"
                top="60%"
                transform="translateX(-50%)"
                maxH="90px"
                maxW="100px"
                objectFit="contain"
              />
            )
          )}
          <Text fontSize="13px" color="#000000" mt="5px">
            Name of Dean
          </Text>
          <Text fontSize="12px" color="#000000" mt="-2px" fontStyle="italic">
            College Dean
          </Text>
        </Box>

        <Box textAlign="center" my="25px">
          <Box w="175px" mx="auto" borderBottom="1px solid #000000" mb="5px" />
          {registrarSignature ? (
            <Image 
              src={registrarSignature} 
              alt="registatr Signature" 
              position="absolute"
              left="50%"
              top=" 77%"
              transform="translateX(-50%)"
              maxH="90px"
              maxW="100px"
              objectFit="contain"
            />
          ) : (
            signature && signerRole === "registrar" && (
              <Image 
                src={signature} 
                alt="Signature" 
                position="absolute"
                left="50%"
                top=" 30%"
                transform="translateX(-50%)"
                maxH="90px"
                maxW="100px"
                objectFit="contain"
              />
            )
          )}
          <Text fontSize="13px" color="#000000" mt="5px">
            Ms. Devy Galang
          </Text>
          <Text fontSize="12px" color="#000000" mt="-2px" fontStyle="italic">
            Registrar
          </Text>
        </Box>

        <Box textAlign="center" my="25px">
          <Box w="175px" mx="auto" borderBottom="1px solid #000000" mb="5px" />
          <Image 
            src="../src/assets/pressig.png"
            alt="Registrar Signature" 
            position="absolute"
            left="80%"
            top="70%"
            transform="translateX(-50%)"
            maxH="90px"
            maxW="100px"
            objectFit="contain"
          />
          <Text fontSize="13px" color="#000000" mt="5px">
            President
          </Text>
          <Text fontSize="12px" color="#000000" mt="-2px" fontStyle="italic">
            School President
          </Text>
        </Box>
      </Flex>
      <Text
        position="absolute"
        bottom="20px"
        width="100%"
        textAlign="center"
        fontSize="12px"
        color="#050505"
        letterSpacing="1px"
        left="50%"
        transform="translateX(-50%)"
      >
        {studentToken }
      </Text>
    </Box>
  );
};

export default DiplomaTemplate;