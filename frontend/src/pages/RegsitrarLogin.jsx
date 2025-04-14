import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import LoginForm from '../components/LoginForms';

function RegistrarLogin() {
  const [data, setData] = useState({  
    email:"",
    password:"",
    role:"registrar"
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
      userType="Registrar"
      data={data}
      setData={setData}
      handleSubmit={handleSubmit}
      errorMessage={errorMessage}
    />
  );
}

export default RegistrarLogin;