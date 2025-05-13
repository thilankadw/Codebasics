import "./rightBar.scss";
import axios from "axios";

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";

const RightBar = ({ currentUserId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    // Fetch suggestions
    axios.get(`http://localhost:8080/api/users/${currentUser.id}/suggestions`)
      .then(res => setSuggestions(res.data))
      .catch(err => console.error("Error fetching suggestions:", err));

    // Fetch online friends (currently treated same as following)
    axios.get(`http://localhost:8080/api/users/${currentUser.id}/following`)
      .then(res => {
        setOnlineFriends(res.data);
        setFriendList(res.data); // friend list = following
      })
      .catch(err => console.error("Error fetching following:", err));
  }, [currentUserId]);

  const handleFollow = (userIdToFollow) => {
    axios.post(`http://localhost:8080/api/users/${currentUser.id}/follow/${userIdToFollow}`)
      .then(() => {
        // Remove from suggestions and add to friend list
        const followedUser = suggestions.find(u => u.id === userIdToFollow);
        setSuggestions(prev => prev.filter(u => u.id !== userIdToFollow));
        if (followedUser) setFriendList(prev => [...prev, followedUser]);
      })
      .catch(err => console.error("Error following user:", err));
  };

  const handleUnfollow = (userIdToUnfollow) => {
    axios.post(`http://localhost:8080/api/users/${currentUserId}/unfollow/${userIdToUnfollow}`)
      .then(() => {
        // Remove from friend list
        setFriendList(prev => prev.filter(u => u.id !== userIdToUnfollow));
        setOnlineFriends(prev => prev.filter(u => u.id !== userIdToUnfollow));
      })
      .catch(err => console.error("Error unfollowing user:", err));
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
                <img src={user.profilePic || "https://via.placeholder.com/50"} alt="User" />
                <span>{user.name}</span>
              </div>
              <div className="buttons">
                <button onClick={() => handleFollow(user.id)}>Follow</button>
                <button onClick={() => setSuggestions(prev => prev.filter(u => u.id !== user.id))}>Dismiss</button>
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
                <img src={user.profilePic || "https://via.placeholder.com/50"} alt="User" />
                <div className="online" />
                <span>{user.name}</span>
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
                <img src={user.profilePic || "https://via.placeholder.com/50"} alt="Friend" />
                <span>{user.name}</span>
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
