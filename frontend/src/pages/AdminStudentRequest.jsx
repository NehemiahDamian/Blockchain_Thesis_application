import { useNavigate } from "react-router-dom";
import { Box, Heading, Button, Flex, Input,TableContainer, Table, Thead, 
  Tbody, Tr, Th, Td, Icon,HStack,Link,Text,Badge,useColorModeValue,Tooltip,
  Select, FormControl, FormLabel, InputGroup, InputLeftElement
} from '@chakra-ui/react';
import { FaSort, FaSortUp, FaSortDown, FaPrint, FaEye, FaFilter, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { useEffect, useState, useMemo, useCallback , useRef } from "react";
import { useAdminStore } from "../store/useAdminStore";
import html2pdf from 'html2pdf.js';
import { tr } from "framer-motion/client";

function AdminStudentRequest() {
  const { getAllRequest, allRequest, acceptRequest,RejectRequest } = useAdminStore();
  const [loadingStates, setLoadingStates] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'studentName', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isPrinting, setIsPrinting] = useState(false);
  const tableRef = useRef(null);

  // Date filtering states
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Theme colors
  const tableBg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Generate years and months
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear + i);
  }, []);
  const months = useMemo(() => [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' }
  ], []);

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

  // filter by date
  useEffect(() => {
    if (startMonth && endMonth && filterYear) {
      setIsFilterActive(true);
      setCurrentPage(1); // Reset to first page when filtering
    } else {
      setIsFilterActive(false);
    }
  }, [startMonth, endMonth, filterYear]);

  const clearDateFilter = useCallback(() => {
    setStartMonth('');
    setEndMonth('');
    setFilterYear('');
    setIsFilterActive(false);
  }, []);

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

    let filtered = sortedData;

    if (isFilterActive && startMonth !== '' && endMonth !== '' && filterYear !== '') {
      const startMonthNum = parseInt(startMonth);
      const endMonthNum = parseInt(endMonth);
      const yearNum = parseInt(filterYear);
      
      filtered = filtered.filter(request => {
        const requestDate = new Date(request.createdAt);
        const requestMonth = requestDate.getMonth();
        const requestYear = requestDate.getFullYear();
        
        // Handle ranges that span across years
        if (startMonthNum <= endMonthNum) {
          return requestYear === yearNum && 
                 requestMonth >= startMonthNum && 
                 requestMonth <= endMonthNum;
        } else {
          // Handle case like October to March (spans across years)
          return requestYear === yearNum &&
                 (requestMonth >= startMonthNum || requestMonth <= endMonthNum);
        }
      });
    }

    if (!searchTerm.trim()) return filtered;
    
    return filtered.filter(request => 
      (request.studentName && request.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.reason && request.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.status && request.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedData, searchTerm, isFilterActive, startMonth, endMonth, filterYear]);

 // Get current items for pagination
  const currentItems = useMemo(() => {
    if (!filteredData) return [];
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, filteredData]);  

  // Print function
  const handlePrint = useCallback(() => {
  if (!tableRef.current) return;
  
  setIsPrinting(true);
  
  // Create a clone of the table to modify for printing
  const printContent = document.createElement('div');

  let filterInfo = '';
    if (isFilterActive) {
      const startMonthName = months.find(m => m.value === startMonth)?.label || '';
      const endMonthName = months.find(m => m.value === endMonth)?.label || '';
      filterInfo = ` | ${startMonthName} to ${endMonthName}, ${filterYear}`;
  }

  printContent.innerHTML = `
    <div style="padding: 2px;">
      <div style="font-size: 10px; text-align: center; margin-bottom: 20px; color: #000000;">
         Diplomas Request | Generated on: ${new Date().toLocaleString()} ${searchTerm ? `| Search: "${searchTerm}"` : ''} ${filterInfo}
      </div>
      <div id="table-container"></div>
    </div>
  `;
  
  // Clone the table
  const tableClone = tableRef.current.cloneNode(true);
  
  const auditTable = document.createElement('table');
    auditTable.style.width = '100%';
    auditTable.style.borderCollapse = 'collapse';
    auditTable.style.fontSize = '12px';
    
    // Create header row
    const headerRow = document.createElement('tr');
    
    // Define columns for audit report
    const columns = [
      { label: 'Student Name', key: 0 },
      { label: 'Reason', key: 1 },
      { label: 'Request Date', key: 2 },
      { label: 'Status', key: 4 },
      { label: 'Document Status', key: 5 }
    ];
    
    // Create header cells
    columns.forEach(column => {
      const th = document.createElement('th');
      th.textContent = column.label;
      th.style.border = '1px solid #000';
      th.style.padding = '5px';
      th.style.backgroundColor = '#f0f0f0';
      th.style.textAlign = 'left';
      headerRow.appendChild(th);
    });
    
    auditTable.appendChild(headerRow);
    
    // Process each row in the original table
    const rows = tableClone.querySelectorAll('tbody tr');
    rows.forEach(originalRow => {
      const cells = originalRow.querySelectorAll('td');
      const newRow = document.createElement('tr');
      
      // Add specific cells in our desired order
      columns.forEach(column => {
        const td = document.createElement('td');
        
        if (column.key === 5) { // Document Status
          const hasPaymentReceipt = cells[3].textContent.includes('Payment Receipt');
          const hasAffidavit = cells[3].textContent.includes('Affidavit of Loss');
          
          if (hasPaymentReceipt && hasAffidavit) {
            td.textContent = 'All Documents Submitted';
          } else if (hasPaymentReceipt) {
            td.textContent = 'Payment Receipt Only';
          } else if (hasAffidavit) {
            td.textContent = 'Affidavit Only';
          } else {
            td.textContent = 'No Documents';
          }
        } else {
          // For date column, format it more compactly
          if (column.key === 2) {
            const dateText = cells[column.key].textContent;
            if (dateText) {
              try {
                const date = new Date(dateText);
                td.textContent = date.toLocaleDateString();
              } catch (e) {
                td.textContent = dateText;
              }
            }
          } else {
            td.textContent = cells[column.key].textContent.trim();
          }
        }
        
        td.style.border = '1px solid #000';
        td.style.padding = '5px';
        newRow.appendChild(td);
      });
      
      auditTable.appendChild(newRow);
    });
    
    // Append the audit table
    printContent.querySelector('#table-container').appendChild(auditTable);
    
    // Configure html2pdf options
    const opt = {
      margin: [5, 5, 5, 5], // smaller margins: top, right, bottom, left
      filename: `diploma_requests_audit_${new Date().toISOString().slice(0,10)}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      output: 'dataurlnewwindow'
    };
    
    // Generate PDF and open in new window first
    html2pdf().from(printContent).set(opt).toPdf().get('pdf').then((pdf) => {
      // Open PDF in new window
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      setIsPrinting(false);
    }).catch(err => {
      console.error("Error generating PDF:", err);
      setIsPrinting(false);
    });
  }, [searchTerm, isFilterActive, startMonth, endMonth, filterYear, months]);


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
      {/* Search */}
      <InputGroup maxW={{ base: "100%", md: "250px" }}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} color="gray.400" />
        </InputLeftElement>
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
      </InputGroup>

        {/*Date Filter */}
        <Flex 
          gap={2} 
          alignItems="center"
          justifyContent="center" 
          flexGrow={1}
        >
          <HStack spacing={2}>
            <Select 
              size="md" 
              value={startMonth} 
              onChange={(e) => setStartMonth(e.target.value)}
              placeholder="From Month"
              w={{ base: "100%", md: "150px" }}
              variant="filled"
              leftIcon={<FaCalendarAlt />}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </Select>
            
            <Select 
              size="md" 
              value={endMonth} 
              onChange={(e) => setEndMonth(e.target.value)}
              placeholder="To Month"
              w={{ base: "100%", md: "120px" }}
              variant="filled"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </Select>
            
            <Select 
              size="md" 
              value={filterYear} 
              onChange={(e) => setFilterYear(e.target.value)}
              placeholder="Year"
              w={{ base: "100%", md: "100px" }}
              variant="filled"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
            
            {isFilterActive && (
              <Button 
                size="md" 
                variant="outline" 
                colorScheme="red"
                onClick={clearDateFilter}
              >
                Clear
              </Button>
            )}
          </HStack>
        </Flex>

        <Button 
          leftIcon={<FaPrint />} 
          colorScheme="red" 
          size="md"
          boxShadow="sm"
          onClick={handlePrint}
          isLoading={isPrinting}
          loadingText="Generating PDF..."
        >
          Print Report
        </Button>
    </Flex>

    {/* Filter Status */}
      {isFilterActive && (
        <Box p={3} bg="red.50" borderRadius="md" borderLeft="4px solid" borderColor="red.500">
          <Text fontSize="sm" color="red.700">
            <strong>Filter active:</strong> Showing requests from {
              months.find(m => m.value === startMonth)?.label
            } to {
              months.find(m => m.value === endMonth)?.label
            }, {filterYear}
          </Text>
        </Box>
      )}
      
    {/* Table */}
    <TableContainer 
    ref={tableRef}
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
              <Text fontSize="xs" color="green.500" fontWeight="medium">ACCEPTED</Text>
            ) : request.status === 'rejected' ? (
              <Text fontSize="xs" color="red.500" fontWeight="medium">REJECTED</Text>
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