import "./profile.scss";
import {
  FacebookTwoTone,
  LinkedIn,
  Instagram,
  Pinterest,
  Twitter,
  Place,
  Language,
  EmailOutlined,
} from "@mui/icons-material";
import Posts from "../../components/posts/Posts";
import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import axios from "axios";
import CreatePost from "../../components/createPost/createPost";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [user, setUser] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const userId = parseInt(id);

  const [isFollowing, setIsFollowing] = useState(false);

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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="profile">
      <div className="images">
        <img
          src={user?.coverPic ? `http://localhost:8080/uploads/${user.coverPic}` : "/defaultCover.jpg"}
          alt="Cover"
          className="cover"
        />
        <img
          src={user?.profilePic ? `http://localhost:8080/uploads/${user.profilePic}` : "/defaultProfile.jpg"}
          alt="Profile"
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          
          <div className="center">
            <h2>{user?.name}</h2>
            <div className="info">
              <div className="item"><Place /><span>{user?.city || "Unknown"}</span></div>
              <div className="item"><Language /><span>{user?.website || "Not provided"}</span></div>
              <div className="item"><EmailOutlined /><span>{user?.email}</span></div>
            </div>
            <div className="action-buttons">
              {userId === parseInt(currentUser.id) ? (
                <>
                  <button onClick={() => setOpenUpdate(true)}>Update Profile</button>
                  <button onClick={() => setOpenCreatePost(true)}>Create Post</button>
                </>
              ) : (
                <button onClick={handleFollow}>
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
          <div className="left">
            <a href="http://facebook.com"><FacebookTwoTone fontSize="large" /></a>
            <a href="http://instagram.com"><Instagram fontSize="large" /></a>
            <a href="http://twitter.com"><Twitter fontSize="large" /></a>
            <a href="http://linkedin.com"><LinkedIn fontSize="large" /></a>
            <a href="http://pinterest.com"><Pinterest fontSize="large" /></a>
          </div>
          <div className="right">
          </div>
        </div>
        
        <Posts userId={userId} />
      </div>

      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={currentUser} />}
      {openCreatePost && <CreatePost setOpenCreatePost={setOpenCreatePost} userId={currentUser.id} />}
    </div>
    
  );
};

export default Profile;
