import React, { useState } from 'react';
import { Box, Image, VStack, Icon, Text, Flex, Collapse, useToast } from '@chakra-ui/react';
import { 
  FaHouseUser, 
  FaCog, 
  FaUserEdit, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; 

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { logout, authUser } = useAuthStore();
  
  const isSettingsActive = location.pathname.includes('/settings');
  
  const handleLogout = async () => {
    try {
    let redirectPath = '/registrar/login'; 

    {/*
    if (authUser) {
      if (authUser.role === 'student') {
        redirectPath = '/student/login';
      } else if (authUser.role === 'registrar') {
        redirectPath = '/registrar/login';
      } else if (authUser.role === 'dean') {
        redirectPath = '/dean/login';
      }
    }
    
    logout();
    */}

    const result = await logout();

    if (result.success) {
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
      navigate(redirectPath, { replace: true });
    } else {
      toast({
        title: "Logout failed",
        description: result.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "An error occurred",
        description: "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Main navigation items
  const navItems = [
    { name: 'Dashboard', icon: FaHouseUser, href: '/registrar/dboard', hasSubmenu: false },
    { 
      name: 'Settings', 
      icon: FaCog, 
      href: '#', 
      hasSubmenu: true,
      submenuItems: [
        { name: 'Edit Profile', icon: FaUserEdit, href: '/registrar/profile' }
      ]
    },
    { name: 'Logout', icon: FaSignOutAlt, href: '#', hasSubmenu: false, onClick: handleLogout }
  ];

  // Toggle settings submenu
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
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
        mt="30px" 
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
            w="90%"
            my={item.hasSubmenu ? "10px" : "10px"}
            pt={index > 0 ? "10px" : 0}
          >
            {item.hasSubmenu ? (
              <>
                <Box
                  as="a"
                  href="#"
                  onClick={toggleSettings}
                  display="flex"
                  alignItems="center"
                  p="10px 20px"
                  borderRadius="10px 0 0 0"
                  bg={isSettingsActive ? "#442b2b3d" : "transparent"}
                  color="#ebebeb"
                  fontSize="15px"
                  fontWeight={isSettingsActive ? "700" : "lighter"}
                  textDecoration="none"
                  transition="background 0.3s ease, color 0.3s ease"
                  _hover={{
                    bg: "#442b2b",
                    color: "#f4f4f4",
                    borderRadius: "10px 0 0 0",
                  }}
                >
                  <Icon 
                    as={item.icon} 
                    mr="10px"
                    w="20px" 
                    textAlign="center"
                    transition="color 0.3s ease"
                    _hover={{ color: "#b94f35" }}
                  />
                  <Text>{item.name}</Text>
                </Box>
                
                <Collapse in={isSettingsOpen || isSettingsActive} animateOpacity>
                  <VStack 
                    as="ul" 
                    w="100%" 
                    spacing={0} 
                    align="start"
                    listStyleType="none" 
                    pl={0}
                    mt={0}
                  >
                    {item.submenuItems.map((subItem, subIndex) => {
                      const isSubActive = location.pathname === subItem.href;
                      
                      return (
                        <Box 
                          as="li" 
                          key={subIndex} 
                          textAlign="left"
                          w="100%"
                          pl="20px"
                        >
                          <Box
                            as={NavLink}
                            to={subItem.href}
                            display="flex"
                            alignItems="center"
                            p="10px 20px"
                            color="#ebebeb"
                            fontSize="15px"
                            fontWeight="lighter"
                            textDecoration="none"
                            borderRadius="10px 0 0 0"
                            transition="background 0.3s ease, color 0.3s ease"
                            _hover={{
                              bg: "#442b2b",
                              color: "#f4f4f4",
                            }}
                            sx={{
                              '&.active': {
                                fontWeight: "700",
                                color: "#f6f6f6",
                                bg: "#442b2b3d",
                              }
                            }}
                          >
                            <Icon 
                              as={subItem.icon} 
                              mr="10px"
                              w="20px" 
                              textAlign="center"
                              transition="color 0.3s ease"
                              _hover={{ color: "#b94f35" }}
                            />
                            <Text>{subItem.name}</Text>
                          </Box>
                        </Box>
                      );
                    })}
                  </VStack>
                </Collapse>
              </>
            ) : item.onClick ? (
              <Box
              as="button"
              onClick={item.onClick}
              display="flex"
              alignItems="center"
              p="10px 20px"
              color="#ebebeb"
              fontSize="15px"
              fontWeight="lighter"
              textDecoration="none"
              borderRadius="10px 0 0 0"
              transition="background 0.3s ease, color 0.3s ease"
              w="100%"
              border="none"
              cursor="pointer"
              _hover={{
                bg: '#442b2b',
                color: '#f4f4f4'
              }}
            >
              <Icon
                as={item.icon}
                mr="10px"
                w="20px"
                textAlign="center"
                transition="color 0.3s ease"
                _hover={{ color: '#b94f35' }}
              />
              <Text>{item.name}</Text>
            </Box>
          ) : (
            <Box
              as={NavLink}
              to={item.href}
              display="flex"
              alignItems="center"
              p="10px 20px"
              color="#ebebeb"
              fontSize="15px"
              fontWeight="lighter"
              textDecoration="none"
              borderRadius="10px 0 0 0"
              transition="background 0.3s ease, color 0.3s ease"
              _hover={{
                bg: '#442b2b',
                color: '#f4f4f4'
              }}
              sx={{
                '&.active': {
                  fontWeight: '700',
                  color: '#f4f4f4',
                  bg: '#442b2b3d'
                }
              }}
            >
              <Icon
                as={item.icon}
                mr="10px"
                w="20px"
                textAlign="center"
                transition="color 0.3s ease"
                _hover={{ color: '#b94f35' }}
              />
              <Text>{item.name}</Text>
            </Box>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Navbar;