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
  const [likes, setLikes] = useState([1, 2]);
  const [previewMedia, setPreviewMedia] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const handleLike = () => {
    if (likes.includes(currentUser.id)) {
      setLikes(likes.filter((id) => id !== currentUser.id));
    } else {
      setLikes([...likes, currentUser.id]);
    }
  };

  const isVideo = (url) => {
    const videoExtensions = [".mp4", ".mov", ".avi", ".webm"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const openPreview = (mediaUrl) => {
    setPreviewMedia(mediaUrl);
  };

  const closePreview = () => {
    setPreviewMedia(null);
  };

  return (
    <div className="post">
      <div className="container">
        {/* User Info */}
        <div className="user">
          <div className="userInfo">
            <img
              src={post.user?.profilePic || "https://via.placeholder.com/50"}
              alt="User"
            />
            <div className="details">
              <Link to={`/profile/${post.user?.id}`} className="name">
                {post.user?.name || "Unknown User"}
              </Link>
              <span className="date">
                {moment(post.createdAt || new Date()).fromNow()}
              </span>
            </div>
          </div>
          <MoreIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.user?.id === currentUser.id && (
            <button onClick={() => alert("Post deleted (dummy action)")}>
              Delete
            </button>
          )}
        </div>

        {/* Description */}
        <div className="description">
          <p>{post.description || "No description available."}</p>
        </div>

        {/* Media Gallery */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="media-gallery">
            {post.mediaUrls.map((mediaUrl, index) => {
              const decodedUrl = decodeURIComponent(mediaUrl);
              const fullUrl = `http://localhost:8080/uploads/${decodedUrl}`;

              return (
                <div
                  key={index}
                  className="media-item"
                  onClick={() => openPreview(fullUrl)}
                  style={{ cursor: "pointer" }}
                >
                  {isVideo(decodedUrl) ? (
                    <video
                      src={fullUrl}
                      className="post-media"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={fullUrl}
                      alt={`Post Media ${index + 1}`}
                      className="post-media"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Like, Comment, Share */}
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

        {/* Comments */}
        {commentOpen && <Comments postId={post.id} />}

        {/* Preview Modal */}
        {previewMedia && (
          <div className="media-preview" onClick={closePreview}>
            <div className="media-content" onClick={(e) => e.stopPropagation()}>
              {isVideo(previewMedia) ? (
                <video src={previewMedia} controls autoPlay className="preview-video" />
              ) : (
                <img src={previewMedia} alt="Preview" className="preview-image" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
