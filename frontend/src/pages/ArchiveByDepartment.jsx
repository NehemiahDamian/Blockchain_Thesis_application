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

function ArchiveBydepartment() {
    const{allStudent, getAllstudentsArchiveByDepartment} = useAdminStore()
  
  // Extract the query parameters
  const searchParams = new URLSearchParams(location.search);
  const department = searchParams.get("department");
  const year = searchParams.get("year");

  // Call the API only if department and year are present
  useEffect(() => {
    if (department && year) {
      getAllstudentsArchiveByDepartment(department, year);
    }
  }, [department, year, getAllstudentsArchiveByDepartment]);
  return (
    <Box sx={scrollableContainerStyle}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Full Name</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Department</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Diploma URL</th>
            <th style={{ textAlign: "left", padding: "8px" }}>token</th>
            <th style={{ textAlign: "left", padding: "8px" }}>program</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Year Graduated</th>

          </tr>
        </thead>
        <tbody>
          {allStudent.map((dept, index) => (
            <tr key={`${dept.fullName}${index}`}>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{dept.fullName}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{dept.department}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                <a href={dept.fileUrl} target="_blank" rel="noopener noreferrer">{dept.fileUrl}</a>
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{dept.uniqueToken}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{dept.program}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{dept.expectedYearToGraduate}</td>


            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

export default ArchiveBydepartment;