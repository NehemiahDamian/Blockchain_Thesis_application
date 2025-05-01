import React from 'react';
import { Box, Image, VStack, Icon, Text, Flex } from '@chakra-ui/react';
import { 
  FaHouseUser, 
  FaFileInvoice, 
  FaFolderOpen, 
  FaUserPlus, 
  FaCloudUploadAlt, 
  FaFile, 
  FaFileImport,
  FaSignOutAlt 
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  // Updated paths to match your routing structure
  const navItems = [
    { name: 'Dashboard', icon: FaHouseUser, href: '/admin/stats' },
    { name: 'Send Diplomas', icon: FaFileImport, href: '/admin/dashboard' },
    { name: 'Archives', icon: FaFolderOpen, href: '/archives' },
    { name: 'Sign up Dean', icon: FaUserPlus, href: '/admin/signupdn' },
    { name: 'Blockchain Diploma Upload', icon: FaCloudUploadAlt, href: '/upload-bchain' },
    { name: 'Diploma Requests', icon: FaFile, href: '/admin/request' },
    { name: 'Logout', icon: FaSignOutAlt, href: '/login', isLogout: true }
  ];

  const handleLogout = () => {
    let redirectPath = '/registrar/login'; 
    
    if (authUser) {
      if (authUser.role === 'registrar') {
        redirectPath = '/registrar/login';
      } else if (authUser.role === 'student') {
        redirectPath = '/student/login';
      } else if (authUser.role === 'dean') {
        redirectPath = '/dean/login';
      }
    }
    
    logout();
    
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    navigate(redirectPath);
  };

  return (
    <Box
      as="nav"
      w="240px"
      h="100%"
      borderRadius="0px 45px 0px 0px"
      bgGradient="linear(180deg, #a10c0c, #8C0001 25%)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      fontFamily="'Gabarito', serif"
    >
      <Image 
        src="../src/assets/logo.png" 
        alt="Logo" 
        w="80px" 
        mt="30px" 
      />
      
      <VStack 
        as="ul" 
        mt="10px" 
        w="100%" 
        spacing={0} 
        align="start"
        listStyleType="none" 
        pl={0}
      >
        {navItems.map((item, index) => (
          <Box 
            as="li" 
            key={index} 
            mx="25px"
            textAlign="left"
            w="89.5%"
            my="13px"
            _hover={{
              bg: "#442b2b",
              color: "#f4f4f4",
              transition: "background 0.3s ease, color 0.3s ease",
              borderRadius: "10px 0 0 0",
            }}
          >
            <NavLink
              to={item.href}
              style={({ isActive }) => ({
                textDecoration: "none",
                color: isActive ? "#f4f4f4" : "#ebebeb",
                fontSize: "15px",
                display: "flex",
                alignItems: item.name.includes('Diplomas') ? "flex-start" : "center",
                padding: "9px 20px",
                fontWeight: isActive ? "700" : "lighter",
              })}
            >
              <Icon 
                as={item.icon} 
                mr="10px"
                mt="3px" 
                w="20px" 
                textAlign="center" 
              />
              {item.name.includes('Diplomas') ? (
                <Flex direction="column">
                  <Text>Send Diplomas</Text>
                  <Text mt="-1">to Signatories</Text>
                </Flex>
              ) : item.name === 'Blockchain Diploma Upload' ? (
                <Flex direction="column">
                  <Text>Blockchain Diploma</Text>
                  <Text mt="-1">Upload</Text>
                </Flex>
              ) : (
                <Text>{item.name}</Text>
              )}
            </NavLink>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Navbar;