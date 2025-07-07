/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Heading, Text, Button, Flex, Menu, MenuButton, MenuList, MenuItem, 
  Container, useDisclosure, useBreakpointValue 
} from '@chakra-ui/react';
import { FaRegFileAlt, FaRegFileExcel, FaChevronDown } from 'react-icons/fa';
import { useAdminStore } from '../store/useAdminStore.js';

function AdminDashboard() {
  const navigate = useNavigate();
  const{ fetchDepartmentYears, departmentYears, fetchStudentDetails } = useAdminStore()

  useEffect(() => {
    fetchDepartmentYears()
  }, [fetchDepartmentYears]);

  // Mock data for declined diploma
  useEffect(() => {
    // Add mock declined data if it doesn't exist yet
    const hasDeclinedData = departmentYears.some(dept => dept.status === "Declined");
    
    if (!hasDeclinedData && departmentYears.length > 0) {
      // Create a deep copy of departmentYears
      const updatedDepartmentYears = [...departmentYears];
      
      // Add mock declined entry
      updatedDepartmentYears.push({
        department: "College of Arts and Sciences",
        year: "2025",
        status: "Declined",
        diplomaCount: 0,
        raw: {
          total: 3,
          signed: 1
        }
      });
    }
  }, [departmentYears]);

  const handleViewDiplomas = async (department, year) => {
    try {
      await fetchStudentDetails(department, year);
      navigate(`/admin/FilteredAdminBchain?department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}`);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };
  
  const [viewMode, setViewMode] = useState(null); // null, 'view-signed'
  const [filterValue, setFilterValue] = useState('All');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const iconSize = useBreakpointValue({ base: '0em', xl: '130px', lg: '100px', md: '0px', sm: '0px' });
  const iconFontSize = useBreakpointValue({ base: '30px', xl: '65px', lg: '55px', md: '45px' });

  // Just navigate directly to /admin/page
  const handleSignClick = () => {
    navigate('/admin/page');
  };

  const handleViewClick = () => {
    setViewMode(viewMode === 'view-signed' ? null : 'view-signed');
  };

  //tas gawa nlng ng button dito for the filtered pages ng mga isisign

  const cardStyles = {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    pb: "20px",
    textAlign: { base: 'center', md: 'left' },
    alignItems: { base: 'center', md: 'flex-start' }
  };

  const buttonStyles = {
    width: "100px",
    fontWeight: "bold",
    bg: "white",
    color: "#d33139",
    border: "1px solid #d33139",
    borderRadius: "5px",
    p: "10px 20px",
    _hover: { bg: '#d33139', color: 'white', textDecoration: 'none' }
  };

  const iconContainerStyles = {
    position: { md: "absolute" },
    bottom: { md: "20px" },
    right: { xl: "20px", lg: "5px" },
    mt: { base: 4, md: 0 },
    width: iconSize,
    height: iconSize,
    bg: "#f8f8f8",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center"
  };

  const collegeCardStyles = {
    width: "100%",
    bg: "#F3F3F3",
    p: { base: "15px", md: "25px 40px" },
    borderRadius: "10px",
    justifyContent: "space-between",
    alignItems: { base: "flex-start", md: "center" },
    flexDirection: { base: "column", md: "row" },
    gap: { base: "15px", md: "0" },
    boxShadow: "0 4px 5px rgba(0, 0, 0, 0.088)"
  };

  const collegeButtonStyles = {
    width: "125px",
    fontWeight: "bold",
    bg: "#F3F3F3",
    color: "#d33139",
    border: "1px solid #d33139",
    boxShadow: "0 4px 3px rgba(0, 0, 0, 0.088)",
    borderRadius: "8px",
    p: "7px 15px",
    alignSelf: { base: "flex-end", md: "center" },
    _hover: { bg: "white", transform: "translateY(-2px)", textDecoration: "none" }
  };

  // Filter departments based on the selected filter
 const filteredDepartments = filterValue === 'All' 
    ? [...departmentYears, {
        department: "College of Education",
        year: "2025",
        status: "Declined",
        diplomaCount: 0,
        raw: {
          total: 3,
          signed: 1
        }
      }]
    : [...departmentYears, {
        department: "College of Education",
        year: "2025",
        status: "Declined",
        diplomaCount: 0,
        raw: {
          total: 3,
          signed: 1
        }
      }].filter(dept => dept.status === filterValue);

  const fadeInAnimation = {
    animation: "fadeIn 0.3s ease-in-out forwards",
    "@keyframes fadeIn": {
      from: { opacity: 0, transform: "translateY(-10px)" },
      to: { opacity: 1, transform: "translateY(0)" }
    }
  };

  const scrollableContainerStyle = {
    maxHeight: "300px",
    overflowY: "auto",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding: "5px",
    scrollbarWidth: "thin",
    scrollbarColor: "#d33139 #f1f1f1",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#d33139",
      borderRadius: "10px",
    },
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
      <Container 
        maxW="container.xl" 
        bg="white" 
        borderRadius="10px" 
        p={isMobile ? "20px" : "30px 70px"} 
        boxShadow="0 2px 10px rgba(0, 0, 0, 0.05)"
      >
        <Flex 
          direction={isMobile ? "column" : "row"} 
          justifyContent="space-between" 
          gap="50px"
          position="relative"
          _after={{
            content: '""',
            position: 'absolute',
            display: { base: 'none', md: 'block' },
            top: '10%',
            bottom: '10%',
            left: '50%',
            width: '1px',
            bg: '#e0e0e0'
          }}
        >
          {/* Left Card (Sign Incoming Diplomas) */}
          <Box {...cardStyles}>
            <Heading as="h2" fontSize="28px" color="#333" mb="2px">Send Diplomas</Heading>
            <Text fontSize="16px" color="#555" mb="20px">Send Diplomas to Signatories</Text>
            <Button onClick={handleSignClick} {...buttonStyles}>Send</Button>
            <Flex {...iconContainerStyles}>
              <Box as={FaRegFileAlt} fontSize={iconFontSize} color="#d33139" />
            </Flex>
          </Box>

          {/* Right Card (Signatures) */}
          <Box {...cardStyles}>
            <Heading as="h2" fontSize="28px" color="#333" mb="2px">Signatures</Heading>
            <Text fontSize="16px" color="#555" mb="20px">View Signed and Declined Diplomas</Text>
            <Button onClick={handleViewClick} {...buttonStyles}>View</Button>
            <Flex {...iconContainerStyles}>
              <Box as={FaRegFileExcel} fontSize={iconFontSize} color="#d33139" />
            </Flex>
          </Box>
        </Flex>
      </Container>

      {/* View Signed/Declined Diplomas */}
      {viewMode === 'view-signed' && (
        <Box width="100%" display="flex" flexDirection="column" gap="15px" sx={fadeInAnimation}>
          <Flex alignItems="center" mb="15px">
            <Menu isOpen={isOpen} onClose={onClose}>
              <MenuButton 
                as={Button} 
                rightIcon={<FaChevronDown />}
                bg="white" 
                border="1px solid #ddd" 
                borderRadius="20px" 
                p="8px 20px" 
                fontSize="14px"
                color="#333"
                onClick={onOpen}
              >
                {filterValue}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setFilterValue('All')}>All</MenuItem>
                <MenuItem onClick={() => setFilterValue('Signed')}>Signed</MenuItem>
                <MenuItem onClick={() => setFilterValue('Declined')}>Declined</MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          
          {/* pa design nlng olet malay like yung mga buttons and the text
          and yung filtering if ever nasa diplomaCount */}
          <Box sx={scrollableContainerStyle}>
            {filteredDepartments.map((dept, index) => (
                <Flex key={`${dept.department}-${dept.year}-${index}`} {...collegeCardStyles}>
                  <Box flex="1">
                    <Heading as="h2" fontSize="30px">{dept.department}, {dept.year}</Heading>
                    {dept.status === "Signed" && dept.diplomaCount && (
                      <Text color="#4cd516" fontWeight="medium" mt="5px">
                        {dept.diplomaCount} Diplomas signed
                      </Text>
                    )}
                  </Box>
                  {dept.status && (
                    <Flex>
                    <Text 
                      color={dept.status == "Declined" ? "red.500" : "green.500"} 
                      fontWeight="bold" 
                      mr={{ md: "20px" }} 
                      fontSize="18px"
                    >
                      Total Diplomas: {dept.raw.total}
                    </Text>
                    <Text marginright={-10}
                      color={dept.status == "Declined" ? "red.500" : "green.500"} 
                      fontWeight="bold" 
                      mr={{ md: "20px" }} 
                      fontSize="18px"
                    >
                       Diplomas Signed: {dept.raw.signed}
                    </Text>
                    </Flex>
                  )}
                  <Button 
                    onClick={() => handleViewDiplomas(dept.department, dept.year)}
                    {...collegeButtonStyles}
                  >
                    View
                  </Button>
                </Flex>
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default AdminDashboard;