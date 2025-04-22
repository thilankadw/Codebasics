import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    // Parse query parameters from the URL
    const getUrlParameter = (name) => {
      name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
      const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      const results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    const token = getUrlParameter("token");
    const id = getUrlParameter("id");
    const username = getUrlParameter("username");
    const name = getUrlParameter("name");
    const email = getUrlParameter("email");
    const profilePic = getUrlParameter("profilePic");
    const error = getUrlParameter("error");

    if (token) {
      // Successfully logged in with OAuth2
      const userData = {
        token,
        id,
        username,
        name,
        email,
        profilePic,
      };

      login(userData);
      navigate("/");
    } else {
      // OAuth2 login failed
      navigate("/login", { 
        state: { 
          error: error || "OAuth2 authentication failed. Please try again." 
        } 
      });
    }
  }, [login, navigate, location]);

  return (
    <div className="oauth2-redirect">
      <div className="loading-spinner">
        <p>Processing your authentication...</p>
        {/* You could add a spinner here */}
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;