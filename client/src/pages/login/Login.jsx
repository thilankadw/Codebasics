import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import axios from "axios";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", inputs);

      // 🌟 Your backend sends: { token, id, username, name, email }
      const { token, id, username, name, email } = res.data;

      if (token) {
        const userData = { token, id, username, name, email };
        
        login(userData); 
        console.log(userData)// 📦 pass full user data to AuthContext

        navigate("/"); // 🎯 navigate after successful login
      } else {
        setErr("No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        setErr(error.response.data.message || "Login failed");
      } else {
        setErr("Server error");
      }
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Code Basics</h1>
          <p>
            Welcome to Code Basics, the ultimate coding experience!
          </p>
          <span>Don't have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {err && <div className="error">{err}</div>}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
