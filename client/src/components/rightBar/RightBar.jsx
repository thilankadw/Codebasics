import "./rightBar.scss";

const RightBar = () => {
  const suggestions = [
    { id: 1, name: "John Doe", img: "https://via.placeholder.com/50" },
    { id: 2, name: "Jane Smith", img: "https://via.placeholder.com/50" },
    { id: 3, name: "Mark Johnson", img: "https://via.placeholder.com/50" },
    { id: 4, name: "Lisa Brown", img: "https://via.placeholder.com/50" },
  ];

  const activities = [
    { id: 1, name: "Alice Brown", action: "changed their cover photo", time: "2 min ago", img: "https://via.placeholder.com/50" },
    { id: 2, name: "Bob White", action: "liked a post", time: "5 min ago", img: "https://via.placeholder.com/50" },
    { id: 3, name: "Sarah Connor", action: "commented on a photo", time: "10 min ago", img: "https://via.placeholder.com/50" },
    { id: 4, name: "Michael Scott", action: "shared a post", time: "15 min ago", img: "https://via.placeholder.com/50" },
  ];

  const onlineFriends = [
    { id: 1, name: "Charlie Green", img: "https://via.placeholder.com/50" },
    { id: 2, name: "Emily Rose", img: "https://via.placeholder.com/50" },
    { id: 3, name: "David Miller", img: "https://via.placeholder.com/50" },
    { id: 4, name: "Sophia Wilson", img: "https://via.placeholder.com/50" },
  ];

  return (
    <div className="rightBar">
      <div className="container">
        {/* Suggestions */}
        <div className="item">
          <span>Suggestions For You</span>
          {suggestions.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={user.img} alt="User" />
                <span>{user.name}</span>
              </div>
              <div className="buttons">
                <button>Follow</button>
                <button>Dismiss</button>
              </div>
            </div>
          ))}
        </div>

        {/* Latest Activities */}
        <div className="item">
          <span>Latest Activities</span>
          {activities.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={user.img} alt="User" />
                <p>
                  <span>{user.name}</span> {user.action}
                </p>
              </div>
              <span>{user.time}</span>
            </div>
          ))}
        </div>

        {/* Online Friends */}
        <div className="item">
          <span>Online Friends</span>
          {onlineFriends.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={user.img} alt="User" />
                <div className="online" />
                <span>{user.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
