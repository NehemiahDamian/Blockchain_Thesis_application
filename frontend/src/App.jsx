/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { Loader } from "lucide-react";
/* Navigation bar */
import RootLayout from './layout/RootLayout.jsx'


import StudentSignup from "./pages/StudentSignup.jsx";
import StudentLoginPage from "./pages/StudentLoginPage.jsx";
import StudentPage from "./pages/StudentPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminDeanSignUp from "./pages/AdminDeanSignUp.jsx";
import DeanHomePage from "./pages/testingPage.jsx";
import DeanEsig from "./pages/deanEsig.jsx";
import DeanLogin from "./pages/DeanLogin.jsx";


function App() {
  const location = useLocation();

  const { authUser, checkAuth, isCheckingAuth, } = useAuthStore(); 
  
  
    useEffect(() => {
      checkAuth();
    }, []);
  
    console.log({ authUser });
  
    if (isCheckingAuth && !authUser)
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
      );
  
  return(
  
    <div>
  
     <Routes>
     <Route element={<RootLayout />}>
      {/* STUDENT ROUTES */}
      <Route 
        path="/student/homepage" 
        element={authUser?.role === "student" ? <StudentPage /> : <Navigate to="/student/login" />} 
      />
      
      <Route 
        path="/student/signup" 
        element={!authUser ? <StudentSignup /> : <Navigate to="/student/homepage" />} 
      />
      
      <Route 
      path="/student/login" 
      element={!authUser ? <StudentLoginPage /> : <Navigate to="/student/homepage" />} 
      />

      {/* Admin routes */}

      <Route path ="/admin/dashboard" element= {<AdminPage/>}/>
      <Route path ="/admin/signupdean" element= {<AdminDeanSignUp/>}/>
      {/* <Route path ="/admin/dashboard" element= {authUser?.role === "admin" ? <AdminPage/> : <Navigate to = "/admin/login"/>}/> */}
      {/* <Route path="/admin/login" element={!authUser ? <AdminLogin /> : <Navigate to="/admin/dashboard" />}/> */}
      
      {/* Registrar routes (devy) */}
    
      {/* Dean routes  */}
      
      <Route 
        path="/dean/login" 
        element={!authUser ? <DeanLogin /> : <Navigate to={location.state?.from || "/dean/homepage"} />} 
      />

      <Route 
        path="/dean/profile" 
        element={authUser?.role === "dean" ? <DeanEsig /> : <Navigate to="/dean/login" state={{ from: "/dean/profile" }} />} 
      />

      <Route 
        path="/dean/homepage" 
        element={authUser ? <DeanHomePage /> : <Navigate to="/dean/login" state={{ from: "/dean/homepage" }} />} 
      />
      </Route>
    </Routes>
    </div>
  );
}

export default App;