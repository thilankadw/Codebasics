import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useState } from "react";
// Dummy user data
const currentUser = {
  name: "John Doe",
  profilePic: "profile.jpg",
};

const dummyMakeRequest = {
  post: (url, data) => {
    // Simulate a successful request with dummy data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { msg: "Post created successfully", imgUrl: "dummy_image_url" } });
      }, 1000);
    });
  },
};

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Simulate an upload request
      const res = await dummyMakeRequest.post("/upload", formData);
      return res.data.imgUrl;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    // Here you would usually call mutation.mutate, but using dummy data
    console.log({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={"/upload/" + currentUser.profilePic} alt="profile" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="file preview" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="add image" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="add place" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="tag friends" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
