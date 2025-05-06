import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import axios from "axios";
import googleicon from "../../assets/google.png";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // Check for error message from OAuth redirect
  useEffect(() => {
    if (location.state?.error) {
      setErr(location.state.error);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", inputs);
      if (res.data.token) {
        login(res.data);
        navigate("/");
      } else {
        setErr("No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        setErr(error.response.data);
      } else {
        setErr("Server error");
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000/oauth2/redirect";
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
          <div className="social-login">
            <div className="divider">
              <span>OR</span>
            </div>
            <button className="google-btn" onClick={handleGoogleLogin}>
              <img 
                src={googleicon} 
                alt="Google Logo" 
              />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;