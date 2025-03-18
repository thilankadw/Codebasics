import "./post.scss";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import Comments from "../comments/Comments";
import {
  FavoriteBorderOutlined as LikeIcon,
  FavoriteOutlined as LikedIcon,
  TextsmsOutlined as CommentIcon,
  ShareOutlined as ShareIcon,
  MoreHoriz as MoreIcon,
} from "@mui/icons-material";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [likes, setLikes] = useState([1, 2]); // Dummy liked user IDs
  const { currentUser } = useContext(AuthContext);

  const handleLike = () => {
    if (likes.includes(currentUser.id)) {
      setLikes(likes.filter((id) => id !== currentUser.id));
    } else {
      setLikes([...likes, currentUser.id]);
    }
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={`https://via.placeholder.com/50`} alt="User" />
            <div className="details">
              <Link to={`/profile/${post.userId}`} className="name">
                {post.name || "John Doe"}
              </Link>
              <span className="date">{moment(post.createdAt || new Date()).fromNow()}</span>
            </div>
          </div>
          <MoreIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={() => alert("Post deleted (dummy action)")}>Delete</button>
          )}
        </div>

        <div className="content">
          <p>{post.desc || "This is a dummy post description."}</p>
          {post.img && <img src={`https://via.placeholder.com/200`} alt="Post" />}
        </div>

        <div className="info">
          <div className="item" onClick={handleLike}>
            {likes.includes(currentUser.id) ? (
              <LikedIcon style={{ color: "red" }} />
            ) : (
              <LikeIcon />
            )}
            {likes.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <CommentIcon /> See Comments
          </div>
          <div className="item">
            <ShareIcon /> Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
