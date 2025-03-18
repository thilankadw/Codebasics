import { createContext, useEffect, useState } from "react";

// Dummy user data
const dummyUser = {
  id: 1,
  name: "John Doe",
  email: "johndoe@example.com",
  profilePic: "profile.jpg",
  coverPic: "cover.jpg",
};

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // Simulate loading user from localStorage or use dummy data
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || dummyUser
  );

  const login = async (inputs) => {
    // Simulate a successful login with dummy data
    console.log("Login attempt with:", inputs);
    // Here you could validate the inputs or check credentials if needed

    // Simulate setting the user data after successful login
    setCurrentUser(dummyUser); // Set dummy user data
  };

  useEffect(() => {
    // Store the current user data in localStorage
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
