import "./rightBar.scss";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import Profilepicture from "../../assets/profilepic.png";

const RightBar = ({ currentUserId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    // Fetch suggestions
    axios
      .get(`http://localhost:8080/api/users/${currentUser.id}/suggestions`)
      .then((res) => setSuggestions(res.data))
      .catch((err) => console.error("Error fetching suggestions:", err));

    // Fetch online friends (currently treated same as following)
    axios
      .get(`http://localhost:8080/api/users/${currentUser.id}/following`)
      .then((res) => {
        setOnlineFriends(res.data);
        setFriendList(res.data);
      })
      .catch((err) => console.error("Error fetching following:", err));
  }, [currentUser.id]);

  const handleFollow = (userIdToFollow) => {
    axios
      .post(
        `http://localhost:8080/api/users/${currentUser.id}/follow/${userIdToFollow}`
      )
      .then(() => {
        const followedUser = suggestions.find((u) => u.id === userIdToFollow);
        setSuggestions((prev) =>
          prev.filter((u) => u.id !== userIdToFollow)
        );
        if (followedUser)
          setFriendList((prev) => [...prev, followedUser]);
      })
      .catch((err) => console.error("Error following user:", err));
  };

  const handleUnfollow = (userIdToUnfollow) => {
    axios
      .post(
        `http://localhost:8080/api/users/${currentUser.id}/unfollow/${userIdToUnfollow}`
      )
      .then(() => {
        setFriendList((prev) =>
          prev.filter((u) => u.id !== userIdToUnfollow)
        );
        setOnlineFriends((prev) =>
          prev.filter((u) => u.id !== userIdToUnfollow)
        );
      })
      .catch((err) => console.error("Error unfollowing user:", err));
  };

  return (
    <div className="rightBar">
      <div className="container">

        {/* Suggestions */}
        <div className="item">
          <span>Suggestions For You</span>
          {suggestions.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <Link
                  to={`/profile/${user.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                  className="foloowuserprofile"
                >
                  <img
                    src={
                      currentUser.profilePic
                        ? currentUser.profilePic.startsWith("https://")
                          ? currentUser.profilePic
                          : `http://localhost:8080/uploads/${currentUser.profilePic}`
                        : Profilepicture
                    }
                    alt=""
                  />
                  <span>{user.name}</span>
                </Link>
              </div>
              <div className="buttons">
                <button onClick={() => handleFollow(user.id)}>Follow</button>
                <button
                  onClick={() =>
                    setSuggestions((prev) =>
                      prev.filter((u) => u.id !== user.id)
                    )
                  }
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Online Friends */}
        <div className="item">
          <span>Online Friends</span>
          {onlineFriends.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <Link
                  to={`/profile/${user.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <img
                    src={
                      user.profilePic
                        ? `http://localhost:8080/uploads/${user.profilePic}`
                        : "https://via.placeholder.com/50"
                    }
                    alt=""
                  />
                  <div className="online" />
                  <span>{user.name}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Friend List */}
        <div className="item">
          <span>Your Friends</span>
          {friendList.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <Link
                  to={`/profile/${user.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    src={
                      user.profilePic
                        ? `http://localhost:8080/uploads/${user.profilePic}`
                        : "https://via.placeholder.com/50"
                    }
                    alt=""
                  />
                  <span>{user.name}</span>
                </Link>
              </div>
              <div className="buttons">
                <button onClick={() => handleUnfollow(user.id)}>Unfollow</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RightBar;
