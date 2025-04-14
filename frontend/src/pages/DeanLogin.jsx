import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import LoginForm from '../components/LoginForms';


function DeanLogin() {
  const [data, setData] = useState({  
    email:"",
    password:"",
    role:"dean"
  });
  const [errorMessage, setErrorMessage] = useState(null);
  

  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
  return (
    <LoginForm
      userType="Dean"
      data={data}
      setData={setData}
      handleSubmit={handleSubmit}
      errorMessage={errorMessage}
    />
  );
}

export default DeanLogin;