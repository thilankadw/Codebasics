import "./posts.scss";
import Post from "../post/Post";
import { useEffect, useState } from "react";
import axios from "axios";

const Posts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res;
        if (userId) {
          res = await axios.get(`http://localhost:8080/api/posts/user/${userId}`);
        } else {
          res = await axios.get(`http://localhost:8080/api/posts`);
        }
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="posts">
      {posts.length > 0 ? (
        posts.map((post) => <Post post={post} key={post.id} />)
      ) : (
        <div className="no-posts">No posts available.</div>
      )}
    </div>
  );
};

export default Posts;
