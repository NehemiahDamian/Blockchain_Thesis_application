import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
function RegistrarLogin() {
  const [data, setData] = useState({  
    emaail:"",
    password:"",
    role:"registrar"
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
        placeholder="Email"
        value={data.email} 
        onChange={(e) => setData({...data, email: e.target.value})} 
        />

        <input type="password"
        placeholder="password"
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

export default RegistrarLogin;