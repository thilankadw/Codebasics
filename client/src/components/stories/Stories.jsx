import { useState } from "react";
import "./stories.scss";
// Dummy user data
const currentUser = {
  name: "John Doe",
  profilePic: "profile.jpg",
};

// Dummy makeRequest object with mocked response
const dummyMakeRequest = {
  get: (url) => {
    // Simulate a delay and return dummy stories
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { id: 1, img: "story1.jpg", name: "Jane" },
            { id: 2, img: "story2.jpg", name: "Mark" },
            { id: 3, img: "story3.jpg", name: "Anna" },
          ],
        });
      }, 1000); // Simulate network delay
    });
  },
};

const Stories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Simulating fetching data using dummyMakeRequest
  useState(() => {
    dummyMakeRequest
      .get("/stories")
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Something went wrong");
        setIsLoading(false);
      });
  }, []);

  // TODO: Add story using react-query mutations and use upload function.

  return (
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="profile" />
        <span>{currentUser.name}</span>
        <button>+</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((story) => (
            <div className="story" key={story.id}>
              <img src={story.img} alt={story.name} />
              <span>{story.name}</span>
            </div>
          ))}
    </div>
  );
};

export default Stories;
