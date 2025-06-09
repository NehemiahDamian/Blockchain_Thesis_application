import { Box, Button, Flex, Grid, Heading, Text, useColorModeValue, Modal,
  ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalCloseButton,FormControl,FormLabel,
  Input,HStack,Icon,useDisclosure,GridItem,useToast} from '@chakra-ui/react';
import { useEffect, useState } from "react";
import { FaFolderOpen, FaPlus } from 'react-icons/fa';
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form states
  const [collegeName, setCollegeName] = useState('');
  const [collegeAbbreviation, setCollegeAbbreviation] = useState('');

  useEffect(() => {
    fetchDepartmentYears(); 
  }, [fetchDepartmentYears]);

  const handleViewYears = (department) => {
    const years = Object.keys(departmentsArr[department]);

    navigate(`/admin/FilteredArchive?department=${department}&years=${encodeURIComponent(JSON.stringify(years))}`);
  };

    const handleSubmit = (e) => {
    e.preventDefault();
    
    // include function here 

    // Show success toast
    toast({
      title: "College Added Successfully",
      description: `${collegeName} (${collegeAbbreviation}) has been added to the system.`,
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "top"
    });
    
    // Reset form and close modal
    setCollegeName('');
    setCollegeAbbreviation('');
    onClose();
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

        {/* Add College Button */}
       <Button
          leftIcon={<FaPlus />}
          onClick={onOpen}
          bg="rgb(255, 255, 255)"
          color="#8C0001"
          border="2px solid rgb(227, 72, 72)"
          _hover={{ 
            bg: "#8C0001",
            color: "white",
            border: "2px solid rgb(227, 72, 72)",
            transition: "bg 0.3s ease-in-out"
          }}
          size="lg"
          borderRadius="10px"
        >
          Add College
        </Button>
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
      {/* ADD COLLEGE MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent borderRadius="20px" maxW="600px">
          <ModalHeader display="flex" justifyContent="space-between" alignItems="center" borderBottomWidth="1px">
            <HStack>
              <Text color="#8b0e0e">Add New College</Text>
            </HStack>
            <ModalCloseButton position="static" />
          </ModalHeader>
          <ModalBody padding="30px">
            <form onSubmit={handleSubmit}>
              <Grid templateColumns="1fr" gap={5} mb={6}>
                {/* College Name */}
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" fontWeight="600" mb={2}>
                      College Name
                    </FormLabel>
                    <Input
                      placeholder="Enter full college name"
                      size="lg"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      borderRadius="10px"
                      border="2px solid #e2e8f0"
                      _focus={{
                        borderColor: "#8b0e0e",
                        boxShadow: "0 0 0 1px #8b0e0e"
                      }}
                    />
                  </FormControl>
                </GridItem>

                {/* College Abbreviation */}
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" fontWeight="600" mb={2}>
                      College Abbreviation
                    </FormLabel>
                    <Input
                      placeholder="Enter college abbreviation (e.g., COE, CBA)"
                      size="lg"
                      value={collegeAbbreviation}
                      onChange={(e) => setCollegeAbbreviation(e.target.value)}
                      borderRadius="10px"
                      border="2px solid #e2e8f0"
                      _focus={{
                        borderColor: "#8b0e0e",
                        boxShadow: "0 0 0 1px #8b0e0e"
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              <Flex justify="flex-end" gap={3} mt={6}>
                <Button 
                  onClick={onClose} 
                  background="#eee" 
                  color="#333"
                  _hover={{ bg: "#ddd" }}
                  size="lg"
                  borderRadius="10px"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  background="#8b0e0e"
                  color="white"
                  _hover={{ bg: "#6f0b0b" }}
                  size="lg"
                  borderRadius="10px"
                >
                  Add College
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Archives;
