import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
function DeanLogin() {
  const [data, setData] = useState({  
    emaail:"",
    password:"",
    role:"dean"
  });

  const { login } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(data)
  };
  return (

    <div>
      <form onSubmit={handleSubmit}>
        <input type="email"
        value={data.email} 
        onChange={(e) => setData({...data, email: e.target.value})} 
        />

        <input type="password"
        value={data.password} 
        onChange={(e) => setData({...data, password: e.target.value})} 
        />

        <button onSubmit={handleSubmit}>
          Login
        </button>
      </form>
    </div>
  );
}

export default DeanLogin;