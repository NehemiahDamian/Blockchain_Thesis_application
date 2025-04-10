import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import AdminNavbar from '../navbars/admin_navbar';
import DeanNavbar from '../navbars/dean_navbar';
import RegistrarNavbar from '../navbars/registrar_navbar';

export default function RootLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Define login pages 
  const loginPages = ['/student/login', '/student/signup', '/dean/login', '/admin/login', '/registrar/login'];
  const isLoginPage = loginPages.some(page => currentPath.includes(page));
  if (isLoginPage) {
    return <Outlet />;
  }

  // Define navbar
  const isDeanRoute = currentPath.includes('dean');
  const isRegistrarRoute = currentPath.includes('registrar');

  let NavbarComponent;

  if (isDeanRoute) {
    NavbarComponent = <DeanNavbar />;
  } else if (isRegistrarRoute) {
    NavbarComponent = <RegistrarNavbar />;
  } else {
    NavbarComponent = <AdminNavbar />;
  }

  return (
    <Flex className="root-layout" h="105vh">
      {NavbarComponent}
      
      <Flex direction="column" flex="1">
        <Box as="main" flex="1" p={1}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}