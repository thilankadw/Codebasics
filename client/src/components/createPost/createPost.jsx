import { useState } from "react";
import "./createpost.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const CreatePost = ({ setOpenCreatePost, userId }) => {
  const [description, setDescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData) => {
      return axios.post("http://localhost:8080/api/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
        setOpenCreatePost(false);
        setDescription("");
        setMediaFiles([]);
        setMediaPreviews([]);
      },
      onError: (error) => {
        alert("Error creating post: " + error.response?.data?.message || "Unknown error");
      }
    }
  );

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleMediaChange = (e) => {
    const files = e.target.files;
    if (files.length > 3) {
      alert("You can upload a maximum of 3 files.");
      return;
    }
    setMediaFiles(Array.from(files));
    const previews = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setMediaPreviews(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("description", description);

    // Append each file individually
    mediaFiles.forEach((file) => {
      formData.append("files", file); // <<< important: field name must match backend: "files"
    });

    mutation.mutate(formData);
  };

  return (
    <div className="createPost">
      <div className="wrapper">
        <h1>Create a Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="mediaUpload">
            <label htmlFor="mediaFiles">
              <span>Upload Media</span>
              <div className="imgContainer">
                {mediaPreviews.length > 0 ? (
                  mediaPreviews.map((preview, index) => (
                    <img key={index} src={preview} alt="media" />
                  ))
                ) : (
                  <CloudUploadIcon className="icon" />
                )}
              </div>
            </label>
            <input
              type="file"
              id="mediaFiles"
              multiple
              style={{ display: "none" }}
              onChange={handleMediaChange}
              accept="image/*,video/*"
            />
          </div>

          <label>Description</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="What’s on your mind?"
          ></textarea>

          <button type="submit" className="submitButton">
            Post
          </button>
        </form>
        <button className="close" onClick={() => setOpenCreatePost(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
