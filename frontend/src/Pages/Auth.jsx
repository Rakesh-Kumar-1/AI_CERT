import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/Auth.css'

const Auth = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(0);
  const [user, setUser] = useState({ name: "", email: "", password: "" });


  const onchangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };


  const formSubmit = async (e) => {
    e.preventDefault(); 
    try {
      if (role === 0) { 
        const message = await axios.post("https://ai-cert.onrender.com/userVerify", user);
        
        if (message.data.message === "login Successfully") {
          const userInfo = {id: message.data.info.id, name: message.data.info.name};
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          navigate("/front");
        } else {
          alert(`Invalid credentials`);
        }
      } 
      else {  
        const message = await axios.post("https://ai-cert.onrender.com/addUser", user);

        if (message.data.message === "User Register succesfully") {
          const userInfo = {id: message.data.info.id, name: message.data.info.name};
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          navigate("/front");
        } else {
          alert(`User already exists`);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Server Error! Try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="box">
        <h2>{role === 0 ? "Login" : "Sign Up"}</h2>

        <form onSubmit={formSubmit}>
          {role === 1 && (
            <input 
              type="text"
              name="name"
              value={user.name}
              onChange={onchangeInput}
              placeholder="Enter your name"
              required
            />
          )}
          
          <input 
            type="email"
            name="email"
            value={user.email}
            onChange={onchangeInput}
            placeholder="Enter your email"
            required
          />
          
          <input 
            type="password"
            name="password"
            value={user.password}
            onChange={onchangeInput}
            placeholder="Enter your password"
            required
          />

          <button type="submit" className="btn-primary">
            {role === 0 ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="switch-text">
          {role === 0 ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setRole(role === 0 ? 1 : 0)}>
            {role === 0 ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
