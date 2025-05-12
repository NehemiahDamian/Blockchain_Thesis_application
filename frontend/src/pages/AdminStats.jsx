import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Heading, Text, Button, Flex, Menu, MenuButton, MenuList, MenuItem, 
  Container, useDisclosure, useBreakpointValue, SimpleGrid, Icon
} from '@chakra-ui/react';
import { 
  FaRegFileAlt, FaRegFileExcel, FaChevronDown, FaGraduationCap, 
  FaChartBar, FaChartPie, FaUniversity, FaCalendarAlt, FaClipboardList 
} from 'react-icons/fa';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Sample data
  const data = {
    totalDiplomas: 3,
    departmentStats: [
      { _id: "CBA", count: 1 },
      { _id: "COT", count: 2 }
    ],
    yearStats: [
      { _id: "2024-2025", count: 2 },
      { _id: "2025-2026", count: 1 }
    ],
    numberofRequest: [
      { status: "accepted", count: 1 },
      { status: "declined", count: 0 },
      { status: "pending", count: 2 }
    ]
  };

  // Colors for charts
  const COLORS = ['#CE3435', '#8C0001', '#be1010', '#FF8042'];
  const statusColors = {
    accepted: '#38A169',
    declined: '#E53E3E',
    pending: '#DD6B20'
  };

  // Card component
  const MetricCard = ({ icon, title, value, description }) => (
    <Container
      bg="white" 
      borderRadius="10px" 
      p={isMobile ? "20px" : "30px"} 
      boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
      flex="1"
      position="relative"
      _after={{
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "7px",
        backgroundColor: "#CE3435",
        borderRadius: "0px 0px 10px 10px"
      }}
    >
      <Flex align="center" mb={4}>
        <Icon as={icon} fontSize="24px" color="#CE3435" mr={3} />
        <Text fontWeight="bold" fontSize="lg">{title}</Text>
      </Flex>
      <Text fontSize="2xl" fontWeight="bold" mb={1}>{value}</Text>
      <Text fontSize="sm" color="gray.500">{description}</Text>
    </Container>
  );

  // Chart card component
  const ChartCard = ({ title, icon, children }) => (
    <Container
      bg="white"
      borderRadius="10px"
      p={4}
      boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
      height="100%"
      position="relative"
    >
      <Flex align="center" mb={4}>
        <Icon as={icon} fontSize="20px" color="#CE3435" mr={2} />
        <Text fontWeight="semibold">{title}</Text>
      </Flex>
      <Box height={isMobile ? "250px" : "300px"}>
        {children}
      </Box>
    </Container>
  );

  return (
    <Box display="flex" flexDirection="column" gap="20px" p="20px" h="100vh" overflowY="auto">
      {/* Header */}
      <Box 
        bgGradient="linear(to-l, #be1010, #8C0001)" 
        color="white" 
        p="20px" 
        borderRadius="10px"
      >
        <Heading as="h1" fontSize="24px">Diploma Requests Dashboard</Heading>
        <Text fontSize="sm" opacity={0.9}>Overview of diploma requests and statistics</Text>
      </Box>
      
      {/* Metrics Row */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <MetricCard 
          icon={FaGraduationCap}
          title="Total Diplomas"
          value={data.totalDiplomas}
          description="All diploma requests"
        />
        <MetricCard 
          icon={FaClipboardList}
          title="Accepted Requests"
          value={data.numberofRequest.find(r => r.status === 'accepted')?.count || 0}
          description="Approved diplomas"
        />
        <MetricCard 
          icon={FaClipboardList}
          title="Pending Requests"
          value={data.numberofRequest.find(r => r.status === 'pending')?.count || 0}
          description="Awaiting review"
        />
      </SimpleGrid>

      {/* Charts Row */}
      <Flex direction={{ base: "column", md: "row" }} gap={4} flex="1">
        {/* Department Distribution */}
        <Box flex={{ md: 1 }}>
          <ChartCard title="Department Distribution" icon={FaUniversity}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.departmentStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                  label={({ _id, percent }) => `${_id}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.departmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>

        {/* Year Distribution */}
        <Box flex={{ md: 1 }}>
          <ChartCard title="Year Distribution" icon={FaCalendarAlt}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.yearStats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Diploma Count">
                  {data.yearStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>
      </Flex>

      {/* Second Charts Row */}
      <Flex direction={{ base: "column", md: "row" }} gap={4} flex="1">
        {/* Request Status */}
        <Box flex={{ md: 1 }}>
          <ChartCard title="Request Status" icon={FaChartPie}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.numberofRequest}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.numberofRequest.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.status]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>

        {/* Department Comparison */}
        <Box flex={{ md: 1.5 }}>
          <ChartCard title="Department Comparison" icon={FaChartBar}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.departmentStats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Diploma Count">
                  {data.departmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>
      </Flex>
    </Box>
  );
}

export default AdminDashboard;