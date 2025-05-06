import { useNavigate } from "react-router-dom";
import { Box, Heading, Button, Flex, Input,TableContainer, Table, Thead, 
  Tbody, Tr, Th, Td, Icon,HStack,Link,Text,Badge,useColorModeValue,Tooltip
} from '@chakra-ui/react';
import { FaSort, FaSortUp, FaSortDown, FaPrint, FaEye } from 'react-icons/fa';
import { useEffect, useState, useMemo, useCallback  } from "react";
import { useAdminStore } from "../store/useAdminStore";

function AdminStudentRequest() {
  const { getAllRequest, allRequest, acceptRequest,RejectRequest } = useAdminStore();
  const [loadingStates, setLoadingStates] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'studentName', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Theme colors
  const tableBg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllRequest();
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchData();
  }, [getAllRequest]);

  // Filtering
  const requestSort = useCallback((key) => {
    setSortConfig(prevConfig => {
      let direction = 'ascending';
      if (prevConfig.key === key) {
        direction = prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
      }
      return { key, direction };
    });
  }, []);
  // Sort data 
  const sortedData = useMemo(() => {
    if (!allRequest) return [];
    
    const sortableData = [...allRequest];
    sortableData.sort((a, b) => {
      // Handle different data types
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (sortConfig.key === 'createdAt') {
        return sortConfig.direction === 'ascending' 
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableData;
  }, [allRequest, sortConfig]);
  // Sort Icon
  const getSortIcon = useCallback((columnName) => {
    if (sortConfig.key !== columnName) return <Icon as={FaSort} ml={1} opacity={0.3} />;
    if (sortConfig.direction === 'ascending') return <Icon as={FaSortUp} ml={1} color="red.500" />;
    return <Icon as={FaSortDown} ml={1} color="red.500" />;
  }, [sortConfig]);

   // Handle searches
  const handleSearch = useCallback((event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []); 
  const filteredData = useMemo(() => {
    if (!sortedData) return [];
    if (!searchTerm.trim()) return sortedData;
    
    return sortedData.filter(request => 
      (request.studentName && request.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.reason && request.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.status && request.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedData, searchTerm]);

 // Get current items for pagination
  const currentItems = useMemo(() => {
    if (!filteredData) return [];
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, filteredData]);  

  const handleAccept = async (requestId) => {
    const reasonforAction = "Diploma Approved, Please show this to the registrar as a confirmation"; // You can also use window.prompt for user input
    if (!reasonforAction) return; // If user cancels or enters empty reason
    
    setLoadingStates(prev => ({ ...prev, [requestId]: 'accepting' }));
    try {
      await acceptRequest(requestId, reasonforAction); // Assuming acceptRequest is modified to accept reason
      await getAllRequest();
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [requestId]: undefined }));
    }
  };

  const handleReject = async (requestId) => {
    const reasonforAction = window.prompt("Please enter the reason for rejecting:");
    if (!reasonforAction) return; // If user cancels or enters empty reason
    
    setLoadingStates(prev => ({ ...prev, [requestId]: 'rejecting' }));
    try {
      await RejectRequest(requestId, reasonforAction); // Assuming RejectRequest is modified to accept reason
      await getAllRequest();
    } catch (error) {
      console.error("Error rejecting request:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [requestId]: undefined }));
    }
  };

  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.ceil((filteredData?.length || 0) / itemsPerPage),
    [filteredData, itemsPerPage]
  );
  // Pagination
  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);
  // Render page numbers
  const renderPageNumbers = useCallback(() => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // Add first page if not included
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      // Add visible pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add last page if not included
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers.map((page, index) => {
      if (page === '...') {
        return (
          <Text key={`ellipsis-${index}`} px={2}>...</Text>
        );
      }
      return (
        <Button 
          key={page} 
          size="sm"
          colorScheme={currentPage === page ? "red" : "gray"}
          variant={currentPage === page ? "solid" : "outline"}
          onClick={() => paginate(page)}
        >
          {page}
        </Button>
      );
    });
  }, [currentPage, paginate, totalPages]);

  if (!allRequest) {
    return (
      <Box p={10} textAlign="center">
        <Text fontSize="lg">Loading requests...</Text>
      </Box>
    )
  }

  if (allRequest.length === 0) {
    return (
      <Box p={10} textAlign="center">
        <Text fontSize="lg">No diploma requests found</Text>
      </Box>
    )
  }

  return (
    <Box display="flex" flexDirection="column" gap="20px" p="20px" bg="#f7faff" minH="95vh" overflow="auto">
    {/* Header */}
    <Box 
    bgGradient="linear(to-l, #be1010, #8C0001)" 
    color="white" 
    p="20px" 
    borderRadius="10px"
    boxShadow="md"
    >
      <Heading as="h1" fontSize="24px">Diploma Requests</Heading>
    </Box>
    {/* Search & Print */}
    <Flex 
    justifyContent="space-between" 
    mb={4} 
    alignItems="center"
    flexDir={{ base: "column", md: "row" }}
    gap={3}
    >
      <Input
      placeholder="Search by name, reason or status..."
      value={searchTerm}
      onChange={handleSearch}
      maxW={{ base: "100%", md: "300px" }}
      fontSize="sm"
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      />
        <Button 
          leftIcon={<FaPrint />} 
          colorScheme="red" 
          size="md"
          boxShadow="sm"
        >
          Print Report
        </Button>
    </Flex>
    {/* Table */}
    <TableContainer 
    bg={tableBg} 
    borderRadius="lg" 
    boxShadow="md" 
    borderWidth="1px"
    borderColor={borderColor}
    overflowX="auto"
    >
    <Table variant="simple" colorScheme="red" size={{ base: "sm", md: "md" }}>
      <Thead bg={headerBg}>
        <Tr>
            <Th 
            fontSize={{ base: "xs", md: "sm" }} 
            onClick={() => requestSort('studentName')} 
            cursor="pointer"
            py={4}
            whiteSpace="normal"
            minW="150px"
            >
              <Flex alignItems="center">
                Full Name {getSortIcon('studentName')}
              </Flex>
            </Th>
            <Th 
            fontSize={{ base: "xs", md: "sm" }} 
            onClick={() => requestSort('reason')} 
            cursor="pointer"
            py={4}
            whiteSpace="normal"
            minW="180px"
            >
              <Flex alignItems="center">
                Reason {getSortIcon('reason')}
              </Flex>
            </Th>
            <Th 
            fontSize={{ base: "xs", md: "sm" }} 
            onClick={() => requestSort('createdAt')} 
            cursor="pointer"
            py={4}
            whiteSpace="normal"
            minW="150px"
            >
              <Flex alignItems="center">
                Requested At {getSortIcon('createdAt')}
              </Flex>
            </Th>
            <Th 
            fontSize={{ base: "xs", md: "sm" }} 
            py={4}
            whiteSpace="normal"
            minW="150px"
            >
              <Flex alignItems="center">
                Documents
              </Flex>
            </Th>
            <Th 
            fontSize={{ base: "xs", md: "sm" }} 
            onClick={() => requestSort('status')} 
            cursor="pointer"
            py={4}
            whiteSpace="normal"
            minW="120px"
            >
              <Flex alignItems="center">
                Status {getSortIcon('status')}
              </Flex>
            </Th>
            <Th 
            fontSize={{ base: "xs", md: "sm" }} 
            py={4}
            whiteSpace="normal"
            minW="150px"
            textAlign="center"
            >
              <Flex alignItems="center" justifyContent="center">
                Actions
              </Flex>
            </Th>
          </Tr>
      </Thead>
      <Tbody>
      {currentItems.map((request, index) => (
        <Tr 
          key={request._id} 
          _hover={{ bg: hoverBg }}
          transition="all 0.2s"
          borderBottomWidth={index === currentItems.length - 1 ? 0 : "1px"}
          borderColor={borderColor}
        >
          <Td fontSize={{ base: "xs", md: "sm" }} py={3} whiteSpace="normal">{request.studentName}</Td>
          <Td fontSize={{ base: "xs", md: "sm" }} py={3} whiteSpace="normal"> {request.reason}</Td>
          <Td fontSize={{ base: "xs", md: "sm" }} py={3} whiteSpace="normal">{new Date(request.createdAt).toLocaleString()}</Td>
          <Td fontSize={{ base: "xs", md: "sm" }} py={3} whiteSpace="normal">
            <HStack spacing={2}>
              {request.paymentReceipt && (
                <Link 
                href={request.paymentReceipt}                         
                isExternal 
                _hover={{ textDecoration: 'none' }}
                >
                  <Button size="xs" colorScheme="blue" variant="outline">Payment Receipt</Button>
                </Link>
              )}
              {request.affidavitOfLoss && (
                <Link 
                href={request.affidavitOfLoss} 
                isExternal
                _hover={{ textDecoration: 'none' }}
                >
                  <Button size="xs" colorScheme="blue" variant="outline">Affidavit of Loss</Button>
                </Link>
              )}
            </HStack>
          </Td>
          <Td fontSize={{ base: "xs", md: "sm" }} py={3} whiteSpace="normal">
            <Badge 
              colorScheme={ 
                request.status === 'accepted' ? 'green' :
                request.status === 'rejected' ? 'red' : 'yellow'
              }
              px={2}
              py={1}
              borderRadius="full"
            >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </Td>
          <Td py={3} textAlign="center">
            {request.status === 'accepted' ? (
              <Text fontSize="xs" color="green.500" fontWeight="medium">Accepted na</Text>
            ) : request.status === 'rejected' ? (
              <Text fontSize="xs" color="red.500" fontWeight="medium">Rejected na</Text>
            ) : (
            <HStack spacing={2} justifyContent="center">
              <Button
              size="xs"
              colorScheme="green"       
              onClick={() => handleAccept(request._id)}
              isDisabled={loadingStates[request._id]}
              opacity={loadingStates[request._id] ? 0.6 : 1}
              >
                {loadingStates[request._id] === 'accepting' ? 'Accepting...' : 'Accept'}
              </Button>
              <Button
              size="xs"
              colorScheme="green"
              onClick={() => handleReject(request._id)}
              isDisabled={loadingStates[request._id]}
              opacity={loadingStates[request._id] ? 0.6 : 1}
              >
                {loadingStates[request._id] === 'rejecting' ? 'Rejecting...' : 'Reject'}
              </Button>
                </HStack>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      </TableContainer>
      {/* No results message */}
      {currentItems.length === 0 && (
        <Box 
          textAlign="center" 
          p={6} 
          bg="white" 
          borderRadius="md" 
          boxShadow="sm"
        >
          <Text fontSize="md" color="gray.600">No diploma requests found matching your search criteria.</Text>
        </Box>
      )}

      {/* Enhanced Pagination */}
      {totalPages > 0 && (
        <Flex justifyContent="end" mt={4} flexWrap="wrap">
          <HStack spacing={2}>
            <Button 
              size="sm" 
              onClick={() => paginate(currentPage - 1)} 
              isDisabled={currentPage === 1}
              colorScheme="red"
              variant="outline"
            >
              Previous
            </Button>
            
            {renderPageNumbers()}
            
            <Button 
              size="sm" 
              onClick={() => paginate(currentPage + 1)} 
              isDisabled={currentPage === totalPages}
              colorScheme="red"
              variant="outline"
            >
              Next
            </Button>
          </HStack>
        </Flex>
      )}
    </Box>
  );
}

export default AdminStudentRequest;