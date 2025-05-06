import "./navbar.scss";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import Logo from '../../assets/logo.png';
import axios from "axios";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const userId = parseInt(currentUser.id);

  useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`http://localhost:8080/api/auth/users/${userId}`);
          setUser(res.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };
      fetchUser();
    }, [userId]);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={Logo} alt="Logo" style={{ width: '150px' }}/>
        </Link>
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <NotificationsOutlinedIcon />

        {currentUser ? (
          <Link to={`/profile/${currentUser.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="user">
              <img
                src={user?.profilePic ? `http://localhost:8080/uploads/${user.profilePic}` : "/defaultCover.jpg"}
                alt={currentUser.name || "User"}
              />
              <span>{currentUser.name || "Guest"}</span>
            </div>
          </Link>
        ) : (
          <div className="user">
            <img
              src={"/upload/defaultProfilePic.png"}
              alt="Guest"
            />
            <span>Guest</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
