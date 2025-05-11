import { Box, Button, Flex, Grid, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect } from "react";
import { FaFolderOpen } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useAdminStore } from '../store/useAdminStore.js';

const scrollableContainerStyle = {
  maxHeight: "500px",
  overflowY: "auto",
  padding: "16px",
  background: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

function Archives() {
  const navigate = useNavigate();
  const { fetchDepartmentYears, departmentsArr } = useAdminStore();

  useEffect(() => {
    fetchDepartmentYears(); 
  }, [fetchDepartmentYears]);

  const handleViewYears = (department) => {
    const years = Object.keys(departmentsArr[department]);

    navigate(`/admin/FilteredArchive?department=${department}&years=${encodeURIComponent(JSON.stringify(years))}`);
  };

  const headerBg = useColorModeValue('linear-gradient(-90deg, #be1010, #8C0001)', 'linear-gradient(-90deg, #be1010, #8C0001)');
  const buttonHoverBg = useColorModeValue('linear-gradient(180deg, #E43C3F, #a92426)', 'linear-gradient(180deg, #E43C3F, #a92426)');

  return (
    <Box bg="#f7faff" minH="100vh" py={6} px={4}>
      {/* Header */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={8}
        bgImage={headerBg}
        boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
        borderRadius="10px"
        width="95%"
        mx="auto"
        mt="2%"
      >
        <Flex alignItems="center">
          <Box mr={3} color="#f0f0f0">
            <FaFolderOpen size={50} />
          </Box>
          <Box>
            <Heading fontSize="35px" color="#eaeaea">Diploma Archives</Heading>
            <Text color="#e3e3e3">Select a college</Text>
          </Box>
        </Flex>
      </Flex>
      {/* College Containers*/}
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={9}
        justifyItems="center"
        mt="4%"
        mx="auto"
        maxW="1200px"
      >
        {Object.keys(departmentsArr).map((department, index) => (
          <Box key={`${department}${index}`}
            as="button"
            w="320px"
            h="140px"
            bg="white"
            borderRadius="15px"
            boxShadow="0px 0px 20px #00000027"
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
            overflow="hidden"
            transition="box-shadow 0.3s ease"
            _hover={{
              boxShadow: "0px 0px 15px #00000048",
              "&::before": {
                opacity: 1
              },
              "& > div": {
                color: "white",
                fontWeight: "bold"
              }
            }}
            sx={{
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                backgroundImage: buttonHoverBg,
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
                borderRadius: "15px",
                pointerEvents: "none"
              }
            }}
            onClick={() => handleViewYears(department)}
          >
            <Text
              position="relative"
              zIndex={1}
              fontSize="1.5rem"
              color="#222222"
              transition="color 0.3s ease-in-out"
              fontWeight="600"
            >
              {department}
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}

export default Archives;
