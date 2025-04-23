import "./navbar.scss";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import Logo from '../../assets/logo.png';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

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
                src={currentUser?.coverPic ? `http://localhost:8080/uploads/${currentUser.coverPic}` : "/defaultCover.jpg"}
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
