import { useState, useEffect } from "react";
import {
  Input,
  Button,
  VStack,
  Box,
  Heading,
  Flex,
  Select,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  useDisclosure,
  IconButton,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Alert,
  AlertIcon,
  Icon
} from "@chakra-ui/react";
import { useAuthStore } from "../store/useAuthStore.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { useAdminStore } from "../store/useAdminStore.js";
import { randomBytes } from "ethers";

const AdminSignUpDean = () => {
  const [data, setData] = useState({
    fullName: "", 
    email: "",
    password: Math.random().toString(36).slice(-8), 
    department: "",
    role: "dean",
  });
  
const [activeStatuses, setActiveStatuses] = useState({});

  const { getAllDean, allDean, sendEmailCredentials, colleges, getAllColleges } = useAdminStore();
  // const [showPassword, setShowPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { signup } = useAuthStore();
  const [loadingDeans, setLoadingDeans] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeans = async () => {
      try {
        setLoadingDeans(true);
        const success = await getAllDean();
        if (!success) {
          setError("No deans found or failed to load");
        }
      } catch (err) {
        setError("Failed to fetch deans");
        console.error(err);
      } finally {
        setLoadingDeans(false);
      }
    };
    fetchDeans();
  }, [getAllDean]);

  

  // const handleTogglePassword = () => {
  //   setShowPassword(!showPassword);
  // };
  useEffect(() => {
    getAllColleges();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dean Data:", data);
    if (!data.fullName || !data.email  || !data.department) {
      alert("Please fill in all fields"); 
      return;
    } 
    else{
          signup(data);

    }
    await sendEmailCredentials(data.email, data.password);
    onOpen();
  };

    const handleCloseModal = () => {
    onClose();
    setData({
      fullName: "",
      email: "",
      password: "",
      department: "",
      role: "dean",
    });
  };
  
  const getBadgeColor = (department) => {
    if (department.includes("Technology")) return "red";
    if (department.includes("Business")) return "blue";
    if (department.includes("Arts")) return "purple";
    if (department.includes("Tourism")) return "orange";
    if (department.includes("Law")) return "gray";
    return "teal";
  };

  return (
    <Box display="flex" flexDirection="column" gap="20px" p="20px" h="100vh" overflow="auto" bg="gray.50">
      {/* Header */}
      <Box 
        bgGradient="linear(to-l, #be1010, #8C0001)" 
        color="white" 
        p="20px" 
        borderRadius="10px"
        boxShadow="md"
      >
        <Heading as="h1" fontSize="24px">Register a Dean</Heading>
      </Box>
      
      <Flex minH="calc(100vh - 100px)" align="center" justify="center" p={4}>
        <Box
          mb="auto" 
          ml="auto" 
          mr="auto"
          bg="white"
          p={8}
          rounded="xl"
          shadow="lg"
          w="full"
          maxW="2xl"
          overflow="hidden"
          borderWidth="1px"
          borderColor="gray.200"
        >
        
          <Heading size="md" mb={6} textAlign="center" color="#8C0001" fontWeight="bold">
            Dean Registration Form
          </Heading>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
              <Input
                type="text"
                value={data.fullName}
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
                placeholder="Full Name"
                size="lg"
                focusBorderColor="red.300"
              />
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="Email address"
                size="lg"
                focusBorderColor="red.300"
              />
              {/* <InputGroup size="lg">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  placeholder="Password"
                  size="lg"
                  focusBorderColor="red.300"
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    onClick={handleTogglePassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    variant="ghost"
                  />
                </InputRightElement>
              </InputGroup> */}
           <Select
            value={data.department}
            onChange={(e) => setData({ ...data, department: e.target.value })}
            size="lg"
            focusBorderColor="red.300"
          >
            <option value="" disabled hidden>Department</option>
            {colleges.map((college) => (
              <option key={college._id} value={college.collegeName}>
                {college.collegeName}
              </option>
            ))}
           </Select>
              <Button color="white" type="submit" colorScheme="red" size="md" width="full">
                Register
              </Button>
            </VStack>
          </form>

          <Box mt={10} width="100%" overflowX="auto">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color="gray.700">Registered Deans</Heading>
              <Badge colorScheme="red" fontSize="sm" py={1} px={3} borderRadius="md">
                {allDean?.length || 0} Total
              </Badge>
            </Flex>
            
            {loadingDeans ? (
              <Flex direction="column" align="center" justify="center" py={12} bg="gray.50" borderRadius="xl">
                <Spinner size="xl" color="red.500" thickness="3px" speed="0.65s" />
                <Text mt={4} fontWeight="medium" color="gray.600">Loading dean data...</Text>
              </Flex>
            ) : error ? (
              <Alert status="error" borderRadius="lg" mb={6} boxShadow="sm">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">Error loading deans</Text>
                  <Text fontSize="sm">{error}</Text>
                </Box>
              </Alert>
            ) : allDean && allDean.length > 0 ? (
              <Box
                width="100%"
                borderWidth="1px"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="lg"
                bg="white"
              >
                <TableContainer whiteSpace="normal">
                  <Table 
                    variant="simple"
                    size="md"
                    width="100%"
                    colorScheme="gray"
                  >
                    <Thead>
                      <Tr bg="#8C0001">
                        <Th color="white" px={4} py={4} width="8%" textAlign="center" borderBottom="2px solid #9e0000">#</Th>
                        <Th color="white" px={4} py={4} width="27%" borderBottom="2px solid #9e0000">Full Name</Th>
                        <Th color="white" px={4} py={4} width="35%" borderBottom="2px solid #9e0000">Email</Th>
                        <Th color="white" px={4} py={4} width="30%" borderBottom="2px solid #9e0000">Department</Th>
                        <Th color="white" px={4} py={4} width="30%" borderBottom="2px solid #9e0000">status</Th>

                      </Tr>
                    </Thead>
                    <Tbody fontSize="md">
                      {allDean.map((dean, index) => {
                             return (
                                <Tr
                                  key={`${dean.email}-${index}`}
                                  _hover={{ bg: "gray.50" }}
                                  transition="all 0.2s ease"
                                  borderBottomWidth={index === allDean.length - 1 ? "0" : "1px"}
                                >
                                  <Td px={4} py={4} textAlign="center" fontWeight="medium" color="gray.600">
                                    {index + 1}
                                  </Td>
                                  <Td px={4} py={4}>
                                    <Text fontWeight="medium" color="gray.800">{dean.fullName}</Text>
                                  </Td>
                                  <Td px={4} py={4}>
                                    <Text color="blue.600" fontWeight="normal">{dean.email}</Text>
                                  </Td>
                                  <Td px={4} py={4}>
                                    <Badge
                                      colorScheme={getBadgeColor(dean.department)}
                                      px={3}
                                      py={1.5}
                                      borderRadius="full"
                                      fontWeight="medium"
                                      fontSize="xs"
                                      textTransform="none"
                                      letterSpacing="tight"
                                      boxShadow="sm"
                                    >
                                      {dean.department}
                                    </Badge>
                                  </Td>
                                 <Td>
                                  <button
                                onClick={() =>
                                  setActiveStatuses((prev) => ({
                                    ...prev,
                                    [dean.email]: !(prev[dean.email] ?? true), 
                                  }))
                                }
                                  style={{
                                        backgroundColor: activeStatuses[dean.email] ?? true ? 'green' : 'red',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 20px',
                                        borderRadius: '999px',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      {activeStatuses[dean.email] ?? true ? 'Active' : 'Inactive'}
                                    </button>
                                  </Td>
                                </Tr>
                              );
                            })}

                    </Tbody>
                  </Table>
                </TableContainer>
                <Flex 
                  bg="gray.50" 
                  px={6} 
                  py={3} 
                  borderTopWidth="1px"
                  borderColor="gray.200"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text fontSize="sm" color="gray.500">
                    Last updated: {new Date().toLocaleDateString()}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Showing {allDean.length} {allDean.length === 1 ? 'dean' : 'deans'}
                  </Text>
                </Flex>
              </Box>
            ) : (
              <Box 
                textAlign="center" 
                py={12} 
                bg="gray.50" 
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.200"
                boxShadow="sm"
              >
                <Icon as={FiUsers} fontSize="4xl" color="gray.400" mb={4} />
                <Text fontSize="lg" fontWeight="medium" color="gray.600">No deans registered yet</Text>
                <Text mt={2} fontSize="sm" color="gray.500">
                  Register a new dean using the form above
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="lg" maxW="500px">
          <ModalHeader bg="green.500" color="white" borderTopRadius="lg">
            Registration Successful
          </ModalHeader>
          <ModalBody py={4}>
            <Text>You have successfully registered a new Dean account.</Text>
            <Text mt={2}>
              Full Name: <strong>{data.fullName}</strong>
            </Text>
            <Text>
              Email: <strong>{data.email}</strong>
            </Text>
            <Text>
              Department: <strong>{data.department}</strong>
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminSignUpDean;