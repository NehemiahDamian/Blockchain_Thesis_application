/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { Loader } from "lucide-react";
import RootLayout from "./components/RootLayout.jsx"; // imported Navbars root layout
import StudentSignup from "./pages/StudentSignup.jsx";
import StudentLoginPage from "./pages/StudentLoginPage.jsx";
import StudentPage from "./pages/StudentPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminDeanSignUp from "./pages/AdminDeanSignUp.jsx";
import DeanHomePage from "./pages/DeanHomePage.jsx";
import DeanEsig from "./pages/deanEsig.jsx";
import DeanLogin from "./pages/DeanLogin.jsx";
import ViewDiplomasPage from "./pages/DeanFilteredpage.jsx";
import RegistrarDboard from "./pages/RegistrarDboard.jsx";
import RegistrarFilteredPage from "./pages/FilteredRegistrarPage.jsx";
import RegistrarEsig from "./pages/RegistrarEsig.jsx";
import AdminSignUpRegistrar from "./pages/RegsitrarSignup.jsx";
import RegistrarLogin from "./pages/RegsitrarLogin.jsx";


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
      <Route path ="/admin/signupdn" element= {<AdminDeanSignUp/>}/>
      <Route path ="/admin/signupregistrar" element= {<AdminSignUpRegistrar/>}/>

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

       <Route 
        path="/dean/view-diplomas" 
        element={authUser ? <ViewDiplomasPage/> : <Navigate to="/dean/login" state={{ from: "/dean/view-diplomas" }} />} 
      />

      {/* registrar route */}

      <Route path = "/registrar/login" element = {!authUser ? <RegistrarLogin/> : <Navigate to={location.state?.from || "/registrar/dboard" } />}/>


      <Route path="/registrar/dboard" element={authUser?.role==="registrar" ? <RegistrarDboard/> : <Navigate to = "/registrar/login" state={{from: "/registrar/dboard"}}/>} />
      
      <Route path="/registrar/profile" element={authUser?.role === "registrar"? <RegistrarEsig/> : <Navigate to = "/registrar/login" state = {{from:"/registrar/profile"}} />} />


      
      <Route 
        path="/registrar/view-diplomas" 
        element={authUser ? <RegistrarFilteredPage/> : <Navigate to="/dean/login" state={{ from: "/view-diplomas" }} />} 
      />
      </Route>
    </Routes>
    </div>
  );
}

export default App;