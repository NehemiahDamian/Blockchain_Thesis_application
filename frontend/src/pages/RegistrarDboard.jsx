import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistrarStore } from "../store/useRegistrarStore";
import { 
  Box, Heading, Text, Button, Flex, Menu, MenuButton, MenuList, MenuItem, 
  Container, useDisclosure, useBreakpointValue 
} from '@chakra-ui/react';
import { FaRegFileAlt, FaRegFileExcel, FaChevronDown } from 'react-icons/fa';


function RegistrarDboard() {
  const navigate = useNavigate();
  const { departmentYears, fetchDepartmentYears, fetchStudentDetails } = useRegistrarStore();

  // for the buttons
  const [viewMode, setViewMode] = useState(null); // null, 'sign', 'view-signed'
  const [filterValue, setFilterValue] = useState('All');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const iconSize = useBreakpointValue({ base: '0em', xl: '130px', lg: '100px', md: '0px', sm: '0px' });
  const iconFontSize = useBreakpointValue({ base: '30px', xl: '65px', lg: '55px', md: '45px' });

  const handleSignClick = () => {
    setViewMode(viewMode === 'sign' ? null : 'sign');
  };

  const handleViewClick = () => {
    setViewMode(viewMode === 'view-signed' ? null : 'view-signed');
  };

  // Fetch department-year pairs on component mount
  useEffect(() => {
    fetchDepartmentYears();
  }, [fetchDepartmentYears]);

  const handleViewDiplomas = async (department, year) => {
    try {
      await fetchStudentDetails(department, year);
      navigate(`/registrar/view-diplomas?department=${department}&year=${year}`);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

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

  // College data for rendering (Eto yung mock data for View Signed or Declined)
  const collegeContainers = [
    { name: "COT", year: "2026-2027", status: "Signed", diplomaCount: "18/20" },
    { name: "COT", year: "2025-2026", status: "Declined" },
    { name: "CITHM", year: "2025-2026", status: "Declined" }
  ];

  // Animation styles
  const fadeInAnimation = {
    animation: "fadeIn 0.3s ease-in-out forwards",
    "@keyframes fadeIn": {
      from: { opacity: 0, transform: "translateY(-10px)" },
      to: { opacity: 1, transform: "translateY(0)" }
    }
  };

  // Scrollable container style
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
        <Heading as="h1" fontSize="24px">Welcome, Ms. Devy!</Heading>
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
            <Heading as="h2" fontSize="28px" color="#333" mb="2px">Incoming Diplomas</Heading>
            <Text fontSize="16px" color="#555" mb="20px">Sign Incoming Diplomas</Text>
            <Button onClick={handleSignClick} {...buttonStyles}>Sign</Button>
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

      {/* Send Diplomas - Department/Year List */}
      {viewMode === 'sign' && (
        <Box width="100%" display="flex" flexDirection="column" gap="15px" sx={fadeInAnimation}>
          <Box sx={scrollableContainerStyle}>
            {/* Dito ko nalagay previous codes mo */}
            {departmentYears.map(({ department, year }, index) => (
              <Flex 
                key={`${department}-${year}-${index}`}
                {...collegeCardStyles}
              >
                <Box flex="1">
                  <Heading as="h2" fontSize="30px">{department}, {year}</Heading>
                </Box>
                  {department.status && (
                    <Flex>
                    <Text 
                      color={department.status == "Declined" ? "red.500" : "green.500"} 
                      fontWeight="bold" 
                      mr={{ md: "20px" }} 
                      fontSize="18px"
                    >
                      Total Diplomas:
                    </Text>
                    <Text 
                      color={department.status == "Signed" ? "red.500" : "green.500"} 
                      fontWeight="bold" 
                      mr={{ md: "20px" }} 
                      fontSize="18px"
                    >
                      {department.status} Diplomas Signed
                    </Text>
                    </Flex>
                  )}
                <Button 
                  onClick={() => handleViewDiplomas(department, year)}
                  {...collegeButtonStyles}
                >
                  View
                </Button>
              </Flex>
            ))}
          </Box>
        </Box>
      )}
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



        {/* dito lalagay malay yung prang map ng mga may status na signed 5/5 */}
              {/* {departmentYears.map((departmentYear) => (
        <div key={`${departmentYear.department}-${departmentYear.year}`}>
          Department: {departmentYear.department}, Year: {departmentYear.year} status: {departmentYear.status}
          {console.log(departmentYear)}
          <button></button>
        </div>
      ))} */}
          <Box sx={scrollableContainerStyle}>
            {collegeContainers
              .filter(college => filterValue === 'All' || college.status === filterValue)
              .map((college, index) => (
                <Flex key={index} {...collegeCardStyles}>
                  <Box flex="1">
                    <Heading as="h2" fontSize="30px">{college.name}, {college.year}</Heading>
                    {college.status === "Signed" && college.diplomaCount && (
                      <Text color="#4cd516" fontWeight="medium" mt="5px">
                        {college.diplomaCount} Diplomas signed
                      </Text>
                    )}
                  </Box>
                  {college.status && (
                    <Text 
                      color={college.status === "Signed" ? "#4cd516" : "#d5162f"} 
                      fontWeight="bold" 
                      mr={{ md: "20px" }} 
                      fontSize="18px"
                    >
                      {college.status}
                    </Text>
                  )}
                  <Button 
                    onClick={() => navigate(`/registrar/${college.status.toLowerCase()}-diplomas?department=${college.name}&year=${college.year}`)}
                    {...collegeButtonStyles}
                  >
                    View
                  </Button>
                </Flex>
              ))}
            {/* <div className="space-y-2">
                {departmentYears.map(({ department, year }, index) => (
                  <div 
                    key={`${department}-${year}-${index}`}
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <span className="font-medium">{department}</span>
                    <span className="mx-2">-</span>
                    <span>{year}</span>
                    <button
                      onClick={() => handleViewDiplomas(department, year)}
                      className="ml-auto bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            */}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default RegistrarDboard;