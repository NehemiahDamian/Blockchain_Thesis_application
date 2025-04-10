import React, { useState } from 'react';
import { Box, Image, VStack, Icon, Text, Flex, Collapse } from '@chakra-ui/react';
import { 
  FaHouseUser, 
  FaCog, 
  FaUserEdit, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Check if we're on any settings related page
  const isSettingsActive = location.pathname.includes('/settings');
  
  // Main navigation items
  const navItems = [
    { name: 'Dashboard', icon: FaHouseUser, href: '/deanDashboard', hasSubmenu: false },
    { 
      name: 'Settings', 
      icon: FaCog, 
      href: '#', 
      hasSubmenu: true,
      submenuItems: [
        { name: 'Edit Profile', icon: FaUserEdit, href: '/deanSettings' }
      ]
    },
    { name: 'Logout', icon: FaSignOutAlt, href: '/dean/login', hasSubmenu: false }
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
        src="/logo.png" 
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
                  bg: "#442b2b",
                  color: "#f4f4f4",
                }}
                sx={{
                  '&.active': {
                    fontWeight: "700",
                    color: "#f4f4f4",
              
                  }
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
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Navbar;