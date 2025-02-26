/* eslint-disable no-unused-vars */
import { useState } from "react";
import Diploma from "./components/diploma.jsx";
import "./App.css";
import crypto from "crypto"; // Used for digital signing
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentSignup from "./pages/StudentSignup.jsx";


function App() {
return(
  <div>
    <Routes>
      <Route path ="/studentsignup" element={<StudentSignup/>}/>
    </Routes>

  </div>

)
}

export default App;
