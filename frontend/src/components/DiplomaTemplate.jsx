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
  studentToken = "",
  gwa = null 
}) {

  // Function to expand department acronyms to full names
  const expandDepartment = (dept) => {
    const departmentMap = {
      "BSIT": "Bachelor of Science in Information Technology",
      "Information Technology": "Bachelor of Science in Information Technology",
      "BSCS": "Bachelor of Science in Computer Science",
      "Computer Science": "Bachelor of Science in Computer Science",
      "Esports": "Bachelor of Science in ESports",
      "BS ESports": "Bachelor of Science in ESports"
    };
    return departmentMap[dept] || dept;
  };

  const latinHonor = (() => {
    if (!gwa) return null;
    const num = parseFloat(gwa);
    if (num >= 1.00 && num <= 1.20) return "Summa Cum Laude";
    if (num > 1.20 && num <= 1.45) return "Magna Cum Laude";
    if (num > 1.45 && num <= 1.70) return "Cum Laude";
    return null; // 1.71+ gets nothing
  })();

  const displayDepartment = expandDepartment(department);

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

      {/* ONLY ADDITION: Latin Honors - shows ONLY when qualified */}
      {latinHonor && (
        <Text
          textAlign="center"
          fontSize="30px"
          fontWeight="medium"
          my="5px"
          color="#2a52be"
          fontStyle="italic"
        >
          {latinHonor}
        </Text>
      )}

      {/* Description */}
      <Text
        textAlign="center"
        fontSize="15px"
        lineHeight="1.2"
        mt={latinHonor ? "5px" : "15px"}
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
      >
        Issued in Manila, Philippines on August 1, 2025
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
              top="75%"              
              left="14%"
              maxH="60px"
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
                top="73%"
                transform="translateX(-50%)"
                maxH="100px"
                maxW="120px"
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
              top="70%"
              left="46%"
              maxH="60px"
              maxW="100px"
              objectFit="contain"
            />
          ) : (
            signature && signerRole === "registrar" && (
              <Image 
                src={signature} 
                alt="Signature" 
                position="absolute"
                top="73%"
                left="50%"
                transform="translateX(-50%)"
                maxH="60px"
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
        {studentToken}
      </Text>
    </Box>
  );
};

export default DiplomaTemplate;