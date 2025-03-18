import { useState } from "react";
import "./comments.scss";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");

  // Dummy user data
  const currentUser = {
    profilePic: "dummyProfilePic.png", // Make sure this image exists in your public/upload folder
    name: "John Doe",
  };

  // Dummy comments data
  const data = [
    {
      id: 1,
      name: "Alice Smith",
      profilePic: "dummyProfilePic1.png",
      desc: "This is a great post!",
      createdAt: new Date(),
    },
    {
      id: 2,
      name: "Bob Johnson",
      profilePic: "dummyProfilePic2.png",
      desc: "I totally agree!",
      createdAt: new Date(),
    },
  ];

  const handleClick = (e) => {
    e.preventDefault();
    const newComment = {
      id: data.length + 1,
      name: currentUser.name,
      profilePic: currentUser.profilePic,
      desc,
      createdAt: new Date(),
    };
    data.push(newComment); // This won't persist since it's not backend-connected
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="User" />
        <input
          type="text"
          placeholder="Write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {data.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={"/upload/" + comment.profilePic} alt="User" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
