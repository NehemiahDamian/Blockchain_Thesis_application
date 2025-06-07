/* eslint-disable no-unused-vars */
import { 
  Box, Heading, Button, Flex, Input, TableContainer, Table, Thead, 
  Tbody, Tr, Th, Td, Icon, HStack, Link, Text, Badge, 
  useColorModeValue, Select, FormControl, FormLabel
} from '@chakra-ui/react';
import { FaSort, FaSortUp, FaSortDown, FaPrint, FaFolderOpen } from 'react-icons/fa';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminStore } from '../store/useAdminStore.js';
import html2pdf from 'html2pdf.js';

const scrollableContainerStyle = {
  maxHeight: "500px",
  overflowY: "auto",
  padding: "16px",
  background: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

const collegeCardStyles = {
  alignItems: "center",
  justifyContent: "space-between",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  padding: "20px",
  marginBottom: "16px"
};

const collegeButtonStyles = {
  colorScheme: "teal",
  variant: "solid",
  size: "md",
  ml: "16px"
};

function ArchiveBydepartment() {
  const{allStudent, getAllstudentsArchiveByDepartment, fetchDepartmentYears, departmentYears} = useAdminStore()
  const location = useLocation();
  const navigate = useNavigate();

  // states
  const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isPrinting, setIsPrinting] = useState(false);
  const tableRef = useRef(null);
  
  // data for dropdowns 
  const colleges = ['COT', 'CBA', 'CAS', 'CIR', 'CITHM'];
  const [years, setYears] = useState(['2020', '2021', '2022', '2023', '2024', '2025']);

  // Extract the query parameters
  const searchParams = new URLSearchParams(location.search);
 // const department = searchParams.get("department");
 // const year = searchParams.get("year");
  const [selectedCollege, setSelectedCollege] = useState(searchParams.get("college") || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || '');

  // Theme colors
  const tableBg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // fetch
  useEffect(() => {
    fetchDepartmentYears();
  }, [fetchDepartmentYears]);

 // Extract unique years from departmentYears
  useEffect(() => {
    if (departmentYears && departmentYears.length > 0) {
      const uniqueYears = [...new Set(departmentYears.map(item => item.year))];
      setYears(uniqueYears);
    }
  }, [departmentYears]);

  // Call the API only if department and year are present
  useEffect(() => {
    if (selectedCollege && selectedYear) {
      getAllstudentsArchiveByDepartment(selectedCollege, selectedYear); //changed the department and year to selectedCollege and selectedYear (paras sa dropdown)

      const params = new URLSearchParams();
      params.set('college', selectedCollege);
      params.set('year', selectedYear);
      navigate(`?${params.toString()}`);
    }
  }, [selectedCollege, selectedYear, getAllstudentsArchiveByDepartment, navigate]);

  // filtering
 const requestSort = useCallback((key) => {
    setSortConfig(prevConfig => {
      let direction = 'ascending';
      if (prevConfig.key === key) {
        direction = prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
      }
      return { key, direction };
    });
  }, []);
  // icon
  const getSortIcon = useCallback((columnName) => {
    if (sortConfig.key !== columnName) return <Icon as={FaSort} ml={1} opacity={0.3} />;
    if (sortConfig.direction === 'ascending') return <Icon as={FaSortUp} ml={1} color="red.500" />;
    return <Icon as={FaSortDown} ml={1} color="red.500" />;
  }, [sortConfig]);
  // sorting data 
  const sortedData = useMemo(() => {
    if (!allStudent) return [];
    
    const sortableData = [...allStudent];
    sortableData.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (sortConfig.key === 'expectedYearToGraduate') {
        return sortConfig.direction === 'ascending' 
          ? aValue - bValue
          : bValue - aValue;
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
  }, [allStudent, sortConfig]);

  // search function
  const handleSearch = useCallback((event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);
  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!sortedData) return [];
    if (!searchTerm.trim()) return sortedData;
    
    return sortedData.filter(student => 
      (student.fullName && student.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.department && student.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.program && student.program.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.uniqueToken && student.uniqueToken.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedData, searchTerm]);

  // Pagination 
  const currentItems = useMemo(() => {
    if (!filteredData) return [];
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, filteredData]);  

  // Calculate total pages for pagination
  const totalPages = useMemo(() => 
    Math.ceil((filteredData?.length || 0) / itemsPerPage),
    [filteredData, itemsPerPage]
  );

 // Print function
  const handlePrint = useCallback(() => {
    if (!tableRef.current) return;
    
    setIsPrinting(true);
    
    // Create a clone of the table to modify for printing
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <div style="padding: 2px;">
        <div style="font-size: 14px; text-align: center; margin-bottom: 20px; color: #000000;">
          <h2 style="margin-bottom: 3px; font-size: 15px;">Diploma Archives Report</h2>
          <p style="margin: 0; font-size: 14px;">${selectedCollege || ''} - ${selectedYear || 'All Years'} | Generated on: ${new Date().toLocaleString()} ${searchTerm ? `| Filtered by: "${searchTerm}"` : ''}</p>
        </div>
        <div id="table-container"></div>
      </div>
    `;
    
    // Create the archive table
    const archiveTable = document.createElement('table');
    archiveTable.style.width = '800px';
    archiveTable.style.height = '475px';
    archiveTable.style.borderCollapse = 'collapse';
    archiveTable.style.fontSize = '12px';
    
    // Create header row
    const headerRow = document.createElement('tr');
    
    // Define columns for archive report
    const columns = [
      { label: 'Full Name', key: 'fullName' },
      { label: 'Department', key: 'department' },
      { label: 'Program', key: 'program' },
      { label: 'Token', key: 'uniqueToken' },
      { label: 'Year Graduated', key: 'expectedYearToGraduate' }
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
    
    archiveTable.appendChild(headerRow);
    
    // Add data rows
    filteredData.forEach(student => {
      const row = document.createElement('tr');
      
      columns.forEach(column => {
        const td = document.createElement('td');
        td.textContent = student[column.key] || '';
        td.style.border = '1px solid #000';
        td.style.padding = '5px';
        row.appendChild(td);
      });
      
      archiveTable.appendChild(row);
    });
    
    // Append the archive table
    printContent.querySelector('#table-container').appendChild(archiveTable);
    
    // Configure html2pdf options
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `diploma_archives_${selectedCollege || 'all'}_${selectedYear || 'all'}_${new Date().toISOString().slice(0,10)}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      output: 'dataurlnewwindow'
    };
    
    // Generate PDF and open in new window
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
  }, [filteredData, selectedCollege, selectedYear, searchTerm]);

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

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
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
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

  // dropdowns
  const handleCollegeChange = (e) => {
    setSelectedCollege(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  if (!allStudent) {
    return (
      <Box p={10} textAlign="center">
        <Text fontSize="lg">Loading archives...</Text>
      </Box>
    )
  }

  return (
    <Box display="flex" flexDirection="column" gap="20px" p="20px" bg="#f7faff" minH="95vh" overflow="auto">
      {/* Header */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={8}
        bgGradient="linear(to-l, #be1010, #8C0001)"
        boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
        borderRadius="10px"
        color="white"
      >
        <Flex alignItems="center">
          <Box mr={3} color="#f0f0f0">
            <FaFolderOpen size={40} />
          </Box>
          <Box>
            <Heading fontSize={{ base: "22px", md: "28px" }} color="#eaeaea">Diploma Archives</Heading>
            <Text color="#e3e3e3">
              {selectedCollege && selectedYear ? 
                `${selectedCollege} - ${selectedYear}` : 
                "Select college and year"}
            </Text>
          </Box>
        </Flex>
      </Flex>
           {/* Filters, Search & Print */}
      <Flex 
        justifyContent="space-between" 
        mb={4} 
        alignItems="center"
        flexDir={{ base: "column", md: "row" }}
        gap={3}
        mt={4}
      >
        <HStack spacing={3} width={{ base: "100%", md: "auto" }} wrap={{ base: "wrap", md: "nowrap" }}>
          {/* <Select
            value={selectedCollege}
            onChange={handleCollegeChange}
            placeholder="Select College"
            bg="white"
            maxW={{ base: "full", md: "150px" }}
            fontSize="sm"
            boxShadow="sm"
          >
            {colleges.map(college => (
              <option key={college} value={college}>{college}</option>
            ))}
          </Select> */}
{/*           
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            placeholder="Select Year"
            bg="white"
            maxW={{ base: "full", md: "130px" }}
            fontSize="sm"
            boxShadow="sm"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select> */}
          
          <Input
            placeholder="Search by name, program, token..."
            value={searchTerm}
            onChange={handleSearch}
            maxW={{ base: "100%", md: "300px", }}
            fontSize="sm"
            bg="white"
            borderRadius="md"
            boxShadow="sm"
          />
        </HStack>
        
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
            <Th fontSize={{ base: "xs", md: "sm" }} onClick={() => requestSort('fullName')} 
            cursor="pointer" py={4} whiteSpace="normal"> <Flex alignItems="center">Full Name {getSortIcon('fullName')}</Flex></Th>

            <Th fontSize={{ base: "xs", md: "sm" }} onClick={() => requestSort('department')} 
            cursor="pointer" py={4} whiteSpace="normal"> <Flex alignItems="center">Department {getSortIcon('department')}</Flex></Th>

            <Th fontSize={{ base: "xs", md: "sm" }} onClick={() => requestSort('program')} 
            cursor="pointer" py={4} whiteSpace="normal"> <Flex alignItems="center">Program {getSortIcon('program')}</Flex></Th>

            <Th fontSize={{ base: "xs", md: "sm" }} py={4} whiteSpace="normal">Diploma</Th>

            <Th fontSize={{ base: "xs", md: "sm" }} onClick={() => requestSort('uniqueToken')} 
            cursor="pointer" py={4} whiteSpace="normal"> <Flex alignItems="center">Token {getSortIcon('uniqueToken')}</Flex></Th>

            <Th fontSize={{ base: "xs", md: "sm" }} onClick={() => requestSort('expectedYearToGraduate')} 
            cursor="pointer" py={4} whiteSpace="normal"> <Flex alignItems="center">Year Graduated {getSortIcon('expectedYearToGraduate')}</Flex></Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentItems.map((student, index) => ( // changed the dept to student
            <Tr key={`${student.fullName}${index}`} _hover={{ bg: hoverBg }} transition="all 0.2s"
            borderBottomWidth={index === currentItems.length - 1 ? 0 : "1px"} borderColor={borderColor}>
              <Td fontSize={{ base: "xs", md: "sm" }} py={3} whiteSpace="normal">{student.fullName}</Td>
              <Td fontSize={{ base: "xs", md: "sm" }} py={3} whiteSpace="normal">{student.department}</Td>
              <Td fontSize={{ base: "xs", md: "sm" }} py={3} whiteSpace="normal">{student.program}</Td>
              <Td fontSize={{ base: "xs", md: "sm" }} py={3} whiteSpace="normal">
                  <Link 
                    href={student.fileUrl} 
                    isExternal 
                    color="blue.500"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    View Diploma
                  </Link>
                </Td>
              <Td fontSize={{ base: "xs", md: "sm" }} py={3} whiteSpace="normal">{student.uniqueToken}</Td>
              <Td fontSize={{ base: "xs", md: "sm" }} py={3} whiteSpace="normal">{student.expectedYearToGraduate}</Td>
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
          <Text fontSize="md" color="gray.600">
            {selectedCollege && selectedYear 
              ? "No student records found matching your search criteria." 
              : "Please select a college and year to view records."}
          </Text>
        </Box>
      )}
      {/* Pagination */}
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

export default ArchiveBydepartment;