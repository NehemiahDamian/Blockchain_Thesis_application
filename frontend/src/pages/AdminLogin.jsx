/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
function AdminLogin(){
  const [data, setData] = useState({
    email:"",
    password:"",
    role:"admin"        
})

const {login} = useAuthStore()

  const handleSubmit = (e) =>{
    e.preventDefault()
    login(data)

  }
  return(
    <div>
      <form onSubmit={handleSubmit}>
        <input  
        type="email"
        placeholder="Enter Your Email"
        value = {data.email}
        onChange={(e)=> setData({...data, email: e.target.value})}/>

        <input 
        type="password"
        placeholder="Input Your Passwword"
        value = {data.password} 
        onChange={(e) => setData({...data, password:e.target.value})} />

        <button type="submit"></button>
      </form>
    </div>
  )
}

export default AdminLogin