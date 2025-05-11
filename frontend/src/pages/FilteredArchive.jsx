import { Box, Button, Flex } from '@chakra-ui/react';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminStore } from '../store/useAdminStore.js';

const scrollableContainerStyle = {
  maxHeight: "500px",
  overflowY: "auto",
  padding: "16px",
  background: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

function FilteredArchive() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const department = searchParams.get('department');
  const years = JSON.parse(decodeURIComponent(searchParams.get('years'))); 

  const { getAllstudentsArchiveByDepartment } = useAdminStore();

  const handleViewArchivesByYear = async (department, year) => {
    try {
      await getAllstudentsArchiveByDepartment(department, year);
      navigate(`/admin/archiveByDepartment?department=${department}&year=${year}`);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  return (
    <div>
      <Box sx={scrollableContainerStyle}>
        <Box>

        </Box>
        {years.map((year, index) => (
          <Flex key={`${year}${index}`} mb="8px">
            <Button 
              _hover={{ bg: "teal.500" }} 
              onClick={() => handleViewArchivesByYear(department, year)}
              fontSize="20px"
            >
              {year}
            </Button>
          </Flex>
        ))}
      </Box>
    </div>
  );
}

export default FilteredArchive;
