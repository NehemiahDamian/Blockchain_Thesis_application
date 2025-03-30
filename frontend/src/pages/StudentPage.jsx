/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useAuthStore } from "../store/useAuthStore"
import Navbar from "../components/Navbar.jsx";


function StudentPage (){
    const {authUser} = useAuthStore()
    
return(

    <div>
    <Navbar/>

        <p>{authUser?.fullName}</p>
        <p>{authUser?.idNumber}</p>

    </div>

)

}

export default StudentPage