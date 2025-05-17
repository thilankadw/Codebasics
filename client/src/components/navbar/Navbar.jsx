import "./navbar.scss";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Logo from '../../assets/logo.png';
import axios from "axios";
import Profilepicture from "../../assets/profilepic.png";

const PAGE_SIZE = 3;

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = parseInt(currentUser.id);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const unreadCount = notifications.filter(notification => !notification.read).length;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/auth/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/notification/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchUser();
    fetchNotifications();
  }, [userId]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:8080/api/notification/read/${notificationId}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    console.log(userId)
    try {
      await axios.put(`http://localhost:8080/api/notification/read-all/${userId}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);
  const currentNotifications = notifications.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={Logo} alt="Logo" style={{ width: '150px' }} />
        </Link>
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="right">
        <div className="notifications">
          <div className="notification-container">
            <NotificationsOutlinedIcon className="notificationIcon" onClick={toggleDropdown} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
          {showDropdown && (
            <div className="dropdown">
              {currentNotifications.map(n => (
                <div
                  key={n.id}
                  className={`notification-item ${n.read ? "read" : "unread"}`}
                  onClick={() => markAsRead(n.id)}
                >
                  {n.message}
                </div>

              ))}
              <div className="actions">
                <button onClick={markAllAsRead}>Mark all as read</button>
              </div>
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {currentUser ? (
          <Link to={`/profile/${currentUser.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="user">
              <img
                src={
                  currentUser.profilePic
                    ? currentUser.profilePic.startsWith("https://")
                      ? currentUser.profilePic
                      : `http://localhost:8080/uploads/${currentUser.profilePic}`
                    : Profilepicture
                }
                alt={currentUser.name || "User"}
              />
              <span>{currentUser.name || "Guest"}</span>
            </div>
          </Link>
        ) : (
          <div className="user">
            <img src={"/upload/defaultProfilePic.png"} alt="Guest" />
            <span>Guest</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
