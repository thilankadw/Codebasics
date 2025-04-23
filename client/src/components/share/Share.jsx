import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import CreatePost from "../createPost/createPost";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const [openCreatePost, setOpenCreatePost] = useState(false);

  const handleOpenCreatePost = () => {
    setOpenCreatePost(true);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top" onClick={handleOpenCreatePost} style={{ cursor: "pointer" }}>
          <div className="left">
            <img src={currentUser?.coverPic ? `http://localhost:8080/uploads/${currentUser.coverPic}` : "/defaultCover.jpg"} />
            <input
              type="text"
              placeholder={`What's on your mind, ${currentUser.name}?`}
            />
          </div>
        </div>

        <hr />

        <div className="bottom">
          <div className="left">
            <div className="item" onClick={handleOpenCreatePost}>
              <img src={Image} alt="add image" />
              <span>Add Image</span>
            </div>
           
          </div>
          {/* <div className="right">
            <button onClick={handleOpenCreatePost}>Share</button>
          </div> */}
        </div>
      </div>

      {openCreatePost && (
        <CreatePost
          setOpenCreatePost={setOpenCreatePost}
          userId={currentUser.id}
        />
      )}
    </div>
  );
};

export default Share;
