import "./posts.scss";
import Post from "../post/Post";
import { useEffect, useState } from "react";
import axios from "axios";

const Posts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
        setFilteredPosts(res.data); // initialize filtered posts
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = posts.filter((post) =>
      post.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="posts">
      {/* Header section */}
      <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "0px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  }}
>
  <h2
    style={{
      fontSize: "32px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#333",
    }}
  >
    My Posts
  </h2>
  <input
    type="text"
    placeholder="Search posts..."
    value={searchTerm}
    onChange={handleSearch}
    style={{
      padding: "12px 20px",
      width: "300px",
      borderRadius: "30px",
      border: "1px solid #ccc",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.3s ease",
    }}
    onFocus={(e) => (e.target.style.borderColor = "#007bff")}
    onBlur={(e) => (e.target.style.borderColor = "#ccc")}
  />
</div>


      {/* Posts list */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => <Post post={post} key={post.id} />)
      ) : (
        <div className="no-posts">No posts available.</div>
      )}
    </div>
  );
};

export default Posts;
