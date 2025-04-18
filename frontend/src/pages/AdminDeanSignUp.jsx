import { useState } from "react";
import { Input, Button, VStack, Box, Heading, Flex, Select } from "@chakra-ui/react";
import { useAuthStore } from "../store/useAuthStore.js";

const AdminSignUpDean = () => {
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    role:"dean",
  });

  const { signup } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dean Data:", data);
    // Add your submit logic here
    signup(data);
    setData({
      fullName: "",
      email: "",
      password: "",
      department: "",
    })
  };

  return (
    <Box display="flex" flexDirection="column" gap="20px" p="20px" h="100vh" overflow="hidden">
      {/* Header */}
      <Box 
        bgGradient="linear(to-l, #be1010, #8C0001)" 
        color="white" 
        p="20px" 
        borderRadius="10px"
      >
        <Heading as="h1" fontSize="24px">Register a Dean</Heading>
      </Box>
      <Flex minH="calc(100vh - 100px)" align="center" justify="center" p={4}>
        <Box
        mb={"auto"} ml={"auto"} mr={"auto"}
          bg="gray.50"
          p={8}
          rounded="xl"
          shadow="lg"
          w="full"
          maxW="xl"
          
        >
          <Heading  size="md" mb={6} textAlign="center">
            Dean Sign-Up
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
              <Input
                type="text"
                value={data.fullName}
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
                placeholder="Full Name"
                size="lg"
                focusBorderColor="red.300"
              />
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="Email address"
                size="lg"
                focusBorderColor="red.300"
              />
              <Input
                type="text"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="Password"
                size="lg"
                focusBorderColor="red.300"
              />
              <Select
                value={data.department}
                onChange={(e) => setData({ ...data, department: e.target.value })}
                placeholder="Department"
                size="lg"
                focusBorderColor="red.300"
              >
                <option value="COT">COT</option>
                <option value="CITHM">CITHM</option>
                <option value="CAS">CAS</option>
                <option value="CBA">CBA</option>
                <option value="COL">COL</option>
              </Select>
              <Button color="white" type="submit" colorScheme="red" size="md" width="full">
                Register
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </Box>
  );
};

export default AdminSignUpDean;
