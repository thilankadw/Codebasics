import Post from "../post/Post";
import "./posts.scss";

const Posts = ({ userId }) => {
  // Dummy posts data
  const dummyPosts = [
    {
      id: 1,
      userId: 101,
      name: "Alice Johnson",
      profilePic: "https://via.placeholder.com/50",
      createdAt: new Date(),
      desc: "This is a dummy post about React development.",
      img: "https://via.placeholder.com/200",
    },
    {
      id: 2,
      userId: 102,
      name: "Bob Smith",
      profilePic: "https://via.placeholder.com/50",
      createdAt: new Date(),
      desc: "Another dummy post with a nice image.",
      img: "https://via.placeholder.com/200",
    },
  ];

  // Filter posts by userId if provided
  const filteredPosts = userId ? dummyPosts.filter((post) => post.userId === userId) : dummyPosts;

  return (
    <div className="posts">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => <Post post={post} key={post.id} />)
      ) : (
        <div className="no-posts">No posts available.</div>
      )}
    </div>
  );
};

export default Posts;
