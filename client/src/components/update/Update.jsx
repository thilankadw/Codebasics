import { useContext, useState, useEffect } from "react";
import "./update.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const Update = ({ setOpenUpdate }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const id = currentUser.id;
  const [user, setUser] = useState(null);
  
  const [texts, setTexts] = useState({
    email: currentUser.email,
    //password: "password123", // default or blank if you want
    name: currentUser.name,
    city: user?.city || " ",
    website: user?.website || " ",
    username: currentUser.username
  });
  

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/auth/users/${id}`);
        setUser(res.data);
        console.log(res.data);
  
        // Update texts when user data is fetched
        setTexts((prev) => ({
          ...prev,
          city: res.data.city || "",
          website: res.data.website || ""
        }));
  
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
  
    fetchUser();
  }, [id]);
  

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData) => {
      return axios.put(`http://localhost:8080/api/auth/userupdate/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
    }
  );
  const handleClick = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append(
      "registerDTO",
      new Blob(
        [JSON.stringify(texts)],
        { type: "application/json" }
      )
    );
  
    if (profile) {
      formData.append("profilePic", profile);
    }
    if (cover) {
      formData.append("coverPic", cover);
    }
  
    mutation.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
        setOpenUpdate(false);
        setCover(null);
        setProfile(null);
        window.location.reload(); // <<== ADD THIS to reload the page
      },
    });
  };
  

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
              <img
        src={
          cover
            ? URL.createObjectURL(cover)
            : currentUser.coverPic
            ? `http://localhost:8080/uploads/${currentUser.coverPic}`
            : "/cover.jpg"
        }
        alt="cover"
      />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />
          <label htmlFor="profile">
  <span>Profile Picture</span>
  <div className="imgContainer">
  <img
        src={
          profile
            ? URL.createObjectURL(profile)
            : currentUser.profilePic
            ? `http://localhost:8080/uploads/${currentUser.profilePic}`
            : "/defaultProfile.jpg"
        }
        alt="profile"
      />
    <CloudUploadIcon className="icon" />
  </div>
</label>
<input
  type="file"
  id="profile"
  style={{ display: "none" }}
  onChange={(e) => setProfile(e.target.files[0])}
/>
          </div>
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
         
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            value={texts.city}
            name="city"
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            value={texts.website}
            name="website"
            onChange={handleChange}
          />
          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Update;
