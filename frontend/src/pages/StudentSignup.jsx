/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
// import { useAuthStore } from "../store/useAuthStore";
// import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
// import { Link } from "react-router-dom";

// import AuthImagePattern from "../components/AuthImagePattern";
// import toast from "react-hot-toast";

const StudentSignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    idNumber:"",
    department:"",
    program:"",
    expectedYearToGraduate: "",

    role: "student", // Hardcoded role for testing
  });

  const {signup} = useAuthStore()

  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with:", formData); // Simulate API request
    signup(formData);

  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 space-y-4 border rounded-md shadow-md w-80">
        <h2 className="text-xl font-bold">Student Signup</h2>

        <div>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="idNumber"
            value={formData.idNumber}
            onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
          />
        </div>


        <div>
          <label className="block font-medium">Password</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-medium">Password</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="idNumber"
            value={formData.program}
            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
          />
        </div>

        <div>
        <input
            type="email"
            className="w-full p-2 border rounded"
            placeholder="you@example.com"
            value={formData.expectedYearToGraduate}
            onChange={(e) => setFormData({ ...formData, expectedYearToGraduate: e.target.value })}
          />
        </div>


        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          Sign Up
        </button>
      </form>
    </div>
  );

};
export default StudentSignup;