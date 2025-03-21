/* eslint-disable no-unused-vars */
import { Box, VStack, Link } from "@chakra-ui/react";
import AdminDeanSignUp from "../pages/AdminDeanSignUp.jsx";
import AdminPage from "../pages/AdminPage.jsx";
function AdminNavbar(){
  return (
    <Box
      as="nav"
      w="200px"
      h="200vh"
      bg="red.600"
      color="white"
      p="4"
      position="fixed"
      fontWeight="bold"
      fontFamily="arial"
      fontSize="17px"
      borderRightRadius="50px"
      
    >
      <VStack marginLeft="10px"align="start" spacing="4" marginTop="10">
        <Link href="#" _hover={{ textDecoration: "none", color: "teal.300" }} marginTop="20px">
          Dashboard
        </Link>
        <Link href="/admin/dashboard" _hover={{ textDecoration: "none", color: "teal.300" }} marginTop="20px">
          Process Diplomas
        </Link>
        <Link href="/admin/signupdean" _hover={{ textDecoration: "none", color: "teal.300" }} marginTop="20px">
          Sign Up Dean
        </Link>
        <Link href="#" _hover={{ textDecoration: "none", color: "teal.300" }}  marginTop="20px">
          Diploma Request
        </Link>
        <Link href="#" _hover={{ textDecoration: "none", color: "teal.300" }} marginTop="20px">
          Archives
        </Link>

        <Link href="#" _hover={{ textDecoration: "none", color: "teal.300" }} marginTop="300px">
          LogOut
        </Link>
      </VStack>
    </Box>
  );
}



export default AdminNavbar