import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import { Group, PersonRemove } from "@mui/icons-material";
import "./friends.scss";

const Friends = () => {
  const { currentUser } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFriends();
  }, [currentUser.id]);

  const fetchFriends = () => {
    axios
      .get(`http://localhost:8080/api/users/${currentUser.id}/following`, {
        withCredentials: true,
      })
      .then((res) => setFriends(res.data))
      .catch((err) => console.error("Error fetching friends:", err));
  };

  const handleUnfollow = (friendId) => {
    axios
      .post(
        `http://localhost:8080/api/users/${currentUser.id}/unfollow/${friendId}`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
      })
      .catch((err) => console.error("Error unfollowing user:", err));
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="friends">
      <h2>Your Friends</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search friends..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="friend-search"
      />

      <div className="friend-list">
        {filteredFriends.length === 0 ? (
          <p>No friends match your search.</p>
        ) : (
          filteredFriends.map((friend) => (
            <div className="friend-wrapper" key={friend.id}>
              <div className="friend">
                <Link
                  to={`/profile/${friend.id}`}
                  className="friend-link"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <img
                    src={
                      friend.profilePic
                        ? `http://localhost:8080/uploads/${friend.profilePic}`
                        : "https://via.placeholder.com/50"
                    }
                    alt={friend.name}
                  />
                  <span>{friend.name}</span>
                </Link>
                <Group className="friend-icon" />
                <button
                  className="unfollow-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleUnfollow(friend.id);
                  }}
                >
                  <PersonRemove />
                  Unfollow
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Friends;
