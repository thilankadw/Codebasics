import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import { Group, PersonAdd, PersonRemove } from "@mui/icons-material";
import "./friends.scss";

const FindFriends = () => {
  const { currentUser } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsersAndFollowing();
  }, [currentUser.id]);

  const fetchUsersAndFollowing = async () => {
    try {
      const [usersRes, followingRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/auth/users`, {
          withCredentials: true,
        }),
        axios.get(`http://localhost:8080/api/users/${currentUser.id}/following`, {
          withCredentials: true,
        }),
      ]);

      // Filter out the current user and update state
      const filteredUsers = usersRes.data.filter(user => user.id !== currentUser.id);
      setAllUsers(filteredUsers);
      setFollowingIds(followingRes.data.map(user => user.id));
    } catch (err) {
      console.error("Error fetching users or following list:", err);
    }
  };

  const handleFollow = (userIdToFollow) => {
    axios
      .post(
        `http://localhost:8080/api/users/${currentUser.id}/follow/${userIdToFollow}`,
        {},
        { withCredentials: true }
      )
      .then(() => setFollowingIds(prev => [...prev, userIdToFollow]))
      .catch(err => console.error("Error following user:", err));
  };

  const handleUnfollow = (userIdToUnfollow) => {
    axios
      .post(
        `http://localhost:8080/api/users/${currentUser.id}/unfollow/${userIdToUnfollow}`,
        {},
        { withCredentials: true }
      )
      .then(() => setFollowingIds(prev => prev.filter(id => id !== userIdToUnfollow)))
      .catch(err => console.error("Error unfollowing user:", err));
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="friends">
      <h2>Find Friends</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="friend-search"
      />

      <div className="friend-list">
        {filteredUsers.length === 0 ? (
          <p>No users match your search.</p>
        ) : (
          filteredUsers.map(user => (
            <div className="friend-wrapper" key={user.id}>
              <div className="friend">
                <Link
                  to={`/profile/${user.id}`}
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
                      user.profilePic
                        ? `http://localhost:8080/uploads/${user.profilePic}`
                        : "https://via.placeholder.com/50"
                    }
                    alt={user.name}
                  />
                  <span>{user.name}</span>
                </Link>
                <Group className="friend-icon" />

                {followingIds.includes(user.id) ? (
                  <button
                    className="unfollow-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleUnfollow(user.id);
                    }}
                  >
                    <PersonRemove />
                    Unfollow
                  </button>
                ) : (
                  <button
                    className="follow-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFollow(user.id);
                    }}
                  >
                    <PersonAdd />
                    Follow
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FindFriends;
