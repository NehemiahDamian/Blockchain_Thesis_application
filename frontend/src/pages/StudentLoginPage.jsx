/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

function StudentLoginPage() {
  const [data, setData] = useState({
    password: "",
    email: "",
    role: "student", // Hardcoded role
  });

  const { login } = useAuthStore(); // ✅ You forgot the ()

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ You forgot the parentheses here too
    login(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>

      <Link to="/StudentSignup" className="link link-primary">
        Create account
      </Link>
    </div>
  );
}

export default StudentLoginPage;
