/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { 
  Box, Button, Text, Input, Select, Flex, Heading,
  Grid, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useDisclosure, HStack, useToast,
  ButtonGroup, IconButton
} from "@chakra-ui/react";
import { FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DiplomaTemplate from "../components/DiplomaTemplate";


function AdminPage() {
  const { diplomas, checkDiplomas, sendSession, deanName, colleges, getAllColleges } = useAdminStore();
  const [studentDiploma, setStudentDiploma] = useState({
    department: "",
    year: "",
  });
  
  const [session, setSession] = useState({
    department: "",
    year: "",
    sessionName: "",
  });

  useEffect(() => {
      getAllColleges();
    }, []);
  
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const [entriesCount, setEntriesCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure();
  const toast = useToast(); // notifications

  // colleges for dropdowns
  // const colleges = [
  //     { value: "", label: "Select College" },
  //     // { value: "COT", label: "College of Technology" },
  //     // { value: "CAS", label: "College of Arts and Sciences" },
  //     // { value: "CBA", label: "College of Business Administration" },
  //     // { value: "CIR", label: "College of International Relations" },
  //     // { value: "CITHM", label: "College of International Tourism and Hospitality Management" },
  //     { value: "College of Technology", label: "College of Technology" },
  //     { value: "College of International Tourism and Hospitality Management", label: "College of International Tourism and Hospitality Management" },
  //     { value: "College of Arts and Sciences", label: "College of Arts and Sciences" },
  //     { value: "College of Business Administration", label: "College of Business Administration" },
  //     { value: "College of Law", label: "College of Law" },

  // ];

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    // added validation for searching diplomas
    if (!studentDiploma.department) {
      toast({
        title: "College required",
        description: "Please select a college before searching",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    await checkDiplomas(studentDiploma.department, studentDiploma.year);
    setIsSearchSubmitted(true);
    
    // Sync department & year with session state
    setSession({
      ...session,
      department: studentDiploma.department,
      year: studentDiploma.year,
    });
  };

  const handleCreateSession = async (e) => {
    if (!session.sessionName.trim()) {
      toast({
        title: "Session title required",
        description: "Please enter a session title before sending diplomas",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onConfirmOpen();
  };

  // dito ko nilipat yunug function for handleCreateSession
  const confirmSend = async () => {
    await sendSession(session);
    console.log("Session sent successfully", session);
    onConfirmClose();
    onSuccessOpen();
  };

  useEffect(() => {
    console.log("Diplomas updated:", diplomas);
  }, [diplomas]);

  // Filter students based on search
  const filteredDiplomas = diplomas.filter(student => 
    student.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.ceil(filteredDiplomas.length / entriesCount);
  const startIndex = (currentPage - 1) * entriesCount;
  const paginatedStudents = filteredDiplomas.slice(startIndex, startIndex + entriesCount);

  // Reset to page 1 when entries count or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesCount, searchTerm]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const generatePaginationNumbers = () => {
    let pages = [];
    
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // If more than 5 pages, use a sliding window
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show 2 pages before and 2 pages after current page
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const cardStyle = {
    bg: "white", 
    p: 5, 
    borderRadius: "md", 
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)"
  };
  return (
    <Box display="flex" p="20px" minH="100vh">
      <Box flex={1} p={0} position="relative">
      {/* Header */}
      <Box 
          bgGradient="linear(to-l, #be1010, #8C0001)" 
          color="white" 
          p="20px" 
          borderRadius="10px"
        >
          <Heading as="h1" fontSize="24px">Send Diplomas</Heading>
      </Box>

      {/* Session Title Input (Shows up after search) */}
      {isSearchSubmitted && diplomas.length > 0 && (
        <Box 
        mt={3} px={4} py={3} 
        bg="white" borderRadius="md" 
        boxShadow="0 2px 5px rgba(0,0,0,0.05)"
        >
          <Flex align="center" justify="space-between" wrap={{ base: "wrap", md: "nowrap" }} gap={3}>
            <Box flex="1">
              <Text fontWeight="medium" mb={1}>Session Title:</Text>
              <Input
                value={session.sessionName}
                placeholder="e.g., March 2025 Graduates"
                onChange={(e) => setSession({ ...session, sessionName: e.target.value })}
                size="md"
              />
            </Box>
          </Flex>
        </Box>
      )}


      {/* Content */}
      <Flex p={6} minH="calc(100vh - 140px)" direction={{ base: "column", md: "row" }} gap={6}>
        <Box w={{ base: "100%", md: "25%" }} h="fit-content">
          <Box {...cardStyle} mb={2}>
          <Heading size="md" mb={4}>Search Diplomas</Heading>
          <form onSubmit={handleSubmit}>
            <Text mb={2} fontWeight="medium">College:</Text>
              <Select 
                value={studentDiploma.department}
                onChange={(e) => setStudentDiploma({ ...studentDiploma, department: e.target.value })}
                mb={4}
                required
              >
                <option value="" disabled hidden>Department</option>
            {colleges.map((college) => (
              <option key={college._id} value={college.collegeName}>
                {college.collegeName}
              </option>
            ))}     
              </Select>
            {/*<input
              type="text"
              value={studentDiploma.department}
              placeholder="Department"
              onChange={(e) =>
                setStudentDiploma({ ...studentDiploma, department: e.target.value })
              }
              required
            />
            */}
            <Text mb={2} fontWeight="medium">Year:</Text>
              <Input
                type="text"
                value={studentDiploma.year}
                placeholder="20xx"
                onChange={(e) =>
                setStudentDiploma({ ...studentDiploma, year: e.target.value })
                }
                required
              />
              <Button type="submit"
              colorScheme="red"
              size="md"
              w="full"
              mt={2}
              >
                Search
              </Button>
          </form>
          </Box>
          {/* Send Diplomas Button (nilipat ko dito yung button for sending) */}
          {isSearchSubmitted && diplomas.length > 0 && (
            <Box {...cardStyle}>
              <Button 
              colorScheme="green"
              size="md"
              w="full"
              onClick={handleCreateSession}
              >
                Send Diplomas
              </Button>
            </Box>
          )}

          {/* { Session Creation Form }
          {isSearchSubmitted && (
            <form onSubmit={handleCreateSession}>
              <h2>Create Graduation Session</h2>
              <input
                type="text"
                value={session.sessionName}
                placeholder="Session Title (e.g., March 2025 Graduates)"
                onChange={(e) =>
                  setSession({ ...session, sessionName: e.target.value })
                }
                required
              />
              <input
                type="text"
                value={session.department}
                placeholder="Department"
                readOnly
              />
              <input
                type="text"
                value={session.year}
                placeholder="Year"
                readOnly
              />
              <button type="submit">Send to Dean</button>
            </form>
          )}
        */}

        </Box>
        {/* Right Panel (Diplomas) */}
        {isSearchSubmitted && (
          <Box 
          flex={1} 
          bg="white" 
          borderRadius="md" 
          boxShadow="0 2px 10px rgba(0, 0, 0, 0.07)"
          overflow="auto"
          maxH={{ base: "none", md: "calc(85vh - 140px)" }}
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
              <Heading size="md">Diplomas {studentDiploma.year}</Heading>
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
                      value={entriesCount}
                      onChange={(e) => setEntriesCount(Number(e.target.value))}
                      borderRadius="md"
                    >
                      {[5, 10, 25, 50, 100].map(value => (
                      <option key={value} value={value}>{value}</option>
                      ))}
                    </Select>
                      <Text fontSize="sm" ml={2}>entries</Text>
                  </Flex>
                </Flex>
              </Flex>
         {/* Pagination */}
        {filteredDiplomas.length > 0 && (
          <Flex justify="center" align="center" p={3} borderBottom="1px" borderColor="gray.200" bg="gray.50">
            <ButtonGroup isAttached variant="outline" size="sm">
                  <IconButton 
                    icon={<FaChevronLeft />} 
                    aria-label="Previous page" 
                    isDisabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                  
                  {generatePaginationNumbers().map(pageNum => (
                    <Button
                      key={pageNum}
                      colorScheme={currentPage === pageNum ? "red" : "gray"}
                      variant={currentPage === pageNum ? "solid" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  
                  <IconButton 
                    icon={<FaChevronRight />} 
                    aria-label="Next page" 
                    isDisabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </ButtonGroup>
                
                <Text ml={4} fontSize="sm" color="gray.600">
                  Page {currentPage} of {Math.max(1, totalPages)} 
                  {" "}({filteredDiplomas.length} total results)
                </Text>
              </Flex>
            )}
          {/* Diplomas List */}
       {diplomas.length > 0 ? (
              <Grid templateColumns={{ base: "repeat(1, 1fr)" }} gap={6} p={6}>
                {paginatedStudents.map((student) => (
                  <Box
                    key={student._id}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    overflow="hidden"
                    transition="transform 0.2s"
                    _hover={{ transform: "scale(1.02)" }}
                  >
                    <DiplomaTemplate
                      studentName={student.fullName}
                      studentId={student.idNumber || student.uniqueToken}
                      department={student.program || student.department}
                      graduationYear={student.expectedYearToGraduate || student.year}
                      gwa={student.GWA}
                      uniqueToken={student.uniqueToken}
                      deanName={deanName}
                    />
                  </Box>
                ))}
              </Grid>
            ) : (
              <Text p={6} color="gray.500" textAlign="center">
                No diplomas found for the selected criteria.
              </Text>
            )}

        {filteredDiplomas.length > entriesCount && (
            <Flex justify="center" align="center" p={3} borderTop="1px" borderColor="gray.200" bg="gray.50">
              <ButtonGroup isAttached variant="outline" size="sm">
                <IconButton 
                  icon={<FaChevronLeft />} 
                  aria-label="Previous page" 
                  isDisabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                
                {generatePaginationNumbers().map(pageNum => (
                  <Button
                    key={pageNum}
                    colorScheme={currentPage === pageNum ? "red" : "gray"}
                    variant={currentPage === pageNum ? "solid" : "outline"}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ))}
                
                <IconButton 
                  icon={<FaChevronRight />} 
                  aria-label="Next page" 
                  isDisabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </ButtonGroup>
            </Flex>
          )}          
        </Box>
        )}
        </Flex>
      </Box>
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px)" />
        <ModalContent p={5}>
          <ModalHeader textAlign="center">
            <Text fontSize="xl" fontWeight="bold">
              Send Diplomas to Dean
            </Text>
          </ModalHeader>
          <ModalBody>
            <Text mb={4}>
              Are you sure you want to send {filteredDiplomas.length} diplomas from {studentDiploma.department} ({studentDiploma.year}) to the Dean for processing?
            </Text>
            <Text fontWeight="medium" mb={4}>
              Session Title: {session.sessionName}
            </Text>
            
            <HStack spacing={4} justify="center" mt={6} mb={4}>
              <Button 
                colorScheme="green" 
                onClick={confirmSend} 
                size="lg" 
                w="120px"
                borderRadius="full"
                boxShadow="0 2px 5px rgba(0,0,0,0.1)"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
                }}
              >
                Yes, Send
              </Button>
              <Button 
                variant="outline" 
                onClick={onConfirmClose}
                size="lg" 
                w="120px"
                borderRadius="full"
                bg="gray.100"
                color="gray.600"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
                }}
              >
                Cancel
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={isSuccessOpen} onClose={onSuccessClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px)" />
        <ModalContent p={5}>
          <ModalCloseButton 
            w="30px"
            h="30px"
            borderRadius="full"
            bg="gray.100"
            _hover={{ bg: "red.500", color: "white" }}
          />
          <ModalBody textAlign="center" py={8}>
            <Heading size="lg" mb={4}>Diplomas Sent Successfully</Heading>
            <Text fontSize="md" color="gray.600">
              The {session.sessionName} diplomas have been sent to the Dean for processing.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AdminPage;