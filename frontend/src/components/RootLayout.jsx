import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import AdminNavbar from './AdminNavbar';
import DeanNavbar from './DeanNavbar';
import RegistrarNavbar from './RegistrarNavbar';

export default function RootLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const loginPages = ['/student/login', '/student/signup', '/dean/login', '/admin/login', '/registrar/login', '/studentdb', 'studentsettings', '/verifierdashboard'];
  const nonLoginPages = ['/student/homepage'];

  const isLoginPage = loginPages.some(page => currentPath.includes(page));
  const isNonLoginPage = nonLoginPages.some(page => currentPath.includes(page));

  if (isLoginPage || isNonLoginPage) {
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
