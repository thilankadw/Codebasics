import "./comments.scss";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  DeleteOutline,
  EditOutlined,
  SaveOutlined,
  CancelOutlined
} from "@mui/icons-material";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchComments();
    fetchLikes();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/post-reaction/post/${postId}/comments`);
      setComments(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/post-reaction/post/${postId}/likes`);
      setLikeCount(res.data);
    } catch (err) {
      console.error("Failed to fetch likes:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post("http://localhost:8080/api/post-reaction/create-post-interaction", {
        content: newComment,
        postId,
        userId: currentUser.id,
        type: "COMMENT",
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleLikePost = async () => {
    try {
      await axios.post("http://localhost:8080/api/post-reaction/create-post-interaction", {
        postId,
        userId: currentUser.id,
        type: "REACTION",
      });
      fetchLikes();
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const startEditing = (id, content) => {
    setEditingId(id);
    setEditingContent(content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingContent("");
  };

  const handleUpdateComment = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/post-reaction/update-post-interaction/${id}`, {
        content: editingContent,
        postId,
        userId: currentUser.id,
        type: "COMMENT",
      });
      setEditingId(null);
      setEditingContent("");
      fetchComments();
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/post-reaction/delete-post-interaction/${id}`);
      fetchComments();
      console.log(id);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic || "/default.png"} alt="profile" />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Send</button>
      </div>

      <div className="postLikes" onClick={handleLikePost}>
        <FavoriteBorderOutlined /> {likeCount} Likes
      </div>

      {comments.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={"/default.png"} alt="user" />
          <div className="info">
            <span>User ID: {comment.userId}</span>
            {editingId === comment.id ? (
              <>
                <input
                  type="text"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
              </>
            ) : (
              <p>{comment.content}</p>
            )}
          </div>
          <div className="details">
            <span>{moment(comment.timestamp).fromNow()}</span>
            {comment.userId === currentUser.id && (
              <div className="actions">
                {editingId === comment.id ? (
                  <>
                    <SaveOutlined onClick={() => handleUpdateComment(comment.id)} />
                    <CancelOutlined onClick={cancelEditing} />
                  </>
                ) : (
                  <>
                    <EditOutlined onClick={() => startEditing(comment.id, comment.content)} />
                    <DeleteOutline onClick={() => handleDeleteComment(comment.id)} />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
