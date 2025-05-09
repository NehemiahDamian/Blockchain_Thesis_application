/* eslint-disable no-unused-vars */
import { 
  Box, Heading, Text, Button, Flex, Menu, MenuButton, MenuList, MenuItem, 
  Container, useDisclosure, useBreakpointValue 
} from '@chakra-ui/react';
import { useState, useEffect } from "react";

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

function FilteredArchive() {
  const navigate = useNavigate();

    const{fetchDepartmentYears,departmentYears, getAllstudentsArchiveByDepartment} = useAdminStore()
  
    useEffect(() => {
      fetchDepartmentYears()
    }, [fetchDepartmentYears]); 
    
    const handleViewArchivesByDepartment = async (department, year) => {
      try {
        await getAllstudentsArchiveByDepartment(department, year);
        navigate(`/admin/archiveBydepartment?department=${department}&year=${year}`);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    }
  return (
    <div>
         <Box sx={scrollableContainerStyle}>
                  {departmentYears.map((dept, index) => (
                      <Flex key={`${dept.department}${index}`}>
                        <Box flex="1">
                         <Button _hover={{ bg: "teal.500" }} onClick={() => handleViewArchivesByDepartment(dept.department, dept.year)} as="h2" fontSize="30px">{dept.year}</Button>
                         </Box>
                       
                      </Flex>
                    ))}
                </Box>
    </div>
  );
}

export default FilteredArchive;