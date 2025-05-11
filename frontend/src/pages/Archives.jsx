import { Box, Button, Flex } from '@chakra-ui/react';
import { useEffect } from "react";
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

  useEffect(() => {
    fetchDepartmentYears(); 
  }, [fetchDepartmentYears]);

  const handleViewYears = (department) => {
    const years = Object.keys(departmentsArr[department]);

    navigate(`/admin/FilteredArchive?department=${department}&years=${encodeURIComponent(JSON.stringify(years))}`);
  };

  return (
    <div>
      <Box sx={scrollableContainerStyle}>
        {Object.keys(departmentsArr).map((department, index) => (
          <Flex key={`${department}${index}`} mb="8px">
            <Button 
              _hover={{ bg: "teal.500" }} 
              onClick={() => handleViewYears(department)} 
              fontSize="20px"
            >
              {department}
            </Button>
          </Flex>
        ))}
      </Box>
    </div>
  );
}

export default Archives;
