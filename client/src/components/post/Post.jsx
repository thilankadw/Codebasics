import "./post.scss";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import Comments from "../comments/Comments";
import axios from "axios";
import {
  FavoriteBorderOutlined as LikeIcon,
  FavoriteOutlined as LikedIcon,
  TextsmsOutlined as CommentIcon,
  ShareOutlined as ShareIcon,
} from "@mui/icons-material";
import UpdatePost from "../updatepost/updatepost";
import Profilepicture from "../../assets/profilepic.png";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [likes, setLikes] = useState([1, 2]);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openUpdatePost, setOpenUpdatePost] = useState(false);

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

  const confirmDelete = () => {
    setShowDeletePopup(true);
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${post.id}`);
      alert("Post deleted successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete the post!");
    }
  };

  const handleUpdate = () => {
    navigate(`/update-post/${post.id}`);
  };

  return (
    <div className="post">
      <div className="container">
        {/* User Info */}
        <div className="user">
          <div className="userInfo">
            <img
              src={
                post.user.profilePic
                            ? post.user.profilePic.startsWith("https://")
                              ? post.user.profilePic
                              : `http://localhost:8080/uploads/${post.user?.profilePic}`
                            : Profilepicture
                        }
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

        {/* Edit/Delete buttons at the bottom (only visible to the post owner) */}
        {post.user?.id === currentUser.id && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              padding: "10px",
              borderTop: "1px solid #ccc",
            }}
          >
            <button
              onClick={() => setOpenUpdatePost(true)}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={confirmDelete}
              style={{
                backgroundColor: "red",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {openUpdatePost && (
        <UpdatePost
          setOpenUpdatePost={setOpenUpdatePost}
          post={post}
          userId={currentUser.id}
        />
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={cancelDelete}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              textAlign: "center",
              minWidth: "300px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "20px" }}>Confirm Delete</h2>
            <p>Are you sure you want to delete this post?</p>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={handleDelete}
                style={{
                  backgroundColor: "red",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                style={{
                  backgroundColor: "gray",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
