/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Button, Text } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import LoginForm from '../components/LoginForms';


function StudentLoginPage() {
  const [data, setData] = useState({
    password: "",
    email: "",
    role: "student", // Hardcoded role
  });
  const [errorMessage, setErrorMessage] = useState(null);
  

  const { login } = useAuthStore(); //

  const handleSubmit = async(e) => {
    e.preventDefault(); // 
    
    //added user validation
    try {
      const success = await login(data);
      
      if (success) {
        setErrorMessage(null); // Clear any previous errors
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      setErrorMessage('Login failed. Please try again.');
    }
  };

  // for Signup button
  const additionalElements = (
    <>
    <Link to="/student/forgotpass">
      <Button 
        variant="link" 
        textColor="#8b0e0e"
        size="md"
        mt={2}
      >
        Forgot Password
      </Button>
    </Link> 
    <Link to="/student/signup">
      <Button 
        variant="link" 
        textColor="#8b0e0e"
        size="md"
        mt={2}
      >
        Create account
      </Button>
    </Link>
    </>
  );

  return (
    <LoginForm
      userType="Student"
      data={data}
      setData={setData}
      handleSubmit={handleSubmit}
      errorMessage={errorMessage}

    />
  );
}

export default StudentLoginPage;
